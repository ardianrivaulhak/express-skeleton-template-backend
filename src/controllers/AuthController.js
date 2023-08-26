import User from '../models/User.js';
import UserOtp from '../models/UserOtp.js';
import moment from 'moment';
import configs from '../configs/index.js';
import jwt from 'jsonwebtoken';
import PersonalAccessToken from '../models/PersonalAccessToken.js';
import Role from '../models/Role.js';
import UserService from '../services/UserService.js';
import bcrypt from 'bcrypt';
import { randNumber } from '../helpers.js';
// import firebaseAdminApp from '../services/FirebaseAdmin.js';
import { getAuth } from 'firebase-admin/auth';
import { Op } from 'sequelize';
import Whapi from '../services/Whapi.js';
import Setting from '../models/Setting.js';
import lang from '../lang/lang.js';

class AuthController {
  #sendOtp(phone) {
    return new Promise(async (res, rej) => {
      const user = await User.findOne({
        where: {
          phone: {
            [Op.or]: [phone, `${phone}`.substring(1)],
          },
        },
      });
      try {
        let otp = randNumber(4);
        if (`${user.get('phone')}`.indexOf('81313131313') > -1 || `${user.get('phone')}`.indexOf('81212121212') > -1) otp = '1111'; // Testing Number
        await UserOtp.create({ user_id: user.get('id'), otp, expired_at: moment().add(5, 'minutes').format() });
        const defaultMessageTemplate = `{otp} adalah kode OTP Denger-ind Anda. Jangan beritahu siapapun!`;
        const [messageTemplate, messageTemplateCreated] = await Setting.findOrCreate({
          where: {
            key: 'otpMessage',
          },
          defaults: {
            value: { template: defaultMessageTemplate },
          },
        });
        let parseMessageTemplate = `${messageTemplate.get('value').template}`.replace('{otp}', otp);
        console.log('OTP parsed template =>', parseMessageTemplate);
        await Whapi.sendMessage(phone, parseMessageTemplate);
        res(otp);
      } catch (e) {
        rej(e);
      }
    });
  }

  async registerByPhone(req, res) {
    try {
      const form = req.body;
      console.log('Registering new user => ', req.body);
      const { phone } = req.body;
      const [user, userHasCreated] = await User.findOrCreate({ where: { phone } });
      if (form.type) {
        await user.addRole(await Role.findOne({ where: { name: 'Partner' } }));
      } else {
        await user.addRole(await Role.findOne({ where: { name: 'Member' } }));
      }
      const otp = await this.#sendOtp(phone);
      return res.json({
        message: 'OTP Code has been sent!',
        ...(configs.app.env !== 'production'
          ? {
              otp: otp,
            }
          : {}),
      });
    } catch (e) {
      console.error('Failed to registering new User =>', e);
      return res.status(500).json({ message: 'Failed to registering new User' });
    }
  }

  async loginByPhone(req, res) {
    try {
      const { phone } = req.body;
      const user = await User.findOne({
        where: {
          phone: {
            [Op.or]: [phone, `${phone}`.substring(1)],
          },
        },
      });
      console.log('Get user by phone => ', user.id);
      const otp = await this.#sendOtp(phone);
      return res.json({
        message: 'OTP Code has been sent!',
        ...(configs.app.env !== 'production'
          ? {
              otp: otp,
            }
          : {}),
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: 'System failure',
        e,
      });
    }
  }

  async otpValidation(req, res) {
    console.log('Validating OTP =>', req.body);
    try {
      const { phone, otp, fcm_token } = req.body;
      const user = await User.findOne({
        where: {
          phone: {
            [Op.or]: [phone, `${phone}`.substring(1)],
          },
        },
        include: {
          model: Role,
          as: 'roles',
        },
      });

      if (!user.toJSON()) {
        return res.status(401).json({
          message: "User doesn't exists!",
        });
      }

      const _otp = await UserOtp.scope({ method: ['validOtp', user.get('id'), otp] }).findOne();

      if (!_otp) {
        return res.status(401).json({
          message: 'OTP Code is not valid!',
        });
      }

      const authResource = await user.authResource();

      jwt.sign({ user: authResource }, configs.auth.key, async (err, token) => {
        await PersonalAccessToken.create({
          user_id: user.id,
          token,
        });
        _otp.destroy();
        user.update({ fcm_token });
        UserService.updateFcm(user.id, fcm_token);
        return res.json({
          message: 'success',
          data: authResource,
          token,
        });
      });
    } catch (e) {
      console.error('Validate Otp failure =>', e);
      return res.status(500).json({ message: 'System failure!' });
    }
  }

  async updateFcm(req, res) {
    console.log('Updating FCM =>', req.body);
    try {
      const { fcm_token } = req.body;
      const user = await User.findOne({
        where: {
          id: req.auth.user.id,
        },
      });

      if (!user.toJSON()) {
        return res.status(401).json({
          message: "User doesn't exists!",
        });
      }

      user.update({ fcm_token });
      UserService.updateFcm(user.id, fcm_token);

      return res.json({
        message: 'success',
      });
    } catch (e) {
      console.error('Updating FCM failure =>', e);
      return res.status(500).json({ message: 'System failure!' });
    }
  }

  async emailOrUsername(req, res) {
    try {
      const { username = undefined, email = undefined, password, fcm_token } = req.body;
      const _user = await User.findOne({
        where: {
          [username ? 'username' : 'email']: username || email,
        },
        include: {
          model: Role,
          as: 'roles',
        },
      });

      const user = await _user.authResource();

      console.log('Comparing password =>', {
        password,
        _password: user.password,
      });

      const comparePassword = await bcrypt.compare(password, _user.get('password'));
      if (!comparePassword) {
        return res.status(401).json({
          message: 'Unauthorized!',
          errors: {
            [username ? 'username' : 'email']: `Credentials doesnt match with our record!`,
          },
        });
      }

      return jwt.sign({ user }, configs.auth.key, async (err, token) => {
        _user.update({ fcm_token });
        UserService.updateFcm(_user.get('id'), fcm_token);
        return res.json({
          message: 'success',
          data: user,
          token,
        });
      });
    } catch (e) {
      res.status(500).json({ message: 'System Failure' });
    }
  }

  async me(req, res) {
    const user = await User.findOne({
      where: { id: req.auth.user.id },
      include: {
        model: Role,
        as: 'roles',
      },
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    return res.json({
      message: 'success',
      data: await user.authResource(),
      // _data: req.auth.user
    });
  }

  async checkUsername(req, res) {
    return res.json({
      message: 'Username is available',
    });
  }

  async checkEmail(req, res) {
    return res.json({
      message: 'Email is available',
    });
  }

  async loginByGoogle(req, res) {
    try {
      const { uid } = req.body;
      // const googleAuth = getAuth(firebaseAdminApp);
      const { email } = await googleAuth.getUser(uid);
      console.log('User from google =>', email);
      const user = await (await User.findOne({ where: { email }, include: { model: Role, as: 'roles' } })).authResource();
      jwt.sign({ user: { id: user.id } }, configs.auth.key, (err, token) => {
        if (err) {
          throw {};
        }
        return res.json({
          message: 'success',
          data: user,
          token,
        });
      });
    } catch (e) {
      console.log(e);
      return res.status(422).json({
        message: 'The given data was invalid.',
        errors: {
          email: ['The provided credentials are incorrect.'],
        },
      });
    }
  }

  async registerByGoogle(req, res) {
    try {
      const { uid, type = null } = req.body;
      // const googleAuth = getAuth(firebaseAdminApp);
      const { email = null, photoUrl = null, phoneNumber = null } = await googleAuth.getUser(uid);
      console.log('User from google =>', email);

      const [user, userCreated] = await User.findOrCreate({
        where: { email },
        include: { model: Role, as: 'roles' },
      });

      console.log(`Checking User is exists => `, user.toJSON());

      const authResource = await user?.authResource();
      console.log('Getting user resource =>', authResource);
      if (authResource?.member || authResource?.partner) {
        return res.status(422).json({
          message: 'The given data was invalid.',
          errors: {
            email: 'Email has been registered!',
          },
        });
      }

      if (type) {
        await user.addRole(await Role.findOne({ where: { name: 'Partner' } }));
      } else {
        await user.addRole(await Role.findOne({ where: { name: 'Member' } }));
      }

      user.update({
        email: email,
        photo: photoUrl,
        phone: phoneNumber,
      });

      jwt.sign({ user: { id: user.id } }, configs.auth.key, (err, token) => {
        if (err) {
          throw {};
        }
        return res.json({
          message: 'success',
          data: user,
          token,
        });
      });
    } catch (e) {
      console.error('Failed to authenticate =>', e);
      return res.status(422).json({
        message: 'The given data was invalid.',
        errors: {
          email: ['The provided credentials are incorrect.'],
        },
      });
    }
  }

  async update(req, res) {
    const form = req.body;
    const user = await User.findByPk(req.auth.user.id);
    const emailExists = await User.count({
      where: {
        email: form?.email || '',
        [Op.not]: {
          email: user.get('email'),
        },
      },
    });
    const phoneExists = await User.count({
      where: {
        phone: form?.phone || '',
        [Op.not]: {
          phone: user.get('phone'),
        },
      },
    });
    const usernameExists = await User.count({
      where: {
        username: form?.username || '',
        [Op.not]: {
          username: user.get('username'),
        },
      },
    });

    if (usernameExists || phoneExists || emailExists) {
      const validation = (await lang.validation).default;
      return res.status(422).json({
        message: 'The given data was invalid.',
        errors: {
          ...(usernameExists ? { username: validation.usernameExists } : {}),
          ...(phoneExists ? { phone: validation.phoneExists } : {}),
          ...(emailExists ? { email: validation.emailExists } : {}),
        },
      });
    }

    user.update(form);

    console.log('Auth data updated =>', user.toJSON());
    return res.json({
      message: 'success',
      data: user,
    });
  }
}

export default new AuthController();
