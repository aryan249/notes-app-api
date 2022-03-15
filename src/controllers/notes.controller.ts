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

export const getNotes = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { search, tag, archived } = req.query;
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE user_id = $1';
  const params: (string | number | boolean)[] = [userId];

  if (archived === 'true' || archived === 'false') {
    params.push(archived === 'true');
    whereClause += ` AND archived = $${params.length}`;
  }

  if (typeof search === 'string' && search.trim()) {
    params.push(`%${search.trim()}%`);
    whereClause += ` AND (title ILIKE $${params.length} OR content ILIKE $${params.length})`;
  }

  if (typeof tag === 'string' && tag.trim()) {
    params.push(tag.trim());
    whereClause += ` AND $${params.length} = ANY(tags)`;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM notes ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);
  const result = await pool.query(
    `SELECT * FROM notes ${whereClause} ORDER BY pinned DESC, updated_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  res.json({
    notes: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getNoteById = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const noteId = parseInt(req.params.id as string, 10);

  if (isNaN(noteId)) {
    res.status(400).json({ error: 'Invalid note ID' });
    return;
  }

  const result = await pool.query(
    'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
    [noteId, userId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }

  res.json({ note: result.rows[0] });
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const noteId = parseInt(req.params.id as string, 10);

  if (isNaN(noteId)) {
    res.status(400).json({ error: 'Invalid note ID' });
    return;
  }

  const { title, content, tags } = req.body as UpdateNoteBody;

  const existing = await pool.query(
    'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
    [noteId, userId]
  );

  if (existing.rows.length === 0) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }

  const current = existing.rows[0];
  const result = await pool.query(
    `UPDATE notes SET title = $1, content = $2, tags = $3, updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [
      title ?? current.title,
      content ?? current.content,
      tags ?? current.tags,
      noteId,
      userId,
    ]
  );

  res.json({ note: result.rows[0] });
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const noteId = parseInt(req.params.id as string, 10);

  if (isNaN(noteId)) {
    res.status(400).json({ error: 'Invalid note ID' });
    return;
  }

  const result = await pool.query(
    'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
    [noteId, userId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }

  res.status(204).send();
};

export const bulkDelete = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids must be a non-empty array of numbers' });
    return;
  }

  if (!ids.every((id: unknown) => typeof id === 'number' && Number.isInteger(id))) {
    res.status(400).json({ error: 'All ids must be integers' });
    return;
  }

  const result = await pool.query(
    'DELETE FROM notes WHERE id = ANY($1) AND user_id = $2 RETURNING id',
    [ids, userId]
  );

  res.json({ deleted: result.rows.map((r) => r.id), count: result.rowCount });
};
