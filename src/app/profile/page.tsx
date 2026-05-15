'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { accentGrad, accentSoftBg } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Page, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Btn, Card } from '@/components/ui/Primitives';
import { StreakIcon } from '@/components/icons/StreakIcon';

interface SideItem {
  label: string;
  sub: string;
  icon: string;
  href: string;
}

const SIDE_ITEMS: SideItem[] = [
  { label: 'Full stats', sub: 'Pages, time-of-day, genres', icon: '📊', href: '/stats' },
  { label: 'Badges', sub: '12 of 24 earned', icon: '🏅', href: '/badges' },
  { label: 'Cosmetics', sub: 'Theme, accent, flame, icon', icon: '🎨', href: '/cosmetics' },
  { label: 'Settings', sub: 'Goal, reminders, data', icon: '⚙️', href: '/cosmetics' },
];

export default function ProfilePage() {
  const { theme, accent, streakIcon } = useTheme();
  const { streak, bestStreak, books, logWithToday, profile, user, signOut } = useApp();
  const router = useRouter();

  const totalPages = useMemo(
    () => Object.values(logWithToday).reduce((s, v) => s + v, 0),
    [logWithToday],
  );
  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const displayName = profile?.display_name ?? user?.email ?? 'Reader';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <TopBar
        title="Profile"
        right={
          <TopBarBtn
            icon={
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7 L11 7 M8 4 L11 7 L8 10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            onClick={() => void signOut()}
          >
            Sign out
          </TopBarBtn>
        }
      />
      <div
        style={{
          background: accentGrad(accent),
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -80,
            top: -120,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 100,
            bottom: -180,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '40px 32px 56px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: '#ffe19f',
              color: '#3a2418',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: `900 42px 'Inter Tight'`,
              letterSpacing: '-0.02em',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
              overflow: 'hidden',
            }}
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initial
            )}
          </div>
          <div>
            <div style={{ font: `900 40px 'Inter Tight'`, letterSpacing: '-0.025em', lineHeight: 1 }}>{displayName}</div>
            <div style={{ font: `500 16px 'Inter Tight'`, opacity: 0.85, marginTop: 6 }}>
              {user?.email ?? ''}
            </div>
          </div>
        </div>
      </div>

      <Page>
        <Card
          padded={false}
          style={{
            padding: 22,
            marginTop: -36,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}
        >
          {(
            [
              ['streak', streak, 'day streak', <StreakIcon key="i" variant={streakIcon} size={28} accent={accent} animated={false} />],
              ['pages', totalPages.toLocaleString(), 'pages read', null],
              ['books', finishedCount, 'books finished', null],
              ['best', bestStreak, 'longest streak', null],
            ] as [string, string | number, string, React.ReactNode][]
          ).map(([k, v, l, icon]) => (
            <button
              key={k}
              onClick={() => router.push('/stats')}
              style={{
                appearance: 'none',
                border: 0,
                background: 'transparent',
                padding: 14,
                textAlign: 'left',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'background 0.15s',
                borderLeft: k === 'streak' ? 'none' : `1px solid ${theme.line}`,
              }}
            >
              {icon && <div style={{ marginBottom: 8 }}>{icon}</div>}
              <div
                style={{
                  font: `900 32px 'Inter Tight'`,
                  letterSpacing: '-0.025em',
                  color: theme.ink,
                  lineHeight: 1,
                }}
              >
                {v}
              </div>
              <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink3, marginTop: 6 }}>{l}</div>
            </button>
          ))}
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginTop: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card style={{ padding: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 18,
                }}
              >
                <div>
                  <div style={{ font: `800 22px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>
                    Recently earned badges
                  </div>
                  <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>12 of 24 earned</div>
                </div>
                <button
                  onClick={() => router.push('/badges')}
                  style={{
                    appearance: 'none',
                    border: 0,
                    background: 'transparent',
                    color: accent[1],
                    font: `600 13px 'Inter Tight'`,
                    cursor: 'pointer',
                  }}
                >
                  See all →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
                {[
                  { l: '1 day', icon: <StreakIcon variant={streakIcon} size={36} accent={accent} animated={false} /> },
                  { l: '7 day', icon: <StreakIcon variant={streakIcon} size={36} accent={accent} animated={false} /> },
                  { l: '30 day', icon: <StreakIcon variant={streakIcon} size={36} accent={accent} animated={false} /> },
                  { l: '500 pp', icon: <span style={{ fontSize: 26 }}>📖</span> },
                  { l: 'Genre', icon: <span style={{ fontSize: 26 }}>🌍</span> },
                  { l: 'Perfect wk', icon: <span style={{ fontSize: 26 }}>✦</span> },
                ].map((b, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: 14,
                        background: accentSoftBg(accent),
                        border: `1px solid ${theme.line}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {b.icon}
                    </div>
                    <div style={{ font: `600 11px 'Inter Tight'`, marginTop: 8, color: theme.ink2 }}>{b.l}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ padding: 24 }}>
              <div
                style={{
                  font: `800 22px 'Inter Tight'`,
                  letterSpacing: '-0.025em',
                  marginBottom: 14,
                  color: theme.ink,
                }}
              >
                This year
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 12,
                }}
              >
                <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3 }}>
                  Read days · pages by month
                </div>
                <button
                  onClick={() => router.push('/stats')}
                  style={{
                    appearance: 'none',
                    border: 0,
                    background: 'transparent',
                    color: accent[1],
                    font: `600 13px 'Inter Tight'`,
                    cursor: 'pointer',
                  }}
                >
                  Full stats →
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90 }}>
                {Array.from({ length: 12 }, (_, i) => 200 + Math.sin(i * 1.2) * 600 + 600).map((v, i) => (
                  <div
                    key={i}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: Math.max(2, v / 18),
                        background: i === 11 ? accentGrad(accent) : accentSoftBg(accent),
                        borderRadius: '4px 4px 1px 1px',
                      }}
                    />
                    <div style={{ font: `500 10px 'Inter Tight'`, color: theme.ink3 }}>
                      {'JFMAMJJASOND'[i]}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SIDE_ITEMS.map((item) => (
              <Card
                key={item.label + item.href}
                padded={false}
                onClick={() => router.push(item.href)}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  transition: 'transform 0.12s, box-shadow 0.15s',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: accentSoftBg(accent),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `700 15px 'Inter Tight'`, color: theme.ink }}>{item.label}</div>
                  <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink3, marginTop: 1 }}>{item.sub}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: theme.ink3 }}>
                  <path
                    d="M5 2 L10 7 L5 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Card>
            ))}
            <Btn ghost style={{ marginTop: 6, color: theme.ink3 }} onClick={() => void signOut()}>
              Sign out
            </Btn>
          </div>
        </div>
      </Page>
    </>
  );
}
