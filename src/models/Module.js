import { DataTypes, Model, Op } from 'sequelize';
import sequelize from './sequelize.js';
class Module extends Model {
  label; //STRING
  icon; //TEXT
  route; //STRING
  order; //STRING
  parent_id; //INTEGER
  protected; //BOOLEAN
}

Module.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
    },
    icon: {
      type: DataTypes.TEXT,
    },
    route: {
      type: DataTypes.STRING,
    },
    order: {
      type: DataTypes.STRING,
    },
    parent_id: {
      type: DataTypes.INTEGER,
    },
    protected: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'modules',
  }
);

export default Module;
