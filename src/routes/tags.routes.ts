import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getTags } from '../controllers/tags.controller';

const router = Router();

router.use(authenticate as any);

router.get('/', getTags as any);

export default router;
