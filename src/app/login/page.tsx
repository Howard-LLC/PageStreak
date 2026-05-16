'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/design/ThemeContext';
import { accentGrad } from '@/lib/design/theme';
import { useApp } from '@/lib/data/AppStateContext';
import { Wordmark } from '@/components/icons/Logo';

export default function LoginPage() {
  const { theme, accent } = useTheme();
  const { user, signInWithGoogle, authReady } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (authReady && user) router.replace('/');
  }, [authReady, user, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>
      <div
        style={{
          background: theme.isDark ? '#0a0908' : '#0e0a08',
          color: '#fff',
          padding: '64px 64px 48px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -100,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent[0]}55 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            right: -120,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent[1]}44 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        <Wordmark size={20} accent={accent} mono={false} style={{ position: 'relative' }} />

        <div style={{ position: 'relative' }}>
          <div
            style={{
              font: `900 88px 'Inter Tight'`,
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              animation: 'ps-fade-up 0.6s ease',
            }}
          >
            Read a<br />
            few pages.<br />
            <span
              style={{
                background: accentGrad(accent),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Every day.
            </span>
          </div>
          <div
            style={{
              font: `500 22px 'Inter Tight'`,
              opacity: 0.85,
              marginTop: 28,
              maxWidth: 540,
              lineHeight: 1.5,
              animation: 'ps-fade-up 0.6s ease 0.1s both',
            }}
          >
            A daily check-in for the pages you read. Build a streak, find better books, and see your
            reading life as a whole.
          </div>
          <div
            style={{
              display: 'flex',
              gap: 36,
              marginTop: 48,
              animation: 'ps-fade-up 0.6s ease 0.2s both',
            }}
          >
            <Stat n="14K+" l="Pages tracked" />
            <Stat n="284" l="Days read this year" />
            <Stat n="23" l="Books finished" />
          </div>
        </div>

        <div style={{ position: 'relative', font: `500 14px 'Inter Tight'`, opacity: 0.55 }}>
          © 2026 Page Streak · Built for people who actually read.
        </div>
      </div>

      <div
        style={{
          background: theme.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            background: theme.surface,
            borderRadius: 20,
            border: `1px solid ${theme.line}`,
            padding: 36,
            boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 24px 60px rgba(0,0,0,0.08)',
            animation: 'ps-fade-up 0.5s ease 0.15s both',
          }}
        >
          <div style={{ font: `800 30px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>
            Welcome back.
          </div>
          <div style={{ font: `500 17px 'Inter Tight'`, color: theme.ink2, marginTop: 8, lineHeight: 1.4 }}>
            Pick up where you left off.
          </div>

          <button
            onClick={() => void signInWithGoogle()}
            style={{
              appearance: 'none',
              border: `1px solid ${theme.lineStrong}`,
              borderRadius: 14,
              background: theme.surface,
              color: theme.ink,
              font: `600 17px 'Inter Tight'`,
              padding: '16px 20px',
              width: '100%',
              marginTop: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer',
              boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 20 20">
              <path
                d="M19.6 10.23c0-.7-.06-1.36-.16-2H10v3.78h5.36c-.23 1.24-.94 2.3-2 3v2.5h3.22c1.88-1.73 2.97-4.28 2.97-7.28Z"
                fill="#4285F4"
              />
              <path
                d="M10 20c2.7 0 4.96-.9 6.6-2.42l-3.21-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.81-1.76-5.6-4.13H1.07v2.6A10 10 0 0 0 10 20Z"
                fill="#34A853"
              />
              <path
                d="M4.4 11.9c-.2-.6-.32-1.24-.32-1.9 0-.66.12-1.3.32-1.9V5.5H1.07a10 10 0 0 0 0 9l3.33-2.6Z"
                fill="#FBBC05"
              />
              <path
                d="M10 3.97c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95.96 12.7 0 10 0A10 10 0 0 0 1.07 5.5L4.4 8.1C5.19 5.73 7.4 3.97 10 3.97Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '26px 0',
              font: `500 12px 'Inter Tight'`,
              color: theme.ink3,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ flex: 1, height: 1, background: theme.line }} /> Why?{' '}
            <div style={{ flex: 1, height: 1, background: theme.line }} />
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              'No passwords — one-tap sign-in.',
              'Your name and avatar come from Google.',
              'Delete your account anytime in settings.',
            ].map((t, i) => (
              <li
                key={i}
                style={{
                  font: `500 15px 'Inter Tight'`,
                  color: theme.ink2,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  lineHeight: 1.45,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 14 14" style={{ flex: '0 0 auto', marginTop: 4 }}>
                  <path
                    d="M2 7 L6 11 L12 3"
                    fill="none"
                    stroke={accent[1]}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t}
              </li>
            ))}
          </ul>

          <div
            style={{
              font: `500 12px 'Inter Tight'`,
              color: theme.ink3,
              marginTop: 28,
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            By signing in you agree to our Terms & Privacy.
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div style={{ font: `900 36px 'Inter Tight'`, letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
      <div
        style={{
          font: `500 13px 'Inter Tight'`,
          opacity: 0.78,
          marginTop: 6,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {l}
      </div>
    </div>
  );
}
