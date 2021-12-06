import knex from 'knex';
import tsquery from 'pg-tsquery';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config/config.json';
import ConflictError from '../../server/errors/ConflictError';
import NotFoundError from '../../server/errors/NotFoundError';
import { ImageInDB } from '../types/Image';
import Reply from '../types/Reply';
import StorageProvider from '../types/StorageProvider';
import Topic from '../types/Topic';
import UserType from '../types/UserType';

const topicWhileGetAll = [
  'title',
  'topicID',
  'authorName',
  'authorID',
  'lastReplyTime',
  'reply',
  'isElite',
];

const dbVersionLatest = 1;

class SQLStorageProvider implements StorageProvider {
  /** 数据库实例 */
  private db = knex({
    client: 'pg',
    connection: {
      host: config.address,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    },
    useNullAsDefault: true,
    searchPath: [config.groupURL.substring(29).replace('/', ''), 'public'],
  });

  /** 判断是否已初始化，每次启动只需要初始化一次 */
  private inited = false;

  async init() {
    if (!this.inited) {
      await this.db.schema.createSchemaIfNotExists(config.groupURL.substring(29).replace('/', ''));
      const existTopicList = await this.db.schema.hasTable('topicList');
      if (!existTopicList)
        await this.db.schema.createTable('topicList', (table) => {
          table.string('title');
          table.string('authorID');
          table.string('authorName');
          table.integer('reply').unsigned();
          table.bigInteger('lastReplyTime').nullable().unsigned().index();
          table.string('topicID').primary();
          table.boolean('isElite');
          table.text('content').nullable();
          table.bigInteger('lastFetchTime').nullable();
          table.bigInteger('createTime').nullable();
          table.bigInteger('deleteTime').nullable();
        });
      const existReplyTable = await this.db.schema.hasTable('reply');
      if (!existReplyTable)
        await this.db.schema.createTable('reply', (table) => {
          table.string('replyID').primary().unsigned();
          table.string('topicID');
          table.string('authorID');
          table.string('authorName');
          table.boolean('isPoster');
          table.bigInteger('replyTime').unsigned().index();
          table.boolean('quoting');
          table.text('quotingImage').nullable();
          table.text('quotingText').nullable();
          table.string('quotingAuthorID').nullable();
          table.string('quotingAuthorName').nullable();
          table.text('image').nullable();
          table.text('content');
          table.integer('votes').defaultTo(0);
          table.foreign('topicID').references('topicList.topicID');
        });
      const existImageTable = await this.db.schema.hasTable('image');
      if (!existImageTable)
        await this.db.schema.createTable('image', (table) => {
          table.bigIncrements('id').primary();
          table.string('imgID').index().unique();
          table.binary('imgContent');
        });
      const hasUserTable = await this.db.schema.hasTable('user');
      if (!hasUserTable) {
        await this.db.schema.createTable('user', (table) => {
          table.string('id', 36).primary().index();
          table.text('username').unique().index();
          table.text('nickname').nullable();
          table.text('password');
          table.bigInteger('avatar').nullable();
          table.bigInteger('lastRevokeTime');
          table.boolean('isVerified');
        });
      }
      const hasVersionTable = await this.db.schema.hasTable(`dbVersion`);
      if (!hasVersionTable) {
        await this.db.schema.createTable(`dbVersion`, (table) => {
          table.integer('dbVersion').primary();
        });
        await this.db(`dbVersion`).insert({ dbVersion: dbVersionLatest });
      }
      this.inited = true;
    }
  }

  async getAllTopics(skip: number, limit: number, needDeleted: boolean, needElite: boolean) {
    const query0 = this.db<Topic>('topicList')
      .select(...topicWhileGetAll)
      .orderBy('lastReplyTime', 'desc')
      .offset(skip)
      .limit(limit);
    const query1 = needDeleted ? query0.whereNotNull('deleteTime') : query0;
    const query2 = needElite ? query1.where('isElite', true) : query1;
    const topics = await query2;
    return topics;
  }

  async getTopic(topicID: string | number) {
    const topic = await this.db<Topic>('topicList')
      .first(
        'title',
        'topicID',
        'authorName',
        'authorID',
        'isElite',
        'content',
        'createTime',
        'deleteTime',
      )
      .where('topicID', '=', topicID);
    return topic || null;
  }

  async getComments(topicID: string | number) {
    const comments = await this.db<Reply>('reply')
      .select('*')
      .where('topicID', '=', topicID)
      .orderBy('replyTime', 'asc');
    return comments;
  }

