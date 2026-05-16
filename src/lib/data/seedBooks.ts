import type { Book } from './types';

// Seed data inserted on first sign-in if the user has no books.
// Status types match the schema. `id` is omitted because Postgres assigns it.

export type SeedBook = Omit<Book, 'id' | 'user_id'>;

export const SEED_BOOKS: SeedBook[] = [
  { title: 'Deep Work', author: 'Cal Newport', pages: 296, palette: ['#1c2541', '#5bc0be'], cover_style: 'grid', genre: 'Productivity', status: 'reading', current_page: 142, started: '2026-04-12', rating: 4 },
  { title: 'Project Hail Mary', author: 'Andy Weir', pages: 476, palette: ['#1a2a3a', '#e8c454'], cover_style: 'circle', genre: 'Sci-fi', status: 'finished', rating: 5, finished: '2026-03-28' },
  { title: 'The Body Keeps the Score', author: 'Bessel van der Kolk', pages: 464, palette: ['#3a1e2e', '#dba39e'], cover_style: 'arc', genre: 'Psychology', status: 'finished', rating: 4, finished: '2026-02-14' },
  { title: 'Range', author: 'David Epstein', pages: 352, palette: ['#1e3a2b', '#b8c69b'], cover_style: 'stripes', genre: 'Non-fiction', status: 'finished', rating: 4, finished: '2026-01-22' },
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', pages: 320, palette: ['#2b1e3a', '#dfc8e8'], cover_style: 'circle', genre: 'Literary', status: 'finished', rating: 5, finished: '2025-12-30' },
  { title: 'Educated', author: 'Tara Westover', pages: 334, palette: ['#3a341e', '#e8d09b'], cover_style: 'arc', genre: 'Memoir', status: 'finished', rating: 4, finished: '2025-11-18' },
  { title: 'Tomorrow ×3', author: 'Gabrielle Zevin', pages: 416, palette: ['#5e2129', '#e9b8a3'], cover_style: 'circle', genre: 'Literary', status: 'finished', rating: 5, finished: '2025-10-14' },
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', pages: 352, palette: ['#3a2415', '#e0a874'], cover_style: 'grid', genre: 'Tech', status: 'finished', rating: 5, finished: '2025-09-06' },
  { title: 'A Brief History of Intelligence', author: 'Max Bennett', pages: 432, palette: ['#1f1c3a', '#7d83c4'], cover_style: 'stripes', genre: 'Science', status: 'toread', added_by: 'manual', added_at: '2026-04-29' },
  { title: 'Slow Productivity', author: 'Cal Newport', pages: 256, palette: ['#1c2541', '#a8c0d8'], cover_style: 'arc', genre: 'Productivity', status: 'toread', added_by: 'ai', added_at: '2026-04-22', reason: 'Matches "deep work + async" thesis' },
  { title: 'The Anthropocene Reviewed', author: 'John Green', pages: 304, palette: ['#1a3a3a', '#9bc6c4'], cover_style: 'circle', genre: 'Essays', status: 'toread', added_by: 'friend', added_at: '2026-04-10', friend: 'Jordan' },
  { title: 'How to Take Smart Notes', author: 'Sönke Ahrens', pages: 192, palette: ['#3a2e1f', '#c9a878'], cover_style: 'grid', genre: 'Productivity', status: 'toread', added_by: 'ai', added_at: '2026-03-30', reason: 'Cited in 3 of your highlighted books' },
];

// AI-suggested picks shown in the Discover swipe deck. These are NOT inserted
// into the user's library until they swipe right.
export interface AIPick {
  id: number;
  title: string;
  author: string;
  pages: number;
  palette: [string, string];
  genre: string;
  why: string;
  cover_url?: string | null;
}

export const AI_PICKS: AIPick[] = [
  { id: 21, title: 'The Status Game', author: 'Will Storr', pages: 320, palette: ['#3a1e1e', '#c9846d'], genre: 'Social science', why: 'You loved Sapiens-style anthropology and your "avoid productivity-bro" filter — this is observational and warmer.' },
  { id: 22, title: 'Algorithms to Live By', author: 'Christian & Griffiths', pages: 368, palette: ['#1c2541', '#5bc0be'], genre: 'Science', why: 'Bridges your tech background and decision-making interest. Author overlap with your finished list.' },
  { id: 23, title: 'A Swim in a Pond in the Rain', author: 'George Saunders', pages: 432, palette: ['#2b1e3a', '#dfc8e8'], genre: 'Literary', why: 'You finished 3 literary novels in a row — Saunders teaches you how to read them more deeply.' },
  { id: 24, title: 'The Anthropocene Reviewed', author: 'John Green', pages: 304, palette: ['#1a3a3a', '#9bc6c4'], genre: 'Essays', why: 'Short-essay structure pairs with your 20-pages/day cadence; one essay = one sitting.' },
  { id: 25, title: 'How Big Things Get Done', author: 'Flyvbjerg', pages: 304, palette: ['#3a2e1f', '#e8b339'], genre: 'Business', why: 'Same evidence-driven tone as Range. Avoids the productivity-bro framing you flagged.' },
];
