import { DataTypes, Model, Op } from 'sequelize';
import sequelize from './sequelize.js';
class Setting extends Model {
  key; //STRING
}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      unique: true,
    },
    value: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
  }
);

export default Setting;
