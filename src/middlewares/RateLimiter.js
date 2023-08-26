import rateLimit from 'express-rate-limit';
import configs from '../configs/index.js';

class RateLimiter {
  constructor() {}
  handle(maxInMinute = 60) {
    return configs.app.env == 'production'
      ? rateLimit({
          windowMs: 1 * 60 * 1000,
          max: maxInMinute,
          legacyHeaders: false,
          standardHeaders: true,
          message: async (req, res) => res.json({ message: 'Too many attempt!' }),
        })
      : (req, res, next) => next();
  }
}

export default new RateLimiter();
