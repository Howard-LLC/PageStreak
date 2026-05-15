'use client';
import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useApp } from '@/lib/data/AppStateContext';
import { useTheme } from '@/lib/design/ThemeContext';
import { hasSupabaseEnv } from '@/lib/supabase/client';

const FULL_BLEED_ROUTES = ['/login', '/onboarding'];

function isFullBleed(pathname: string) {
  return FULL_BLEED_ROUTES.includes(pathname);
}

export function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { authReady, user, loading } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const fullBleed = isFullBleed(pathname);

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    if (!authReady) return;
    if (!user && !fullBleed) {
      router.replace('/login');
    }
  }, [authReady, user, fullBleed, router]);

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: theme.bg, color: theme.ink }}>
      {!fullBleed && user && <Sidebar />}
      <main
        style={{
          marginLeft: fullBleed || !user ? 0 : 64,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {!hasSupabaseEnv() ? <MissingEnvNotice /> : loading && user ? <Loading /> : children}
      </main>
    </div>
  );
}

function Loading() {
  const { theme } = useTheme();
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.ink3,
        fontFamily: "'Source Serif 4', serif",
        fontStyle: 'italic',
      }}
    >
      Loading your reading life…
    </div>
  );
}

function MissingEnvNotice() {
  const { theme } = useTheme();
  return (
    <div
      style={{
        maxWidth: 560,
        margin: '120px auto',
        padding: 36,
        border: `1px solid ${theme.lineStrong}`,
        borderRadius: 12,
        background: theme.surface,
        color: theme.ink,
        fontFamily: "'Inter Tight', system-ui, sans-serif",
      }}
    >
      <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, letterSpacing: '-0.025em' }}>
        Supabase not configured
      </h1>
      <p style={{ marginTop: 12, color: theme.ink2, lineHeight: 1.55 }}>
        Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
        <code>.env.local</code> (locally) or GitHub Actions repo secrets (for the deployed site), then
        rebuild.
      </p>
      <p style={{ marginTop: 12, color: theme.ink2, lineHeight: 1.55 }}>
        See <code>README.md</code> for the full setup.
      </p>
    </div>
  );
}
