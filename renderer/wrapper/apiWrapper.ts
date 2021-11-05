import axios from 'axios';
import { TopicWhileGetAll } from '../../src/types/Topic';

const apiWrapper = {
  client: axios.create({ baseURL: '/api' }),
  async getAllTopics(page: number) {
    const { data }: { data: TopicWhileGetAll[] } = await this.client.get(`/topics?page=${page - 1}`);
    return data;
  },
  async getPages() {
    const { data }: { data: { pages: number } } = await this.client.get('/pages');
    return data.pages;
  },
};

export default apiWrapper;
