/* eslint-disable import/no-cycle */
import StorageProvider from '.';

export default class Scraper {
  parent: StorageProvider;
  insertOrReplaceTopicInfo(topics: Topic[]): Promise<void>;
  updateTopicInfo(topicID: string | number, topicPart: Partial<Topic>): Promise<void>;
  insertOrReplaceReplies(replies: Reply[]): Promise<void>;
}
