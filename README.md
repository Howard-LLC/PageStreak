# Page Streak

A daily check-in for the pages you read. Frontend ported from the [Claude Design](https://claude.ai/design) handoff bundle, backed by Supabase, deployed as a static site to GitHub Pages.

## Stack

- **Frontend** — Next.js 15 (App Router) with `output: 'export'` for a fully static build. React 19 + TypeScript. No CSS framework — the design uses inline styles + global `@keyframes` to match the editorial mock exactly.
- **Backend** — Supabase (Postgres + Auth + Row-Level Security). The browser calls Supabase directly with the anon key; RLS isolates each user's books, logs, and prefs.
- **Auth** — Google OAuth via Supabase Auth. No custom session code.
- **Hosting** — GitHub Pages, deployed via GitHub Actions on push to `main`. The site lives at `https://<user>.github.io/page-streak/`.

## One-time setup

### 1. Supabase project

1. Sign in at [supabase.com](https://supabase.com), create a new project.
2. In the SQL editor, paste and run `supabase/migrations/0001_init.sql`. This creates `profiles`, `books`, `reading_logs`, `cosmetic_prefs`, RLS policies, and a trigger that bootstraps a profile + cosmetics row on every new sign-up.
3. Grab your project URL and anon key from **Settings → API**.

### 2. Google OAuth (via Supabase)

1. In Google Cloud Console, create an OAuth client (Web application).
   - **Authorised JavaScript origins**: `https://<user>.github.io` and `http://localhost:3000`.
   - **Authorised redirect URIs**: `https://<your-supabase-project>.supabase.co/auth/v1/callback`.
2. In Supabase: **Authentication → Providers → Google**, paste the client ID and secret, enable.
3. In **Authentication → URL configuration**, add `https://<user>.github.io/page-streak/` and `http://localhost:3000` to **Site URL** and **Redirect URLs**.

### 3. Local dev

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open http://localhost:3000.

### 4. GitHub Pages deploy

1. In your repo settings, **Pages → Build and deployment → Source**: GitHub Actions.
2. Add repo **Secrets** (Settings → Secrets and variables → Actions):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Push to `main`. The workflow at `.github/workflows/deploy.yml` runs `next build` with `output: 'export'`, uploads `out/`, and publishes to Pages.

> **Security note** — the anon key is public by design; RLS policies are what keep one user's data inaccessible to another. Never put the **service role** key in this repo.

## Project structure

```
src/
  app/                       # Next.js App Router pages
    page.tsx                 # Today (home)
    login/                   # Google sign-in
    library/                 # Shelf grid + book detail (/library/[id])
    to-read/                 # Queue
    calendar/                # Month + year grid
    recap/                   # Weekly recap
    stats/                   # Reading life stats
    badges/                  # Earned + locked badges
    discover/                # AI swipe deck
    profile/                 # Profile / overview
    cosmetics/               # Theme, accent, icon, goal
    layout.tsx               # Root layout + font links
    globals.css              # Reset + @keyframes
  components/
    layout/                  # Sidebar, Page, TopBar, AppShell
    icons/                   # Logo, Flame/Bookmark/Spark/Sun
    ui/                      # Btn, Card, Pill, Tag, etc.
    checkin/                 # CheckinModal, CelebrateOverlay
    BookCover.tsx            # The book covers, drawn from a palette
  lib/
    design/                  # Theme tokens + ThemeContext
    data/                    # AppStateContext (Supabase queries), types, streak math
    supabase/                # Browser client
supabase/
  migrations/0001_init.sql   # Schema + RLS + bootstrap trigger
.github/workflows/deploy.yml # Build + publish to Pages
```

## What gets seeded

On first sign-in (no books yet), 12 starter books from the design's seed list are inserted into the user's library. They can be deleted, paused, finished, or marked as currently reading.

## Caveats

- This is a **static export**. There are no Next.js API routes; all server-side work happens in Supabase. If you need server logic (cron, webhooks, AI calls), add Supabase Edge Functions and call them from the client.
- The **Discover** screen ships with a fixed 5-pick AI suggestion list (`AI_PICKS` in `src/lib/data/seedBooks.ts`). Wiring it up to a real LLM is left to a future iteration — point an Edge Function at the Anthropic API and replace the static list.
- The **Onboarding** flow from the design's chat transcript isn't wired up yet — sign-in goes straight to Today. Add `/onboarding` if you want a first-run flow.

## Credits

Design handoff bundle from Claude Design (claude.ai/design). Editorial direction: Swiss-minimal / library-archive — serif-forward, off-white, single accent reserved for the streak.
