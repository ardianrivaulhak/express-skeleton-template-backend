import { DataTypes, Model, Op } from 'sequelize';
import moment from 'moment';
import sequelize from './sequelize.js';
class UserOtp extends Model {
  user_id; //INTEGER
  otp; //STRING
}

UserOtp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    otp: {
      type: DataTypes.STRING,
    },
    expired_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'user_otps',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    scopes: {
      validOtp(user_id, otp) {
        return {
          where: {
            user_id,
            otp,
            expired_at: {
              [Op.gt]: moment().format(),
            },
          },
        };
      },
    },
  }
);

export default UserOtp;
