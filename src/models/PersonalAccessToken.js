import { DataTypes, Model, Op } from 'sequelize';
import sequelize from './sequelize.js';
class PersonalAccessToken extends Model {
  user_id; //INTEGER
  token; //TEXT
  hardware_id; //TEXT
  fcm_token; //STRING
}

PersonalAccessToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    hardware_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.TEXT,
    },
    fcm_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
  }
);

export default PersonalAccessToken;
