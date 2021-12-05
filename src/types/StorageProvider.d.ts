import Topic, { TopicWhileGetAll } from './Topic';
import UserType from './UserType';

export default class StorageProvider {
  /** 初始化：建表 */
  init(): Promise<void>;

  /** 获取帖子列表，该查询只查询帖子的部分字段
   * @param skip 跳过前多少帖（用于分页）
   * @param limit 共获取多少帖（用于分页）
   * @param needDeleted 是否仅获取已删除的帖子
   * @param needElite 是否仅获取精品帖
   */
  getAllTopics(
    skip: number,
    limit: number,
    needDeleted: boolean,
    needElite: boolean,
  ): Promise<TopicWhileGetAll[]>;

  /** 获取帖子，该查询也只查询帖子的部分字段
   * @param topicID 帖子ID
   */
  getTopic(
    topicID: string | number,
  ): Promise<Pick<
    Topic,
    'title' | 'topicID' | 'authorName' | 'authorID' | 'content' | 'isElite' | 'createTime'
  > | null>;

  /** 获取一个帖子的所有回复
   * @param topicID 帖子ID
   */
  getComments(topicID: string | number): Promise<Reply[]>;

  /** 获取图片
   * @param imgID 图片ID
   */
  getImg(imgID: string): Promise<Blob | null>;

  /** 获取帖子总页数
   * @param deleted 是否仅获取已删除的帖子
   * @param elite 是否仅获取精品帖
   */
  getPages(deleted: boolean, elite: boolean): Promise<number>;

  /** 对帖子进行全文搜索 */
  fullTextQueryTopic(queryStr: string): Promise<TopicWhileGetAll[]>;

  /** 插入帖子 */
  insertNewTopic(
    topic: Pick<Topic, 'authorID' | 'authorName' | 'content' | 'title'>,
  ): Promise<Topic>;

  /** 用户相关功能，内部函数注释见
   * {@link StorageProvider.User StorageProvider} 里的定义
   */
  User: {
    /** 创建用户
     * @param user 用户
     */
    createUser: (
      user: Pick<UserType, 'password' | 'nickname' | 'username' | 'lastRevokeTime'>,
    ) => Promise<void>;

    /** 获取单个用户信息
     * @param id 用户 id
     * @param username 用户名
     * @param forAuth 是否是为验证用户而获取信息（会返回密码 hash 和 lastRevokeTime）
     */
    getUser: (
      {
        id,
        username,
      }: {
        id?: string | undefined;
        username?: string | undefined;
      },
      forAuth = false,
    ) => Promise<Pick<
      UserType,
      'avatar' | 'id' | 'nickname' | 'username' | 'lastRevokeTime' | 'password'
    > | null>;

    /** 更新用户信息
     * @param userId 用户 ID
     * @param userInfo 用户信息的一部分
     */
    updateUser: (userId: string, userInfo: Partial<UserType>) => Promise<void>;

    /** 删除用户
     * @param userId 用户 ID
     */
    deleteUser: (userId: string) => Promise<void>;
  };
}
