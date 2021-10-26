import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateCreateNote, validateUpdateNote } from '../middleware/validate.middleware';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/notes.controller';

const router = Router();

router.use(authenticate as any);

router.post('/', validateCreateNote, createNote as any);
router.get('/', getNotes as any);
router.get('/:id', getNoteById as any);
router.put('/:id', validateUpdateNote, updateNote as any);
router.delete('/:id', deleteNote as any);

export default router;
