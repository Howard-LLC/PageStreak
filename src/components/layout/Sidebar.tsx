'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { T, THEMES, type ThemeKey } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Logo } from '@/components/icons/Logo';
import { StreakIcon } from '@/components/icons/StreakIcon';
import { NavIcon } from './NavIcon';

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: 'Reading',
    items: [
      { id: 'today', href: '/', label: 'Today', icon: 'today' },
      { id: 'library', href: '/library', label: 'Library', icon: 'shelf' },
      { id: 'to-read', href: '/to-read', label: 'To-read', icon: 'queue' },
    ],
  },
  {
    label: 'History',
    items: [
      { id: 'calendar', href: '/calendar', label: 'Calendar', icon: 'cal' },
      { id: 'recap', href: '/recap', label: 'Weekly recap', icon: 'recap' },
      { id: 'stats', href: '/stats', label: 'Stats', icon: 'stats' },
      { id: 'badges', href: '/badges', label: 'Badges', icon: 'badges' },
    ],
  },
  {
    label: 'Discover',
    items: [{ id: 'discover', href: '/discover', label: 'Find a book', icon: 'spark' }],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

function ThemeSwitcher() {
  const { themeKey, setThemeKey, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Theme"
        style={{
          appearance: 'none',
          border: 0,
          background: open ? theme.chipHover : 'transparent',
          width: 32,
          height: 32,
          borderRadius: 8,
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: open ? theme.ink : theme.ink2,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 1.5 a6.5 6.5 0 0 1 0 13 Z" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            left: 'calc(100% + 12px)',
            bottom: 0,
            background: theme.surface,
            borderRadius: 10,
            border: `1px solid ${theme.line}`,
            boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
            padding: 10,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            width: 144,
            animation: 'ps-fade-up 0.15s ease',
          }}
        >
          <div
            style={{
              font: `500 9px ${T.sans}`,
              color: theme.ink3,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              padding: '2px 6px 6px',
            }}
          >
            Theme
          </div>
          {(['cream', 'warm', 'cool', 'dark'] as ThemeKey[]).map((t) => {
            const TH = THEMES[t];
            const active = themeKey === t;
            return (
              <button
                key={t}
                onClick={() => {
                  setThemeKey(t);
                  setOpen(false);
                }}
                style={{
                  appearance: 'none',
                  border: 0,
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: active ? theme.chipHover : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  font: `${active ? 500 : 400} 13px ${T.serif}`,
                  color: theme.ink,
                  transition: 'background 0.12s',
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: TH.bg,
                    border: `1px solid ${TH.lineStrong}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      right: 2,
                      bottom: 2,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: TH.ink,
                    }}
                  />
                </span>
                <span style={{ flex: 1 }}>{TH.name}</span>
                {active && (
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                      d="M2 6 L5 9 L10 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, accent, streakIcon } = useTheme();
  const { streak, profile } = useApp();
  const initial = (profile?.display_name ?? 'A').charAt(0).toUpperCase();
  const cosmeticsActive = pathname === '/cosmetics';
  const profileActive = pathname === '/profile';

  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 64,
        background: theme.bgDeep,
        borderRight: `1px solid ${theme.line}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '18px 0',
        zIndex: 20,
      }}
    >
      <button
        onClick={() => router.push('/')}
        title="Page Streak"
        style={{
          appearance: 'none',
          border: 0,
          background: 'transparent',
          cursor: 'pointer',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.ink,
          marginBottom: 22,
        }}
      >
        <Logo size={26} mono />
      </button>

      <button
        onClick={() => router.push('/calendar')}
        title={`${streak} day streak`}
        style={{
          appearance: 'none',
          border: `1px solid ${theme.line}`,
          background: theme.surface,
          width: 40,
          height: 40,
          borderRadius: 10,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
          padding: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = theme.chipHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = theme.surface)}
      >
        <StreakIcon variant={streakIcon} size={18} accent={accent} animated={false} />
        <div style={{ font: `600 9px ${T.sans}`, color: theme.ink, marginTop: 1, lineHeight: 1 }}>
          {streak}
        </div>
      </button>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
        }}
        className="ps-noscroll"
      >
        {SECTIONS.map((sec, si) => (
          <div
            key={sec.label}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}
          >
            {si > 0 && <div style={{ width: 24, height: 1, background: theme.line, margin: '8px 0' }} />}
            {sec.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  title={item.label}
                  style={{
                    appearance: 'none',
                    border: 0,
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    padding: 0,
                    background: active ? theme.chipHover : 'transparent',
                    color: active ? theme.ink : theme.ink2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'background 0.12s, color 0.12s',
                  }}
                >
                  <NavIcon id={item.icon} active={active} />
                  {active && (
                    <div
                      style={{
                        position: 'absolute',
                        left: -8,
                        top: 8,
                        bottom: 8,
                        width: 2,
                        background: theme.ink,
                        borderRadius: 2,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          marginTop: 8,
          paddingTop: 12,
          borderTop: `1px solid ${theme.line}`,
          width: 32,
        }}
      >
        <ThemeSwitcher />
        <button
          onClick={() => router.push('/cosmetics')}
          title="Settings"
          style={{
            appearance: 'none',
            border: 0,
            background: cosmeticsActive ? theme.chipHover : 'transparent',
            width: 32,
            height: 32,
            borderRadius: 8,
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: cosmeticsActive ? theme.ink : theme.ink2,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M8 1 V3 M8 13 V15 M1 8 H3 M13 8 H15 M3 3 L4.5 4.5 M11.5 11.5 L13 13 M3 13 L4.5 11.5 M11.5 4.5 L13 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          onClick={() => router.push('/profile')}
          title="Profile"
          style={{
            appearance: 'none',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: theme.ink,
            color: theme.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: `500 12px ${T.sans}`,
            boxShadow: profileActive ? `0 0 0 2px ${theme.bgDeep}, 0 0 0 3px ${theme.ink}` : 'none',
          }}
        >
          {initial}
        </button>
      </div>
    </nav>
  );
}
