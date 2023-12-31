import { Router } from 'express';
import controllers from './lib/controller.js';
const router = Router();
router.post('/create', controllers.createAdmin);
router.post('/login', controllers.login);
router.post('/password/forgot', controllers.forgotPassword);
router.get('/email/verify/:token', controllers.verifyEmail);
router.post('/password/reset/:token', controllers.resetPassword);
router.get('/verify/token/:token', controllers.verifyToken);
export default router;
