import { DataTypes, Model } from 'sequelize';
import UserService from '../services/UserService.js';
import Module from './Module.js';
import PersonalAccessToken from './PersonalAccessToken.js';
import Role from './Role.js';
import sequelize from './sequelize.js';
import UserOtp from './UserOtp.js';
import UserRole from './UserRole.js';
import moment from 'moment';
class User extends Model {
  username; //STRING
  name; //STRING
  email; //STRING
  phone; //STRING
  photo; //STRING
  password; //STRING
  remember_token; //STRING
  fcm_token; //STRING

  async authResource() {
    const item = this.toJSON();
    const roles = item.roles?.map((item) => item.name) || [];
    let member = undefined;
    let partner = undefined;
    let modules = undefined;
    for (let i in roles) {
      switch (roles[i]) {
        case 'Member':
          member = await UserService.memberByUserId(item.id);
          break;
        case 'Partner':
          partner = await UserService.partnerByUserId(item.id);
          break;
        case 'Admin':
          modules = await Module.findAll();
          break;
      }
    }
    const admin = undefined;
    try {
      const result = {
        id: parseInt(item.id),
        username: item.username,
        name: item.name,
        email: item.email,
        phone: item.phone,
        fcm_token: item.fcm_token,
        email_verified_at: item.email_verified_at,
        member: member,
        partner: partner,
        admin: admin,
        modules: modules,
        roles: roles,
      };
      console.log('User Resource =>', result);
      return result;
    } catch (e) {
      console.error('Failed to generate auth resource =>', e);
      throw e;
    }
  }

  userResource() {
    const item = this.toJSON();
    return {
      id: parseInt(item.id),
      username: item.username,
      name: item.name,
      email: item.email,
      phone: item.phone,
      photo: item.photo,
      email_verified_at: item.email_verified_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remember_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fcm_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    paranoid: true,
  }
);

export default User;
