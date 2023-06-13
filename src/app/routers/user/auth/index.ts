import { Router } from 'express';
import controllers from './lib/controller.js';
const router = Router();

router.post('/register', controllers.register);
router.post('/login', controllers.login);

export default router;
