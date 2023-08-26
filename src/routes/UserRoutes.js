import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import VerifyToken from '../middlewares/VerifyToken.js';

const UserRoutes = Router();

UserRoutes.post('/local/users-in-id', VerifyToken.handle, UserController.inId.bind(UserController));

export default UserRoutes;
