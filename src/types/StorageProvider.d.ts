import Topic from './Topic';

export default class StorageProvider {
  getAllTopics(
    skip: number,
    limit: number,
    needDeleted: boolean,
    needElite: boolean,
  ): Promise<
    Pick<
      Topic,
      'title' | 'topicID' | 'authorName' | 'authorID' | 'lastReplyTime' | 'reply' | 'isElite'
    >[]
  >;
  getTopic(
    topicID: string | number,
  ): Promise<Pick<
    Topic,
    'title' | 'topicID' | 'authorName' | 'authorID' | 'content' | 'isElite' | 'createTime'
  > | null>;
  getComments(topicID: string | number): Promise<Reply[]>;
  getImg(imgID: string): Promise<Blob | null>;
  getPages(deleted: boolean, elite: boolean): Promise<number>;
  fullTextQueryTopic(queryStr: string, skip: number, limit: number): Promise<Topic[]>;
}
