import MobileVersion from './MobileVersion.js';
import Module from './Module.js';
import PersonalAccessToken from './PersonalAccessToken.js';
import Role from './Role.js';
import Setting from './Setting.js';
import User from './User.js';
import UserOtp from './UserOtp.js';
import UserRole from './UserRole.js';

MobileVersion.sync({ alter: true });
User.sync({ alter: true });
Module.sync({ alter: true });
PersonalAccessToken.sync({ alter: true });
Role.sync({ alter: true });
Setting.sync({ alter: true });
UserRole.sync({ alter: true });
UserOtp.sync({ alter: true });
User.belongsToMany(Role, {
  through: UserRole,
  as: 'roles',
  foreignKey: 'user_id',
  otherKey: 'role_id',
});
User.hasMany(UserOtp, {
  as: 'otps',
  foreignKey: 'user_id',
});
User.hasMany(PersonalAccessToken, {
  as: 'tokens',
  foreignKey: 'user_id',
});

export * from './MobileVersion';
export * from './Module';
export * from './PersonalAccessToken';
export * from './Role';
export * from './Setting';
export * from './User';
export * from './UserOtp';
export * from './UserRole';
