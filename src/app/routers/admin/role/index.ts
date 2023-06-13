import { Router } from 'express';
import controllers from './lib/controllers.js';
import middlewares from '../../../middlewares/index.js';

const router = Router();
router.use(middlewares.isAdminAuthenticated);

router.post('/create/permission', controllers.createPermission);
router.post('/create', controllers.createRole);
router.get('/list', controllers.listRoles);
router.put('/edit/:id', controllers.editRole);
router.patch('/delete/:id', controllers.deleteRole);
router.get('/list/permission', controllers.listPermission);

export default router;