  async getImg(imgID: string) {
    const img = await this.db<ImageInDB>('image').first('imgContent').where('imgID', imgID);
    if (img) return img.imgContent;
    return null;
  }

  async getPages(deleted: boolean, elite: boolean) {
    const query0 = this.db<Topic>('topicList');
    const query1 = deleted ? query0.whereNotNull('deleteTime') : query0;
    const query2 = elite ? query1.where('isElite', true) : query1;
    const count = await query2.count('topicID');
    return Math.floor(Number(count[0].count) / 50) + 1;
  }

  async fullTextQueryTopic(queryStr: string) {
    const parser = tsquery();
    const topicsContentPms = this.db<Topic>('topicList')
      .select(...topicWhileGetAll)
      .whereRaw("to_tsvector('testzhcfg', content) @@ to_tsquery('testzhcfg', ?)", [
        parser(queryStr),
      ]);
    const topicsTitlePms = this.db<Topic>('topicList')
      .select(...topicWhileGetAll)
      .whereRaw("to_tsvector('testzhcfg', title) @@ to_tsquery('testzhcfg', ?)", [
        parser(queryStr),
      ]);
    const [topicsTitle, topicsContent] = await Promise.all([topicsTitlePms, topicsContentPms]);
    const topicTitleId = topicsTitle.map((topic) => topic.topicID);
    topicsContent.forEach((topic) => {
      if (!topicTitleId.includes(topic.topicID)) topicsTitle.push(topic);
    });
    return topicsTitle;
  }

  async insertNewTopic(
    topic: Pick<Topic, 'authorID' | 'authorName' | 'content' | 'title'>,
  ): Promise<Topic> {
    const now = Math.floor(Date.now() / 1000);
    const topicID = uuidv4();
    const topicToInsert: Topic = {
      ...topic,
      topicID,
      reply: '0',
      lastFetchTime: now,
      lastReplyTime: now,
      deleteTime: -now,
      isElite: false,
      createTime: now,
    };
    await this.db('topicList').insert(topicToInsert);
    return topicToInsert;
  }

  async getComment(
    replyID: string,
  ): Promise<Pick<Reply, 'authorID' | 'authorName' | 'image' | 'content'> | null> {
    const reply =
      (await this.db<Reply>('reply')
        .first('authorID', 'authorName', 'content', 'image')
        .where('replyID', replyID)) || null;
    return reply;
  }

  async insertOrReplaceReply(reply: Reply): Promise<Reply> {
    await this.db<Reply>('reply').insert(reply).onConflict('replyID').merge();
    return reply;
  }

  User = {
    createUser: async (
      user: Pick<UserType, 'password' | 'nickname' | 'username' | 'lastRevokeTime'>,
    ) => {
      const id = uuidv4();
      const userInDB = await this.db<UserType>('user')
        .first('username')
        .where('username', user.username);
      if (userInDB) throw new ConflictError('用户已存在');
      const userToInsert: UserType = { id, ...user, avatar: null, isVerified: false };
      await this.db<UserType>('user').insert(userToInsert);
    },

    getUser: async (
      {
        id,
        username,
      }: {
        id?: string | undefined;
        username?: string | undefined;
      },
      forAuth = false,
    ) => {
      const queryAry = ['avatar', 'id', 'nickname', 'username'];
      if (forAuth) queryAry.push('password', 'lastRevokeTime');
      if (id) {
        const user = await this.db<UserType>('user')
          .first(...queryAry)
          .where('id', id);
        if (!user) return null;
        return user;
      }
      if (username) {
        const user = await this.db<UserType>('user')
          .first(...queryAry)
          .where('username', username);
        if (!user) return null;
        return user;
      }
      return null;
    },

    updateUser: async (userId: string, userInfo: Partial<UserType>) => {
      const userToUpdate = await this.db<UserType>('user').first('id').where('id', userId);
      if (!userToUpdate) throw new NotFoundError('用户不存在');
      const userInfoToUpdate = {
        id: userId,
        ...userInfo,
      };
      await this.db<UserType>('user').where('id', userId).update(userInfoToUpdate);
    },

    deleteUser: async (userId: string) => {
      const userToUpdate = await this.db<UserType>('user').first('id').where('id', userId);
      if (!userToUpdate) throw new NotFoundError('用户不存在');
      await this.db<UserType>('user').where('id', userId).delete();
    },
  };
}

export default SQLStorageProvider;
