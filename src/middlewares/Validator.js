import { validationResult, body, check } from "express-validator";
class Validator {
    body = body;
    check = check;
    throwIfError(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let _errors = {};
            console.log("Validation Error =>", errors.array());
            for (let key in errors.array()) {
                typeof _errors[errors.array()[key].param] == 'array' ? _errors[errors.array()[key].param].push(errors.array()[key].msg) : _errors[errors.array()[key].param] = [errors.array()[key].msg];
            }
            return res.status(422).json({
                message: 'The given data was invalid.',
                errors: _errors
            });
        }
        return next();
    }
}

export default Validator;