import rateLimit from 'express-rate-limit';
import { Op } from 'sequelize';
import configs from '../configs/index.js';
import RateLimiter from '../middlewares/RateLimiter.js';
import Validator from '../middlewares/Validator.js';
import Role from '../models/Role.js';
import User from '../models/User.js';

class AuthValidation extends Validator {
  loginByPhone(req, res, next) {
    return [
      configs.app.env == 'production'
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) => res.json({ message: 'Too many attempt!' }),
          })
        : (req, res, next) => next(),
      this.body('phone')
        .isNumeric()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              phone: {
                [Op.like]: `%${field}`,
              },
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        })
        .isLength({ min: 9, max: 13 })
        .customSanitizer((item) => {
          if (`${item}`.substring(0, 1) !== '0') return `0${item}`;
          return `${item}`;
        }),
      this.throwIfError,
    ];
  }
  loginByGoogle(req, res, next) {
    return [
      configs.app.env == 'production'
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) => res.json({ message: 'Too many attempt!' }),
          })
        : (req, res, next) => next(),
      this.body('uid').notEmpty(),
      this.body('fcm_token').notEmpty(),
      this.throwIfError,
    ];
  }
  registerByGoogle(req, res, next) {
    return [
      configs.app.env == 'production'
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) => res.json({ message: 'Too many attempt!' }),
          })
        : (req, res, next) => next(),
      this.body('uid').notEmpty(),
      this.body('fcm_token').notEmpty(),
      this.throwIfError,
    ];
  }
  otpValidation(req, res, next) {
    return [
      configs.app.env == 'production'
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) => res.json({ message: 'Too many attempt!' }),
          })
        : (req, res, next) => next(),
      this.body('phone')
        .isNumeric()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              phone: {
                [Op.like]: `%${field}`,
              },
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        })
        .isLength({ min: 9, max: 13 })
        .customSanitizer((item) => {
          if (`${item}`.substring(0, 1) !== '0') return `0${item}`;
          return `${item}`;
        }),
      this.throwIfError,
    ];
  }
  usernameOrEmail(req, res, next) {
    return [
      configs.app.env == 'production'
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) => res.json({ message: 'Too many attempt!' }),
          })
        : (req, res, next) => next(),
      this.body('email').custom(async (field = null) => {
        if (field) {
          const user = await User.findOne({
            where: {
              email: field,
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        }
      }),
      this.body('username').custom(async (field = null) => {
        if (field) {
          const user = await User.findOne({
            where: {
              username: field,
            },
          });
          console.log(`Checking User is exists => `, user?.toJSON());
          if (!!!user?.toJSON()) {
            return Promise.reject(`User doesn't exists`);
          }
        }
      }),
      this.throwIfError,
    ];
  }
  registerByPhone(req, res, next) {
    return [
      configs.app.env == 'production'
        ? rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 60,
            legacyHeaders: false,
            standardHeaders: true,
            message: async (req, res) => res.json({ message: 'Too many attempt!' }),
          })
        : (req, res, next) => next(),
      this.body('phone')
        .isNumeric()
        .notEmpty()
        .custom(async (field) => {
          try {
            const [user, userCreated] = await User.findOrCreate({
              where: {
                phone: {
                  [Op.like]: `%${field}`,
                },
              },
              include: {
                model: Role,
                as: 'roles',
              },
            });
            console.log(`Checking User is exists => `, user?.toJSON());
            const userResource = await user?.authResource();
            if (userResource?.member || userResource?.partner) {
              return Promise.reject('Phone number has been registered!');
            }
          } catch (e) {
            // if (userResource?.member || userResource?.partner) {
            //     return Promise.reject('Phone number has been registered!');
            // }
          }
        })
        .isLength({ min: 9, max: 13 })
        .customSanitizer((item) => {
          if (`${item}`.substring(0, 1) !== '0') return `0${item}`;
          return `${item}`;
        }),
      this.throwIfError,
    ];
  }
  checkUsername() {
    return [
      configs.app.env == 'production' ? RateLimiter.handle() : (req, res, next) => next(),
      this.body('username')
        .isString()
        .isLength({ min: 6, max: 6 })
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              username: field,
            },
          });
          console.log(`Checking Username is exists => `, user?.toJSON());
          if (user) {
            return Promise.reject('username has been registered!');
          }
        }),
      this.throwIfError,
    ];
  }
  checkEmail() {
    return [
      configs.app.env == 'production' ? RateLimiter.handle() : (req, res, next) => next(),
      this.body('email')
        .isEmail()
        .notEmpty()
        .custom(async (field) => {
          const user = await User.findOne({
            where: {
              email: field,
            },
          });
          console.log(`Checking Email is exists => `, user?.toJSON());
          if (user) {
            return Promise.reject('email has been registered!');
          }
        }),
      this.throwIfError,
    ];
  }
}

export default new AuthValidation();
