import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest, CreateNoteBody, UpdateNoteBody } from '../types';

export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content, tags } = req.body as CreateNoteBody;
  const userId = req.user!.id;

  const result = await pool.query(
    `INSERT INTO notes (title, content, tags, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content || '', tags || [], userId]
  );

  res.status(201).json({ note: result.rows[0] });
};
