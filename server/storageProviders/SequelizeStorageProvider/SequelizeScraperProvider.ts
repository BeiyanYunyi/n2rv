/* eslint-disable import/no-cycle */
import SequelizeStorageProvider from '.';
import ReplyType from '../../../types/Reply';
import Scraper from '../../../types/StorageProvider/Scraper';
import TopicType from '../../../types/Topic';

export default class SequelizeScraperProvider implements Scraper {
  parent: SequelizeStorageProvider;

  constructor(parent: SequelizeStorageProvider) {
    this.parent = parent;
  }

  async insertOrReplaceTopicInfo(topics: TopicType[]): Promise<void> {
    await this.parent.models.TopicList.bulkCreate(topics, {
      updateOnDuplicate: ['authorID', 'authorName', 'isElite', 'lastReplyTime', 'title'],
    });
  }

  async updateTopicInfo(topicID: string | number, topicPart: Partial<TopicType>): Promise<void> {
    await this.parent.models.TopicList.update(topicPart, { where: { topicID } });
  }

  async insertOrReplaceReplies(replies: ReplyType[]): Promise<void> {
    await this.parent.models.Reply.bulkCreate(replies, { updateOnDuplicate: ['votes'] });
  }
}
