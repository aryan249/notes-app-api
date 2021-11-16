import pool from './pool';

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
    `);

    await client.query(`
      ALTER TABLE notes ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notes_archived ON notes(archived);
    `);

    await client.query(`
      ALTER TABLE notes ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;
    `);

    await client.query('COMMIT');
    console.log('Migrations completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
