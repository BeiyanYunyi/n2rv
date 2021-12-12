import { SyncOptions } from 'sequelize/dist';
import sequelize from '../db';
import config from '../../../../config/config.json';
import Image from './Image';
import Reply from './Reply';
import TopicList from './TopicList';
import User from './User';

(async () => {
  const options: SyncOptions = {
    alter: true,
  };
  try {
    await sequelize.createSchema(`"${config.groupURL.substring(29).replace('/', '')}"`, {
      logging: true,
    });
  } catch (e) {
    console.log('Schema already exists.');
  }
  User.sync(options);
  TopicList.sync(options);
  Reply.sync(options);
  Image.sync(options);
})();

export default { User, TopicList, Reply, Image };
