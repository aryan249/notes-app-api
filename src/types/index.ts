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
