import pool from '../pool';

const migrate = async () => {
  await pool.query(`
    ALTER TABLE notes ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_notes_archived ON notes(archived);
  `);
  console.log('Migration 002: added archived column');
};

export default migrate;
