import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateCreateNote, validateUpdateNote } from '../middleware/validate.middleware';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  pinNote,
  unpinNote,
  bulkDelete,
  duplicateNote,
  exportNotes,
} from '../controllers/notes.controller';

const router = Router();

router.use(authenticate as any);

router.post('/', validateCreateNote, createNote as any);
router.post('/bulk-delete', bulkDelete as any);
router.get('/export', exportNotes as any);
router.get('/', getNotes as any);
router.get('/:id', getNoteById as any);
router.put('/:id', validateUpdateNote, updateNote as any);
router.delete('/:id', deleteNote as any);
router.patch('/:id/archive', archiveNote as any);
router.patch('/:id/unarchive', unarchiveNote as any);
router.patch('/:id/pin', pinNote as any);
router.patch('/:id/unpin', unpinNote as any);
router.post('/:id/duplicate', duplicateNote as any);

export default router;
