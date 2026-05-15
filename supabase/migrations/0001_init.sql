-- Page Streak schema.
-- All tables are owned by the authenticated user; RLS isolates rows per user.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  goal int not null default 20,
  stretch_goal int not null default 30,
  current_book_id bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text not null,
  pages int not null,
  palette text[] not null default array['#1c2541','#d8d5cf'],
  cover_style text,
  genre text,
  status text not null default 'toread',
  current_page int not null default 0,
  started date,
  finished date,
  rating int,
  added_by text not null default 'manual',
  added_at timestamptz not null default now(),
  reason text,
  friend text,
  why text,
  constraint books_status_check check (status in ('reading','finished','toread','paused'))
);

create index if not exists books_user_status_idx on public.books(user_id, status);

create table if not exists public.reading_logs (
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  pages int not null default 0,
  book_id bigint references public.books(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (user_id, log_date)
);

create index if not exists reading_logs_user_date_idx on public.reading_logs(user_id, log_date desc);

create table if not exists public.cosmetic_prefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme_key text not null default 'cream',
  accent text[] not null default array['#ff7a45','#d22b6b'],
  streak_icon text not null default 'flame',
  constraint cosmetics_theme_check check (theme_key in ('cream','warm','cool','dark')),
  constraint cosmetics_icon_check check (streak_icon in ('flame','bookmark','spark','sun'))
);

-- RLS
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.reading_logs enable row level security;
alter table public.cosmetic_prefs enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own books" on public.books
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own logs" on public.reading_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own cosmetics" on public.cosmetic_prefs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bootstrap rows on signup via trigger.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do nothing;

  insert into public.cosmetic_prefs (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
