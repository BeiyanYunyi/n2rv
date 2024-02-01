/* eslint-disable @typescript-eslint/lines-between-class-members */
import { DataTypes, Model } from 'sequelize';
import config from '../../../../config/config.json';
import Topic from '../../../../types/Topic';
import sequelize from '../db';

class TopicList extends Model<Topic> implements Topic {
  title!: string;
  authorID!: string;
  authorName!: string;
  reply!: number;
  lastReplyTime!: number | null;
  topicID!: string;
  isElite!: boolean;
  content!: string | null;
  lastFetchTime!: number | null;
  createTime!: number | null;
  deleteTime!: number | null;
}

TopicList.init(
  {
    title: { type: DataTypes.TEXT },
    authorID: { type: DataTypes.TEXT },
    authorName: { type: DataTypes.TEXT },
    reply: { type: DataTypes.INTEGER({ unsigned: true }) },
    lastReplyTime: { type: DataTypes.BIGINT, allowNull: true },
    topicID: { type: DataTypes.STRING(36), primaryKey: true },
    isElite: { type: DataTypes.BOOLEAN },
    content: { type: DataTypes.TEXT, allowNull: true },
    lastFetchTime: { type: DataTypes.BIGINT, allowNull: true },
    createTime: { type: DataTypes.BIGINT, allowNull: true },
    deleteTime: { type: DataTypes.BIGINT, allowNull: true },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'topicList',
    indexes: [{ fields: ['lastReplyTime'], using: 'BTREE' }],
    schema: config.groupURL.substring(29).replace('/', ''),
  },
);

export default TopicList;
