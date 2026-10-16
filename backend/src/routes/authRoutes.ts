import { Router } from 'express';
import { authController, registerSchema, loginSchema, updateProfileSchema } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getProfile);
router.patch('/profile', requireAuth, validateRequest(updateProfileSchema), authController.updateProfile);

export default router;
