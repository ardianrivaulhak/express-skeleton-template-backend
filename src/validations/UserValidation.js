import { Op } from "sequelize";
import Validator from "../middlewares/Validator";

class UserValidation extends Validator {
    inId() {
        return [
            configs.app.env == 'production' ? RateLimiter.handle() : (req, res, next) => next(),
            this.body('users')
                .isArray()
                .notEmpty(),
            this.throwIfError
        ];
    }
}

export default new UserValidation;