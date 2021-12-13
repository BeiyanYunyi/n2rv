import tsquery from 'pg-tsquery';
import { Op, QueryTypes, WhereOperators } from 'sequelize/dist';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config/config.json';
import Reply from '../../types/Reply';
import StorageProvider from '../../types/StorageProvider';
import Topic, { TopicWhileGetAll } from '../../types/Topic';
import UserType from '../../types/UserType';
import ConflictError from '../errors/ConflictError';
import NotFoundError from '../errors/NotFoundError';
import sequelize, { connectToDatabase } from './sequelize/db';
import models from './sequelize/models';

class SequelizeStorageProvider implements StorageProvider {
  // eslint-disable-next-line class-methods-use-this
  async init(): Promise<void> {
    await connectToDatabase();
  }

  private topicWhileGetAll = [
    'title',
    'topicID',
    'authorName',
    'authorID',
    'lastReplyTime',
    'reply',
    'isElite',
  ];

  private parser = tsquery();

  /** 用于构造 deleteTime */
  // eslint-disable-next-line class-methods-use-this
  private deleteTimeConstructor(deleted: boolean, original: boolean) {
    let obj: WhereOperators = {};
    if (!deleted && !original) return { [Op.or]: [{ [Op.not]: null }, { [Op.is]: null }] };
    if (deleted) obj = { [Op.gte]: 0 };
    if (original) obj = { ...obj, [Op.lte]: 0 };
    return obj;
  }

  models = models;

  async getAllTopics(prop: {
    skip: number;
    limit: number;
    needDeleted: boolean;
    needElite: boolean;
    needOriginal: boolean;
  }): Promise<TopicWhileGetAll[]> {
    const del = this.deleteTimeConstructor(prop.needDeleted, prop.needOriginal);
    const topics = await this.models.TopicList.findAll({
      offset: prop.skip,
      limit: prop.limit,
      attributes: this.topicWhileGetAll,
      order: [['lastReplyTime', 'DESC']],
      where: {
        deleteTime: del,
        isElite: prop.needElite,
      },
    });
    if (!topics) return [];
    return topics as TopicWhileGetAll[];
  }

  async getTopic(
    topicID: string | number,
  ): Promise<Pick<
    Topic,
    'title' | 'topicID' | 'authorName' | 'authorID' | 'isElite' | 'content' | 'createTime'
  > | null> {
    const topic = await this.models.TopicList.findByPk(topicID, {
      attributes: [
        'title',
        'topicID',
        'authorName',
        'authorID',
        'isElite',
        'content',
        'createTime',
      ],
    });
    if (!topic) return null;
    return topic.toJSON();
  }

  async getComments(topicID: string | number): Promise<Reply[]> {
    const reply = await this.models.Reply.findAll({ where: { topicID } });
    return reply;
  }

  async getComment(
    replyID: string,
  ): Promise<Pick<Reply, 'authorName' | 'authorID' | 'content' | 'image'> | null> {
    const reply = await this.models.Reply.findByPk(replyID, {
      attributes: ['authorName', 'authorID', 'content', 'image'],
    });
    if (!reply) return null;
    return reply.toJSON();
  }

  async getImg(imgID: string): Promise<Blob | null> {
    const image = await this.models.Image.findOne({ where: { imgID }, attributes: ['imgContent'] });
    if (!image) return null;
    return image.toJSON().imgContent;
  }

  async getPages(props: { deleted: boolean; elite: boolean; original: boolean }): Promise<number> {
    const del = this.deleteTimeConstructor(props.deleted, props.original);
    const count = await this.models.TopicList.count({
      where: {
        deleteTime: del,
        isElite: props.elite,
      },
    });
    return Math.floor(count / 50) + 1;
  }

