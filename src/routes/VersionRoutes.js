import { Router } from 'express';
import VersionController from '../controllers/VersionController.js';
import RateLimiter from '../middlewares/RateLimiter.js';

const VersionRoutes = Router();

VersionRoutes.get('/:name/:version', RateLimiter.handle(10), (...args) => VersionController.check(...args));

export default VersionRoutes;
