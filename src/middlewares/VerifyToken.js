import jwt from 'jsonwebtoken';
import configs from '../configs/index.js';
class VerifyToken {
  constructor() {}

  handle(req, res, next) {
    try {
      const bearer = req.get('Authorization') || '';
      const token = bearer.split(' ')[1];
      jwt.verify(token, configs.auth.key, (err, authData) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthenticated!' });
        }
        req.auth = authData;
        return next();
      });
    } catch (e) {
      console.error('Failed to verify token =>', e);
      return res.status(500).json({
        message: 'Failed to verify token!',
      });
    }
  }
}

export default new VerifyToken();
