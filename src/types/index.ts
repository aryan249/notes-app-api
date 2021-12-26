import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
  created_at: Date;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  archived: boolean;
  pinned: boolean;
  created_at: Date;
  updated_at: Date;
  user_id: number;
}

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export interface CreateNoteBody {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteBody {
  title?: string;
  content?: string;
  tags?: string[];
}