  async fullTextQueryTopic(queryStr: string): Promise<TopicWhileGetAll[]> {
    const parsedStr = this.parser(queryStr);
    const whereStr = this.topicWhileGetAll.map((val) => `"${val}"`).join(', ');
    const schema = config.groupURL.substring(29).replace('/', '');
    const topicsContentPms: Promise<TopicWhileGetAll[]> = sequelize.query(
      `SELECT ${whereStr} FROM "${schema}"."topicList" WHERE to_tsvector(content) @@ to_tsquery(?)`,
      { replacements: [parsedStr], type: QueryTypes.SELECT },
    );
    const topicsTitlePms: Promise<TopicWhileGetAll[]> = sequelize.query(
      `SELECT ${whereStr} FROM "${schema}"."topicList" WHERE to_tsvector(content) @@ to_tsquery(?)`,
      { replacements: [parsedStr], type: QueryTypes.SELECT },
    );
    const [topicsTitle, topicsContent] = await Promise.all([topicsTitlePms, topicsContentPms]);
    const topicTitleId = topicsTitle.map((topic) => topic.topicID);
    topicsContent.forEach((topic) => {
      if (!topicTitleId.includes(topic.topicID)) topicsTitle.push(topic);
    });
    return topicsTitle;
  }

  async insertNewTopic(
    topic: Pick<Topic, 'title' | 'authorName' | 'authorID' | 'content'>,
  ): Promise<Topic> {
    const now = Math.floor(Date.now() / 1000);
    const topicID = uuidv4();
    const topicToInsert: Topic = {
      ...topic,
      topicID,
      reply: 0,
      lastFetchTime: now,
      lastReplyTime: now,
      deleteTime: -now,
      isElite: false,
      createTime: now,
    };
    const insertedTopic = await this.models.TopicList.create(topicToInsert);
    return insertedTopic.toJSON();
  }

  async insertReply(reply: Reply): Promise<Reply> {
    const topicPms = this.models.TopicList.findByPk(reply.topicID);
    const replyPms = this.models.Reply.create(reply);
    const [topic, insertedReply] = await Promise.all([topicPms, replyPms]);
    if (topic) {
      await topic.update({ lastReplyTime: insertedReply.toJSON().replyTime });
    }
    await this.updateReplyCount(reply.topicID);
    return insertedReply.toJSON();
  }

  async updateReplyCount(topicID: string): Promise<void> {
    const topicToUpdatePms = this.models.TopicList.findByPk(topicID);
    const countPms = this.models.Reply.count({ where: { topicID } });
    const [topicToUpdate, count] = await Promise.all([topicToUpdatePms, countPms]);
    if (!topicToUpdate) throw new NotFoundError('回复不存在');
    await topicToUpdate.update({ reply: count });
  }

  async createUser(user: Pick<UserType, 'password' | 'nickname' | 'username' | 'lastRevokeTime'>) {
    const userInDB = await this.models.User.findOne({ where: { username: user.username } });
    if (userInDB) throw new ConflictError('用户已存在');
    const id = uuidv4();
    const userToInsert: UserType = { id, ...user, avatar: null, isVerified: false };
    await this.models.User.create(userToInsert);
  }

  async getUser(
    {
      id,
      username,
    }: {
      id?: string | undefined;
      username?: string | undefined;
    },
    forAuth = false,
  ) {
    const queryAry = ['avatar', 'id', 'nickname', 'username'];
    if (forAuth) queryAry.push('password', 'lastRevokeTime');
    if (id) {
      const user = await this.models.User.findByPk(id, { attributes: queryAry });
      if (!user) return null;
      return user.toJSON();
    }
    if (username) {
      const user = await this.models.User.findOne({ where: { username }, attributes: queryAry });
      if (!user) return null;
      return user.toJSON();
    }
    return null;
  }

  async updateUser(userId: string, userInfo: Partial<UserType>) {
    const userToUpdate = await this.models.User.findByPk(userId);
    if (!userToUpdate) throw new NotFoundError('用户不存在');
    await userToUpdate.update(userInfo);
  }

  async deleteUser(userId: string) {
    const userToDelete = await this.models.User.findByPk(userId);
    if (!userToDelete) throw new NotFoundError('用户不存在');
    await userToDelete.destroy();
  }
}

export default SequelizeStorageProvider;
