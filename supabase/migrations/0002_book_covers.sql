-- Add optional real-cover image URL to books. Procedural BookCover remains the fallback.

alter table public.books
  add column if not exists cover_url text;
