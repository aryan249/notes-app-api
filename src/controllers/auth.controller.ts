import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { config } from '../config';
import { RegisterBody, LoginBody } from '../types';

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const { email, password } = req.body;

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, hashedPassword]
  );

  res.status(201).json({ user: result.rows[0] });
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );

  res.json({ token, user: { id: user.id, email: user.email } });
};
