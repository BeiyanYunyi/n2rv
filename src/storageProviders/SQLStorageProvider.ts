/* eslint-disable max-classes-per-file */
import knex from 'knex';
import tsquery from 'pg-tsquery';
import config from '../../config/config.json';
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
      const hasUserTable = await this.db.schema.hasTable('user');
      if (!hasUserTable) {
        await this.db.schema.createTable('user', (table) => {
          table.bigIncrements('id').primary();
          table.text('username').unique();
          table.text('nickname').nullable();
          table.text('password');
          table.binary('avatar').nullable();
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
      .where('topicID', '=', Number(topicID));
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

  User = {
    createUser: async (user: UserType) => {
      const userInDB = await this.db<UserType>('user').first('id').where('id', user.id);
      if (userInDB) throw new NotFoundError('用户已存在');
      await this.db<UserType>('user').insert(user);
    },

    getUser: async (userId: string) => {
      const user = await this.db<UserType>('user')
        .first('avatar', 'id', 'nickname', 'username')
        .where('id', userId);
      if (!user) return null;
      return user;
    },

    updateUser: async (userId: string, userInfo: Partial<UserType>) => {
      const userToUpdate = await this.db<UserType>('user').first('id').where('id', userId);
      if (!userToUpdate) throw new NotFoundError('用户不存在');
      const userInfoToUpdate = {
        id: userId,
        avatar: userInfo.avatar,
        nickname: userInfo.nickname,
        username: userInfo.username,
        password: userInfo.password,
      };
      await this.db<UserType>('user').update(userInfoToUpdate);
    },

    deleteUser: async (userId: string) => {
      const userToUpdate = await this.db<UserType>('user').first('id').where('id', userId);
      if (!userToUpdate) throw new NotFoundError('用户不存在');
      await this.db<UserType>('user').where('id', userId).delete();
    },
  };
}

export default SQLStorageProvider;
