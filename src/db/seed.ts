import bcrypt from 'bcryptjs';
import pool from './pool';

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const password = await bcrypt.hash('password123', 10);
    await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      ['demo@example.com', password]
    );

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
