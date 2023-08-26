import { Router } from "express";
import AuthController from "../controllers/AuthController";
import AuthValidation from "../validations/AuthValidation";

const IndexRoutes = Router();

IndexRoutes.use('/login', ...AuthValidation.usernameOrEmail(), AuthController.emailOrUsername);
IndexRoutes.use('/check-username', ...AuthValidation.checkUsername(), AuthController.checkUsername);
IndexRoutes.use('/check-email', ...AuthValidation.checkEmail(), AuthController.checkEmail);

export default  IndexRoutes;