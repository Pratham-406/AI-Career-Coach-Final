import { Router } from 'express';
import { authController, registerSchema, loginSchema, updateProfileSchema } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/register', validateRequest(registerSchema), authController.register);
router.get('/me', authController.getProfile);
router.patch('/profile', validateRequest(updateProfileSchema), authController.updateProfile);

export default router;
