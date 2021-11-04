import knex from 'knex';
import config from '../../config/config.json';
import { ImageInDB } from '../types/Image';
import Reply from '../types/Reply';
import StorageProvider from '../types/StorageProvider';
import Topic from '../types/Topic';

class SQLStorageProvider implements StorageProvider {
  db = knex({
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

  async getAllTopics() {
    const topics = await this.db<Topic>('topicList')
      .select('title', 'topicID', 'authorName', 'authorID', 'lastReplyTime', 'reply', 'isElite')
      .orderBy('lastReplyTime', 'desc');
    return topics;
  }

  async getTopic(topicID: string | number) {
    const topics = await this.db<Topic>('topicList')
      .select('title', 'topicID', 'authorName', 'authorID', 'isElite', 'content', 'createTime', 'deleteTime')
      .where('topicID', '=', Number(topicID));
    return topics.length === 1 ? topics[0] : null;
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
}

export default SQLStorageProvider;
