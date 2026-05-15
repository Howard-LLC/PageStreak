'use client';
import { useMemo, useState } from 'react';
import { accentGrad } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Card, Divider } from '@/components/ui/Primitives';

type Range = 'month' | 'year' | 'all';

export default function StatsPage() {
  const { theme, accent } = useTheme();
  const { logWithToday, books, streak, bestStreak } = useApp();
  const [range, setRange] = useState<Range>('all');

  const totalPages = useMemo(
    () => Object.values(logWithToday).reduce((s, v) => s + v, 0),
    [logWithToday],
  );
  const totalDays = useMemo(
    () => Object.values(logWithToday).filter((v) => v > 0).length,
    [logWithToday],
  );
  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const avgPerReadDay = totalDays ? Math.round(totalPages / totalDays) : 0;

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(logWithToday).forEach(([d, p]) => {
      const k = d.slice(0, 7);
      map[k] = (map[k] || 0) + p;
    });
    const today = new Date();
    const out: { k: string; m: string; val: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const k = d.toISOString().slice(0, 7);
      out.push({ k, m: d.toLocaleDateString('en', { month: 'short' }), val: map[k] || 0 });
    }
    return out;
  }, [logWithToday]);
  const maxMonthly = Math.max(...monthlyData.map((m) => m.val), 100);

  const genres = useMemo(() => {
    const g: Record<string, number> = {};
    books
      .filter((b) => b.status === 'finished')
      .forEach((b) => {
        g[b.genre || 'Other'] = (g[b.genre || 'Other'] || 0) + 1;
      });
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }, [books]);
  const maxGenre = Math.max(...genres.map((x) => x[1]), 1);

  return (
    <Page
      topBar={
        <TopBar
          title="Stats"
          chevron
          subtabs={[
            { id: 'month', label: '30 days' },
            { id: 'year', label: '12 months' },
            { id: 'all', label: 'All time' },
          ]}
          activeSubtab={range}
          onSubtab={(id) => setRange(id as Range)}
          right={
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
              Export
            </TopBarBtn>
          }
        />
      }
    >
      <PageHeader kicker="Reading life" title="Stats" subtitle="Everything you've read, when, and what it adds up to." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <Card style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              font: `600 11px 'Inter Tight'`,
              color: theme.ink3,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Pages
          </div>
          <div
            style={{
              font: `900 44px 'Inter Tight'`,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              marginTop: 6,
              background: accentGrad(accent),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {totalPages.toLocaleString()}
          </div>
          <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink2, marginTop: 6 }}>
            across {totalDays} days
          </div>
        </Card>
        <Card style={{ padding: 22 }}>
          <div
            style={{
              font: `600 11px 'Inter Tight'`,
              color: theme.ink3,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Books finished
          </div>
          <div
            style={{
              font: `900 44px 'Inter Tight'`,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              marginTop: 6,
              color: theme.ink,
            }}
          >
            {finishedCount}
          </div>
          <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink2, marginTop: 6 }}>
            ≈ {Math.max(1, Math.round((finishedCount / 8) * 4))} per month
          </div>
        </Card>
        <Card style={{ padding: 22 }}>
          <div
            style={{
              font: `600 11px 'Inter Tight'`,
              color: theme.ink3,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Avg per read day
          </div>
          <div
            style={{
              font: `900 44px 'Inter Tight'`,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              marginTop: 6,
              color: theme.ink,
            }}
          >
            {avgPerReadDay}
            <span style={{ font: `700 18px 'Inter Tight'`, color: theme.ink3, marginLeft: 4 }}>pp</span>
          </div>
          <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink2, marginTop: 6 }}>steady pace</div>
        </Card>
        <Card style={{ padding: 22 }}>
          <div
            style={{
              font: `600 11px 'Inter Tight'`,
              color: theme.ink3,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Best streak
          </div>
          <div
            style={{
              font: `900 44px 'Inter Tight'`,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              marginTop: 6,
              color: theme.ink,
            }}
          >
            {bestStreak}
            <span style={{ font: `700 18px 'Inter Tight'`, color: theme.ink3, marginLeft: 4 }}>days</span>
          </div>
          <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink2, marginTop: 6 }}>current: {streak}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 24 }}>
        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 2, color: theme.ink }}>
            Pages per month
          </div>
          <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3, marginBottom: 22 }}>Last 12 months</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 200 }}>
            {monthlyData.map((m, i) => {
              const pct = m.val / maxMonthly;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      font: `600 11px 'Inter Tight'`,
                      color: theme.ink2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {m.val ? Math.round(m.val / 100) / 10 + 'k' : ''}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: Math.max(4, pct * 160),
                      background: i === monthlyData.length - 1 ? accentGrad(accent) : `${accent[0]}33`,
                      borderRadius: '6px 6px 1px 1px',
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3 }}>{m.m}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 2, color: theme.ink }}>
            Favorite time
          </div>
          <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3, marginBottom: 22 }}>
            When you tend to read
          </div>
          <div
            style={{
              font: `900 36px 'Inter Tight'`,
              letterSpacing: '-0.025em',
              background: accentGrad(accent),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            9–11<span style={{ font: `700 18px 'Inter Tight'`, color: theme.ink2 }}>pm</span>
          </div>
          <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink2, marginTop: 4 }}>64% of sessions</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 70, marginTop: 22 }}>
            {[1, 1, 1, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 2, 3, 4, 5, 7, 12, 18, 16, 12, 8, 4].map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: Math.max(2, v * 3.5),
                  background: i >= 21 ? accent[1] : i >= 17 ? accent[0] : accent[0] + '60',
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              font: `500 10px 'Inter Tight'`,
              color: theme.ink3,
              marginTop: 6,
            }}
          >
            <span>12am</span>
            <span>6am</span>
            <span>12pm</span>
            <span>6pm</span>
            <span>12am</span>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 18, color: theme.ink }}>
            Favorite genres
          </div>
          {genres.map(([g, n]) => {
            const pct = (n / maxGenre) * 100;
            return (
              <div key={g} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    font: `600 13px 'Inter Tight'`,
                    marginBottom: 5,
                    color: theme.ink,
                  }}
                >
                  <span>{g}</span>
                  <span style={{ color: theme.ink3 }}>
                    {n} {n === 1 ? 'book' : 'books'}
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: theme.chip, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: pct + '%',
                      background: accentGrad(accent),
                      borderRadius: 4,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 18, color: theme.ink }}>
            By the numbers
          </div>
          {(
            [
              ['Fastest read', '4 days', '"Project Hail Mary"'],
              ['Longest read', '94 days', '"The Body Keeps the Score"'],
              ['Most pages in a day', '82 pages', 'Mar 12'],
              ['Most consistent month', 'February', '24 of 28 days'],
              ['Average book length', '358 pages', null],
            ] as [string, string, string | null][]
          ).map(([l, v, s], i) => (
            <div key={l}>
              {i > 0 && <Divider style={{ margin: '12px 0' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink2 }}>{l}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: `700 14px 'Inter Tight'`, color: theme.ink }}>{v}</div>
                  {s && (
                    <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3, marginTop: 1 }}>{s}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Page>
  );
}
