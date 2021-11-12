import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../types';

export const getTags = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const result = await pool.query(
    `SELECT DISTINCT unnest(tags) AS tag
     FROM notes
     WHERE user_id = $1
     ORDER BY tag`,
    [userId]
  );

  res.json({ tags: result.rows.map((row) => row.tag) });
};
