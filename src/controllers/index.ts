export { register, login } from './auth.controller';
export { getProfile, changePassword, deleteAccount } from './user.controller';
export {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  bulkDelete,
  duplicateNote,
  archiveNote,
  unarchiveNote,
  pinNote,
  unpinNote,
  exportNotes,
} from './notes.controller';
export { getTags } from './tags.controller';
export { getStats } from './stats.controller';
