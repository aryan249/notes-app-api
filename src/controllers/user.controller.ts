import { Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/pool';
import { config } from '../config';
import { AuthRequest } from '../types';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const result = await pool.query(
    'SELECT id, email, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user: result.rows[0] });
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, result.rows[0].password);
  if (!valid) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, config.bcryptRounds);
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

  res.json({ message: 'Password updated successfully' });
};
