import { Router } from 'express';
import controllers from './lib/controller.js';
import middlewares from '../../../middlewares/index.js';
const router = Router();
router.use(middlewares.isAdminAuthenticated);
router.get('/get', controllers.getProfile);
router.post('/change-password', controllers.changePassword);
router.get('/logout', controllers.logout);
export default router;
