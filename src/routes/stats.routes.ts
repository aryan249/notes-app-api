import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getStats } from '../controllers/stats.controller';

const router = Router();

router.use(authenticate as any);

router.get('/', getStats as any);

export default router;
