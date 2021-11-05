import Topic from './Topic';

export default class StorageProvider {
  getAllTopics(
    skip: number,
    limit: number,
  ): Promise<Pick<Topic, 'title' | 'topicID' | 'authorName' | 'authorID' | 'lastReplyTime' | 'reply' | 'isElite'>[]>;
  getTopic(
    topicID: string | number,
  ): Promise<Pick<
    Topic,
    'title' | 'topicID' | 'authorName' | 'authorID' | 'content' | 'isElite' | 'createTime'
  > | null>;
  getComments(topicID: string | number): Promise<Reply[]>;
  getImg(imgID: string): Promise<Blob | null>;
  getPages(): Promise<number>;
}
