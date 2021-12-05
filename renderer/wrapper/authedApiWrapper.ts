import axios from 'axios';
import Topic from '../../src/types/Topic';

class AuthedApiWrapper {
  token = `Bearer ${localStorage.getItem('apiToken')}`;

  client = axios.create({ headers: { Authorization: this.token }, baseURL: '/api' });

  changeToken(token: string) {
    this.token = `Bearer ${token}`;
    this.client = axios.create({ headers: { Authorization: this.token } });
  }

  async login(authProp: { username: string; password: string }) {
    try {
      const { data }: { data: { token: string } } = await axios.post('/auth', authProp);
      this.changeToken(data.token);
      localStorage.setItem('apiToken', data.token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async logout() {
    const { status } = await this.client.get('/auth/revokeToken');
    if (status === 200) return true;
    return false;
  }

  async postTopic(postTopicProps: { content: string; title: string }) {
    const { data }: { data: { topic: Topic } } = await this.client.post(
      '/localTopic',
      postTopicProps,
    );
    return data.topic;
  }
}

const authedApiWrapper = new AuthedApiWrapper();

export default authedApiWrapper;
