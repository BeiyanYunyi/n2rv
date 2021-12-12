import { DataTypes, Model } from 'sequelize/dist';
import config from '../../../../config/config.json';
import { ImageInDB } from '../../../../types/Image';
import sequelize from '../db';

class Image extends Model<ImageInDB> {}

Image.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true },
    imgID: { type: DataTypes.STRING },
    imgContent: { type: DataTypes.BLOB },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'image',
    indexes: [{ fields: ['imgID'], using: 'BTREE' }],
    schema: config.groupURL.substring(29).replace('/', ''),
  },
);

export default Image;
