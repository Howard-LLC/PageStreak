export type BookStatus = 'reading' | 'finished' | 'toread' | 'paused';
export type AddedBy = 'manual' | 'ai' | 'friend';

export interface Book {
  id: number;
  user_id?: string;
  title: string;
  author: string;
  pages: number;
  palette: [string, string];
  cover_style?: string;
  cover_url?: string | null;
  genre?: string;
  status: BookStatus;
  current_page?: number;
  started?: string | null;
  finished?: string | null;
  rating?: number | null;
  added_by?: AddedBy;
  added_at?: string;
  reason?: string | null;
  friend?: string | null;
  why?: string | null;
}

export interface ReadingLog {
  user_id: string;
  log_date: string;
  pages: number;
  book_id?: number | null;
}

export interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  goal: number;
  stretch_goal: number;
  current_book_id: number | null;
  created_at: string;
  birthday: string | null;
  gender: string | null;
  onboarded_at: string | null;
}

export interface CosmeticPrefs {
  user_id: string;
  theme_key: 'cream' | 'warm' | 'cool' | 'dark';
  accent: [string, string];
  streak_icon: 'flame' | 'bookmark' | 'spark' | 'sun';
}
