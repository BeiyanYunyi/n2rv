/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';
import config from '../../../config/config.json';

const sequelize =
  process.env.NODE_ENV === 'production'
    ? new Sequelize(`postgres://${config.databaseConfig.address}`, {
        dialectOptions: {},
        username: config.databaseConfig.username,
        password: config.databaseConfig.password,
        port: config.databaseConfig.port,
        database: config.databaseConfig.database,
        logging: false,
      })
    : new Sequelize('postgres://postgres@localhost', { database: config.databaseConfig.database });

export const connectToDatabase = async () => {
  await sequelize.authenticate();
  console.log('database connected');
};

export default sequelize;
