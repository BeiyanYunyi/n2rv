import axios from 'axios';
import Reply from '../../src/types/Reply';
import Topic from '../../src/types/Topic';
import UserType from '../../src/types/UserType';

class AuthedApiWrapper {
  token = `Bearer ${localStorage.getItem('apiToken')}`;

  client = axios.create({ headers: { Authorization: this.token } });

  changeToken(token: string) {
    this.token = `Bearer ${token}`;
    this.client = axios.create({ headers: { Authorization: this.token } });
  }

  async login(authProp: { username: string; password: string }) {
    try {
      // 登录时不带 Authentication 头
      const { data }: { data: { token: string } } = await axios.post('/api/auth', authProp);
      this.changeToken(data.token);
      localStorage.setItem('apiToken', data.token);
      return data.token;
    } catch (e) {
      return '';
    }
  }

  async getUser(username: string) {
    const { data }: { data: Pick<UserType, 'avatar' | 'id' | 'nickname' | 'username'> } =
      await this.client.get(`/api/users/username/${username}`);
    return data;
  }

  async getMe() {
    const { data }: { data: Pick<UserType, 'avatar' | 'id' | 'nickname' | 'username'> } =
      await this.client.get('/api/users/me');
    return data;
  }

  async logout() {
    const { status } = await this.client.get('/api/auth/revokeToken');
    if (status === 200) {
      localStorage.removeItem('apiToken');
      return true;
    }
    return false;
  }

  async postTopic(postTopicProps: { content: string; title: string }) {
    const { data }: { data: { topic: Topic } } = await this.client.post(
      '/api/localTopic',
      postTopicProps,
    );
    return data.topic;
  }

  async replyTopic(replyTopicProps: {
    content: string;
    topicID: string;
    quotingID: string | undefined;
  }) {
    const { data }: { data: Reply } = await this.client.post('/api/localReply', replyTopicProps);
    return data;
  }
}

const authedApiWrapper = new AuthedApiWrapper();

export default authedApiWrapper;
