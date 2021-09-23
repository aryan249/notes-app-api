import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validate.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(authLimiter);

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
