import axios from 'axios';
import Reply from '../../src/types/Reply';
import Topic, { TopicWhileGetAll } from '../../src/types/Topic';

const apiWrapper = {
  client: axios.create({ baseURL: '/api' }),
  async getTopics(page: number) {
    const { data }: { data: TopicWhileGetAll[] } = await this.client.get(`/topic?page=${page - 1}`);
    return data;
  },
  async getTopic(id: string | number) {
    const { data }: { data: { topic: Topic; comments: Reply[] } } = await this.client.get(`/topic/${id}`);
    return data;
  },
  async getPages() {
    const { data }: { data: { pages: number } } = await this.client.get('/pages');
    return data.pages;
  },
};

export default apiWrapper;
