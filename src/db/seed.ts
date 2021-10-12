import bcrypt from 'bcryptjs';
import pool from './pool';

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const password = await bcrypt.hash('password123', 10);
    const userResult = await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      ['demo@example.com', password]
    );
    const userId = userResult.rows[0].id;

    const notes = [
      { title: 'Welcome to Notes', content: 'This is your first note!', tags: ['welcome', 'getting-started'] },
      { title: 'Meeting Notes', content: 'Discuss project timeline and deliverables', tags: ['work', 'meetings'] },
      { title: 'Shopping List', content: 'Milk, eggs, bread, butter', tags: ['personal', 'shopping'] },
      { title: 'Book Recommendations', content: 'Clean Code, The Pragmatic Programmer, DDIA', tags: ['reading', 'personal'] },
      { title: 'API Design Ideas', content: 'REST best practices, pagination, versioning', tags: ['work', 'tech'] },
    ];

    for (const note of notes) {
      await client.query(
        'INSERT INTO notes (title, content, tags, user_id) VALUES ($1, $2, $3, $4)',
        [note.title, note.content, note.tags, userId]
      );
    }

    await client.query('COMMIT');
    console.log('Seed data inserted successfully');
    console.log('Demo user: demo@example.com / password123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
