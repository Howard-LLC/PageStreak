-- Onboarding profile fields. Onboarded_at gates the /onboarding flow.

alter table public.profiles
  add column if not exists birthday date,
  add column if not exists gender text,
  add column if not exists onboarded_at timestamptz;

create index if not exists profiles_onboarded_idx on public.profiles(onboarded_at);
