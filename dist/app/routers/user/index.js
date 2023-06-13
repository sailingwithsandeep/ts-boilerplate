import { Router } from 'express';
import authRoute from './auth/index.js';
import profileRoute from './profile/index.js';
const router = Router();
router.use('/auth', authRoute);
router.use('/profile', profileRoute);
export default router;
