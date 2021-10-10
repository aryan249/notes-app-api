import pool from '../pool';

const migrate = async () => {
  await pool.query(`
    ALTER TABLE notes ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(pinned);
  `);
  console.log('Migration 003: added pinned column');
};

export default migrate;
