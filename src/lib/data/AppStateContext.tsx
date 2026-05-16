'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase, hasSupabaseEnv } from '@/lib/supabase/client';
import { computeBestStreak, computeStreak, fmt, todayKey } from './streak';
import type { Book, Profile } from './types';

interface OnboardingPayload {
  birthday: string | null;
  gender: string | null;
}

interface AppState {
  loading: boolean;
  authReady: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  books: Book[];
  log: Record<string, number>;
  todayPages: number;
  goal: number;
  stretchGoal: number;
  currentBook: Book | undefined;
  currentBookId: number | null;
  streak: number;
  bestStreak: number;
  logWithToday: Record<string, number>;
  todayKey: string;
  // mutations
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  logPages: (n: number) => Promise<void>;
  setPagesAbsolute: (n: number) => Promise<void>;
  setGoal: (n: number) => Promise<void>;
  setCurrentBookId: (id: number) => Promise<void>;
  updateBook: (id: number, patch: Partial<Book>) => Promise<void>;
  addBook: (book: Omit<Book, 'id' | 'user_id'>) => Promise<Book | null>;
  completeOnboarding: (payload: OnboardingPayload) => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

interface RawBookRow {
  id: number;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  palette: string[];
  cover_style: string | null;
  cover_url: string | null;
  genre: string | null;
  status: string;
  current_page: number;
  started: string | null;
  finished: string | null;
  rating: number | null;
  added_by: string;
  added_at: string;
  reason: string | null;
  friend: string | null;
  why: string | null;
}

function rowToBook(r: RawBookRow): Book {
  return {
    id: r.id,
    user_id: r.user_id,
    title: r.title,
    author: r.author,
    pages: r.pages,
    palette: [r.palette[0], r.palette[1]] as [string, string],
    cover_style: r.cover_style ?? undefined,
    cover_url: r.cover_url,
    genre: r.genre ?? undefined,
    status: r.status as Book['status'],
    current_page: r.current_page,
    started: r.started,
    finished: r.finished,
    rating: r.rating,
    added_by: r.added_by as Book['added_by'],
    added_at: r.added_at,
    reason: r.reason,
    friend: r.friend,
    why: r.why,
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const supabaseAvailable = hasSupabaseEnv();
  const [authReady, setAuthReady] = useState(!supabaseAvailable);
  const [loading, setLoading] = useState(supabaseAvailable);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [log, setLog] = useState<Record<string, number>>({});

  const user = session?.user ?? null;

  const load = useCallback(async (uid: string) => {
    if (!supabaseAvailable) return;
    const sb = getSupabase();
    const [profileRes, booksRes, logsRes] = await Promise.all([
      sb.from('profiles').select('*').eq('user_id', uid).maybeSingle(),
      sb.from('books').select('*').eq('user_id', uid).order('added_at', { ascending: false }),
      sb.from('reading_logs').select('log_date, pages').eq('user_id', uid),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data as Profile);
    }

    const userBooks = (booksRes.data ?? []).map((r) => rowToBook(r as RawBookRow));
    setBooks(userBooks);

    const logMap: Record<string, number> = {};
    for (const row of logsRes.data ?? []) {
      const r = row as { log_date: string; pages: number };
      logMap[r.log_date] = r.pages;
    }
    setLog(logMap);
  }, [supabaseAvailable]);

  useEffect(() => {
    if (!supabaseAvailable) return;
    const sb = getSupabase();
    let active = true;
    sb.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthReady(true);
      if (data.session?.user) {
        void load(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setLoading(true);
        void load(s.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setBooks([]);
        setLog({});
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabaseAvailable, load]);

  const tk = todayKey();
  const todayPages = log[tk] ?? 0;
  const logWithToday = useMemo(() => ({ ...log, [tk]: todayPages }), [log, tk, todayPages]);
  const streak = useMemo(() => computeStreak(log, todayPages), [log, todayPages]);
  const bestStreak = useMemo(() => computeBestStreak(logWithToday), [logWithToday]);
  const currentBookId = profile?.current_book_id ?? books.find((b) => b.status === 'reading')?.id ?? null;
  const currentBook = useMemo(
    () => books.find((b) => b.id === currentBookId),
    [books, currentBookId],
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabaseAvailable) return;
    const sb = getSupabase();
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}`
            : undefined,
      },
    });
  }, [supabaseAvailable]);

  const signOut = useCallback(async () => {
    if (!supabaseAvailable) return;
    const sb = getSupabase();
    await sb.auth.signOut();
  }, [supabaseAvailable]);

  const logPages = useCallback(
    async (n: number) => {
      if (!user) return;
      const sb = getSupabase();
      const next = (log[tk] ?? 0) + n;
      setLog((p) => ({ ...p, [tk]: next }));
      await sb.from('reading_logs').upsert({
        user_id: user.id,
        log_date: tk,
        pages: next,
        book_id: currentBookId,
      });
      if (currentBook) {
        const newPage = Math.min(currentBook.pages, (currentBook.current_page ?? 0) + n);
        setBooks((bs) =>
          bs.map((b) => (b.id === currentBook.id ? { ...b, current_page: newPage } : b)),
        );
        await sb.from('books').update({ current_page: newPage }).eq('id', currentBook.id);
      }
    },
    [user, log, tk, currentBookId, currentBook],
  );

  const setPagesAbsolute = useCallback(
    async (n: number) => {
      if (!user) return;
      const sb = getSupabase();
      setLog((p) => ({ ...p, [tk]: n }));
      await sb.from('reading_logs').upsert({
        user_id: user.id,
        log_date: tk,
        pages: n,
        book_id: currentBookId,
      });
    },
    [user, tk, currentBookId],
  );

  const setGoal = useCallback(
    async (n: number) => {
      if (!user) return;
      const sb = getSupabase();
      setProfile((p) => (p ? { ...p, goal: n } : p));
      await sb.from('profiles').update({ goal: n }).eq('user_id', user.id);
    },
    [user],
  );

  const setCurrentBookId = useCallback(
    async (id: number) => {
      if (!user) return;
      const sb = getSupabase();
      setProfile((p) => (p ? { ...p, current_book_id: id } : p));
      await sb.from('profiles').update({ current_book_id: id }).eq('user_id', user.id);
    },
    [user],
  );

  const updateBook = useCallback(
    async (id: number, patch: Partial<Book>) => {
      if (!user) return;
      const sb = getSupabase();
      setBooks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      await sb.from('books').update(patch).eq('id', id);
    },
    [user],
  );

  const addBook = useCallback(
    async (book: Omit<Book, 'id' | 'user_id'>) => {
      if (!user) return null;
      const sb = getSupabase();
      const insert = { ...book, user_id: user.id };
      const { data, error } = await sb.from('books').insert(insert).select().single();
      if (error || !data) return null;
      const b = rowToBook(data as RawBookRow);
      setBooks((bs) => [b, ...bs]);
      return b;
    },
    [user],
  );

  const completeOnboarding = useCallback(
    async ({ birthday, gender }: OnboardingPayload) => {
      if (!user) return;
      const sb = getSupabase();
      const now = new Date().toISOString();
      const patch = { birthday, gender, onboarded_at: now };
      setProfile((p) => (p ? { ...p, ...patch } : p));
      await sb.from('profiles').update(patch).eq('user_id', user.id);
    },
    [user],
  );

  const refresh = useCallback(async () => {
    if (user) await load(user.id);
  }, [user, load]);

  const value: AppState = {
    loading,
    authReady,
    session,
    user,
    profile,
    books,
    log,
    todayPages,
    goal: profile?.goal ?? 20,
    stretchGoal: profile?.stretch_goal ?? 30,
    currentBook,
    currentBookId,
    streak,
    bestStreak,
    logWithToday,
    todayKey: tk,
    signInWithGoogle,
    signOut,
    logPages,
    setPagesAbsolute,
    setGoal,
    setCurrentBookId,
    updateBook,
    addBook,
    completeOnboarding,
    refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppStateProvider>');
  return v;
}

export { fmt };
