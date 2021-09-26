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
