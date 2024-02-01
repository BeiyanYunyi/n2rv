import { DataTypes, Model } from 'sequelize';
import config from '../../../../config/config.json';
import UserType from '../../../../types/UserType';
import sequelize from '../db';

class User extends Model<UserType> {}

User.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    username: { type: DataTypes.TEXT, unique: true },
    nickname: { type: DataTypes.TEXT, allowNull: true },
    password: { type: DataTypes.TEXT },
    avatar: { type: DataTypes.TEXT, allowNull: true },
    lastRevokeTime: { type: DataTypes.BIGINT },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'user',
    indexes: [{ fields: ['username'], using: 'BTREE' }],
    schema: config.groupURL.substring(29).replace('/', ''),
  },
);

export default User;
