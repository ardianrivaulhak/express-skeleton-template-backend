import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import AuthValidation from '../validations/AuthValidation.js';
import AuthRoutes from './AuthRoutes.js';
import UserRoutes from './UserRoutes.js';
import VersionRoutes from './VersionRoutes.js';

const routes = Router();

routes.use('/auth', AuthRoutes);
routes.use('/login', ...AuthValidation.usernameOrEmail(), AuthController.emailOrUsername);
routes.use('/check-version', VersionRoutes);
routes.use('/check-username', ...AuthValidation.checkUsername(), AuthController.checkUsername);
routes.use('/check-email', ...AuthValidation.checkEmail(), AuthController.checkEmail);
routes.use('', UserRoutes);

export default routes;
