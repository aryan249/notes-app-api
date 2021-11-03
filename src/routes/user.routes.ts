import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateChangePassword } from '../middleware/validate.middleware';
import { getProfile, changePassword, deleteAccount } from '../controllers/user.controller';

const router = Router();

router.use(authenticate as any);

router.get('/me', getProfile as any);
router.put('/me/password', validateChangePassword, changePassword as any);
router.delete('/me', deleteAccount as any);

export default router;
