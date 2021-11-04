import Topic from './Topic';

export default class StorageProvider {
  getAllTopics(): Promise<
  Pick<Topic, 'title' | 'topicID' | 'authorName' | 'authorID' | 'lastReplyTime' | 'reply' | 'isElite'>[]
  >;
  getTopic(
    topicID: string | number,
  ): Promise<Pick<
  Topic,
  'title' | 'topicID' | 'authorName' | 'authorID' | 'content' | 'isElite' | 'createTime'
  > | null>;
  getComments(topicID: string | number): Promise<Reply[]>;
}
