// Types shared by the Discover flow. The actual picks come from DeepSeek
// (supabase/functions/discover-picks); cover URLs are looked up client-side
// against Open Library. There is no built-in seed data — new users start
// with an empty library and populate it through the onboarding flow.

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
