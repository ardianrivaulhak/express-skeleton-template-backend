import { DataTypes, Model, Op } from 'sequelize';
import sequelize from './sequelize.js';
class MobileVersion extends Model {
  name; //STRING
  version; //STRING
  description; //STRING
  active; //BOOLEAN
  status; //STRING
}

MobileVersion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    version: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'mobile_versions',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default MobileVersion;
