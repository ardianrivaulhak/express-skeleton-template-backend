import { DataTypes, Model, Op } from 'sequelize';
import Role from './Role.js';
import sequelize from './sequelize.js';
import User from './User.js';
class UserRole extends Model {
  // user_id;//INTEGER
  // role_id;//INTEGER
}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'user_has_roles',
    timestamps: false,
  }
);

export default UserRole;
