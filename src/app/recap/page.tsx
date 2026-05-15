'use client';
import { useMemo } from 'react';
import { accentGrad, accentSoftBg } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { fmt } from '@/lib/data/streak';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Card } from '@/components/ui/Primitives';
import { BookCover } from '@/components/BookCover';
import { StreakIcon } from '@/components/icons/StreakIcon';

export default function RecapPage() {
  const { theme, accent, streakIcon } = useTheme();
  const { log, todayPages, goal, currentBook, books } = useApp();

  const days = useMemo(() => {
    const today = new Date();
    const out: { d: Date; k: string; pages: number; dow: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = fmt(d);
      const pages = i === 0 ? todayPages : log[k] || 0;
      out.push({ d, k, pages, dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] });
    }
    return out;
  }, [log, todayPages]);

  const weekPages = days.reduce((s, d) => s + d.pages, 0);
  const daysRead = days.filter((d) => d.pages > 0).length;
  const lastWeekPages = useMemo(() => {
    let sum = 0;
    for (let i = 13; i >= 7; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      sum += log[fmt(d)] || 0;
    }
    return sum;
  }, [log]);
  const delta = weekPages - lastWeekPages;
  const maxPages = Math.max(...days.map((d) => d.pages), goal);

  return (
    <Page
      topBar={
        <TopBar
          title="Weekly recap"
          right={
            <>
              <TopBarBtn
                icon={
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 2 V9 M4 6 L7 9 L10 6 M2 11 H12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Save
              </TopBarBtn>
              <TopBarBtn
                icon={
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 9 V2 M4 5 L7 2 L10 5 M2 11 H12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Share
              </TopBarBtn>
            </>
          }
        />
      }
    >
      <PageHeader
        kicker="Weekly recap"
        title="Your week"
        subtitle={`${days[0].d.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${days[6].d.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 24 }}>
        <Card style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Pages this week
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
                <span
                  style={{
                    font: `900 64px 'Inter Tight'`,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    background: accentGrad(accent),
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {weekPages}
                </span>
                <span style={{ font: `600 16px 'Inter Tight'`, color: delta >= 0 ? '#3a7d44' : '#c84a3a' }}>
                  {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)} vs last
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Days read
              </div>
              <div style={{ font: `900 36px 'Inter Tight'`, letterSpacing: '-0.03em', marginTop: 4, color: theme.ink }}>
                {daysRead}
                <span style={{ font: `700 18px 'Inter Tight'`, color: theme.ink3 }}>/7</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, marginTop: 32 }}>
            {days.map((d, i) => {
              const pct = d.pages / maxPages;
              const hit = d.pages >= goal;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ font: `700 14px 'Inter Tight'`, color: theme.ink, fontVariantNumeric: 'tabular-nums' }}>
                    {d.pages || ''}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: Math.max(4, pct * 130),
                      background: hit ? accentGrad(accent) : d.pages > 0 ? accentSoftBg(accent) : theme.chip,
                      borderRadius: '8px 8px 2px 2px',
                      transition: 'height 0.5s ease',
                      position: 'relative',
                    }}
                  >
                    {hit && (
                      <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)' }}>
                        <StreakIcon variant={streakIcon} size={18} accent={['#fff', '#fff']} animated={false} />
                      </div>
                    )}
                  </div>
                  <div style={{ font: `600 12px 'Inter Tight'`, color: theme.ink3 }}>{d.dow.slice(0, 3)}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <div
              style={{
                font: `600 11px 'Inter Tight'`,
                color: theme.ink3,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Notable
            </div>
            <div style={{ font: `500 14px 'Inter Tight'`, color: theme.ink, lineHeight: 1.55 }}>
              You read on <b>{daysRead} of 7 days</b>. Made progress on <b>{currentBook?.title ?? 'your current book'}</b>.
              {daysRead === 7 && (
                <>
                  {' '}
                  Earned <span style={{ color: accent[1], fontWeight: 700 }}>Perfect Week</span> ✦
                </>
              )}
            </div>
          </Card>

          <Card>
            <div
              style={{
                font: `600 11px 'Inter Tight'`,
                color: theme.ink3,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              This week vs last
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(
                [
                  ['Pages', weekPages, lastWeekPages],
                  ['Days', daysRead, 5],
                  ['Avg/day', daysRead ? Math.round(weekPages / daysRead) : 0, 22],
                ] as [string, number, number][]
              ).map(([l, a, b]) => (
                <div
                  key={l}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    font: `500 13px 'Inter Tight'`,
                  }}
                >
                  <span style={{ color: theme.ink2 }}>{l}</span>
                  <span style={{ color: theme.ink }}>
                    <b>{a}</b> <span style={{ color: theme.ink3 }}>vs {b}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div
              style={{
                font: `600 11px 'Inter Tight'`,
                color: theme.ink3,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Books touched
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {books
                .filter((b) => b.status === 'reading')
                .slice(0, 3)
                .map((b) => (
                  <BookCover key={b.id} book={b} w={48} h={68} />
                ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
