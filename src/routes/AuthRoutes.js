import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import VerifyToken from '../middlewares/VerifyToken.js';
import AuthValidation from '../validations/AuthValidation.js';

const AuthRoutes = Router();

AuthRoutes.post('/phone', ...AuthValidation.loginByPhone(), AuthController.loginByPhone.bind(AuthController));
AuthRoutes.post('/google', ...AuthValidation.loginByGoogle(), AuthController.loginByGoogle.bind(AuthController));
AuthRoutes.post('/register/phone', ...AuthValidation.registerByPhone(), AuthController.registerByPhone.bind(AuthController));
AuthRoutes.post('/register/google', ...AuthValidation.registerByGoogle(), AuthController.registerByGoogle.bind(AuthController));
AuthRoutes.post('/otp-validation', ...AuthValidation.otpValidation(), AuthController.otpValidation.bind(AuthController));
AuthRoutes.get('/me', VerifyToken.handle, AuthController.me.bind(AuthController));
AuthRoutes.post('/update', VerifyToken.handle, AuthController.update.bind(AuthController));
AuthRoutes.post('/update-fcm', VerifyToken.handle, AuthController.updateFcm.bind(AuthController));

export default AuthRoutes;
