/* eslint-disable @typescript-eslint/lines-between-class-members */
import { DataTypes, Model } from 'sequelize/dist';
import config from '../../../../config/config.json';
import ReplyType from '../../../../types/Reply';
import sequelize from '../db';

class Reply extends Model<ReplyType> implements ReplyType {
  replyID!: string;
  topicID!: string;
  authorID!: string;
  authorName!: string;
  isPoster!: boolean;
  replyTime!: number;
  quoting!: boolean;
  quotingImage!: string | null;
  quotingText!: string | null;
  quotingAuthorID!: string | null;
  quotingAuthorName!: string | null;
  image!: string | null;
  content!: string;
  votes!: number;
}

Reply.init(
  {
    replyID: { type: DataTypes.TEXT, primaryKey: true },
    topicID: { type: DataTypes.TEXT },
    authorID: { type: DataTypes.TEXT },
    authorName: { type: DataTypes.TEXT },
    isPoster: { type: DataTypes.BOOLEAN },
    replyTime: { type: DataTypes.BIGINT },
    quoting: { type: DataTypes.BOOLEAN },
    quotingImage: { type: DataTypes.TEXT, allowNull: true },
    quotingText: { type: DataTypes.TEXT, allowNull: true },
    quotingAuthorID: { type: DataTypes.TEXT, allowNull: true },
    quotingAuthorName: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    votes: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'reply',
    indexes: [{ fields: ['replyTime'], using: 'BTREE' }],
    schema: config.groupURL.substring(29).replace('/', ''),
  },
);

export default Reply;
