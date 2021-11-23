import axios from 'axios';
import Reply from '../../src/types/Reply';
import Topic, { TopicWhileGetAll } from '../../src/types/Topic';

const apiWrapper = {
  client: axios.create({ baseURL: '/api' }),
  async getTopics(page: number, needDeleted: boolean, needElite: boolean) {
    const { data }: { data: { topicList: TopicWhileGetAll[]; pages: number } } =
      await this.client.get('/topic', {
        params: {
          page: page - 1,
          needDeleted: needDeleted ? 1 : undefined,
          needElite: needElite ? 1 : undefined,
        },
      });
    return data;
  },
  async getTopic(id: string | number) {
    const { data }: { data: { topic: Topic; comments: Reply[] } } =
      await this.client.get(`/topic/${id}`);
    return data;
  },
  async searchTopic(searchStr: string, page: number) {
    const { data }: { data: Topic[] } = await this.client.get(
      '/search/topics',
      { params: { page: page - 1, query: searchStr } },
    );
    return data;
  },
};

export default apiWrapper;
