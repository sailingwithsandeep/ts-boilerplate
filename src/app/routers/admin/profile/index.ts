import { Router } from 'express';
import controllers from './lib/controllers.js';
import middlewares from '../../../middlewares/index.js';

const router = Router();
router.use(middlewares.isAdminAuthenticated);

router.get('/get', controllers.getProfile);
router.put('/edit', controllers.editProfile);
router.patch('/update/password', controllers.updatePassword);

router.get('/logout', controllers.logout);

export default router;
