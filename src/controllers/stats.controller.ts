import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../types';

export const getStats = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE archived = TRUE)::int AS archived,
       COUNT(*) FILTER (WHERE pinned = TRUE)::int AS pinned,
       COUNT(*) FILTER (WHERE archived = FALSE)::int AS active
     FROM notes
     WHERE user_id = $1`,
    [userId]
  );

  res.json({ stats: result.rows[0] });
};
