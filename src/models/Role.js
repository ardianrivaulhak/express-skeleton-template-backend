import { DataTypes, Model, Op } from 'sequelize';
import User from './User.js';
import UserRole from './UserRole.js';
import sequelize from './sequelize.js';
class Role extends Model {
  // name;//STRING
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
  }
);

// User.belongsToMany(Role, {
//     through: UserRole,
//     foreignKey: 'user_id',
//     otherKey: 'role_id',
// });

export default Role;
