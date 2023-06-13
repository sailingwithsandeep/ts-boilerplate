import { Router } from 'express';
import authRoute from './auth/index.js';
import profileRoute from './profile/index.js';
import roleRoute from './role/index.js';
const router = Router();
router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/roles', roleRoute);
export default router;
