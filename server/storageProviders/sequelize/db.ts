/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize/dist';
import config from '../../../config/config.json';

const sequelize = new Sequelize(`postgres://${config.databaseConfig.address}`, {
  dialectOptions: {},
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  port: config.databaseConfig.port,
  database: config.databaseConfig.database,
  logging: !(process.env.NODE_ENV === 'production'),
});

export const connectToDatabase = async () => {
  await sequelize.authenticate();
  console.log('database connected');
};

export default sequelize;
