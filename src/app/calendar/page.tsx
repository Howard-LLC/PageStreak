'use client';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { accentGrad, accentSoftBg } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { fmt } from '@/lib/data/streak';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Card } from '@/components/ui/Primitives';
import { StreakIcon } from '@/components/icons/StreakIcon';
import { YearView } from '@/components/calendar/YearView';

type View = 'month' | 'year' | 'all';

export default function CalendarPage() {
  const { theme, accent, streakIcon } = useTheme();
  const { log, todayPages, todayKey, goal, streak, bestStreak } = useApp();
  const router = useRouter();
  const [view, setView] = useState<View>('month');
  const [monthOffset, setMonthOffset] = useState(0);

  const today = useMemo(() => new Date(), []);
  const target = useMemo(() => {
    const t = new Date(today);
    t.setMonth(today.getMonth() + monthOffset);
    return t;
  }, [today, monthOffset]);
  const monthLabel = target.toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const monthDays = useMemo(() => {
    const y = target.getFullYear();
    const m = target.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = first.getDay();
    const cells: ({ d: number; dt: Date; k: string; pages: number; isToday: boolean; isFuture: boolean } | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(y, m, d);
      const k = fmt(dt);
      const pages = k === todayKey ? todayPages : log[k] || 0;
      cells.push({ d, dt, k, pages, isToday: k === todayKey, isFuture: dt > today });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [target, log, todayPages, todayKey, today]);

  const monthStats = useMemo(() => {
    const items = monthDays.filter((c): c is NonNullable<typeof c> => c !== null && !c.isFuture);
    const read = items.filter((c) => c.pages > 0).length;
    const pages = items.reduce((s, c) => s + c.pages, 0);
    return {
      read,
      total: items.length,
      pages,
      pct: items.length ? Math.round((read * 100) / items.length) : 0,
    };
  }, [monthDays]);

  return (
    <Page
      topBar={
        <TopBar
          title="Calendar"
          chevron
          subtabs={[
            { id: 'month', label: 'Month' },
            { id: 'year', label: 'Year' },
            { id: 'all', label: 'All Time' },
          ]}
          activeSubtab={view}
          onSubtab={(id) => setView(id as View)}
          right={
            <TopBarBtn
              icon={
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="3" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.4" />
                  <line x1="2" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              }
              onClick={() => router.push('/recap')}
            >
              This week
            </TopBarBtn>
          }
        />
      }
    >
      <PageHeader kicker="Looking back" title="Calendar" subtitle="Every day you read. Every day you didn't." />

      {view === 'month' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
          <Card style={{ padding: 28 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 22,
              }}
            >
              <button
                onClick={() => setMonthOffset((o) => o - 1)}
                style={{
                  appearance: 'none',
                  border: `1px solid ${theme.line}`,
                  background: theme.surface,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  cursor: 'pointer',
                  color: theme.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path
                    d="M9 2 L4 7 L9 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div style={{ font: `800 22px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>
                {monthLabel}
              </div>
              <button
                onClick={() => setMonthOffset((o) => Math.min(0, o + 1))}
                disabled={monthOffset >= 0}
                style={{
                  appearance: 'none',
                  border: `1px solid ${theme.line}`,
                  background: theme.surface,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  opacity: monthOffset >= 0 ? 0.4 : 1,
                  color: theme.ink,
                  cursor: monthOffset >= 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path
                    d="M5 2 L10 7 L5 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 10 }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: 'center',
                    font: `600 10px 'Inter Tight'`,
                    color: theme.ink3,
                    letterSpacing: '0.08em',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {monthDays.map((c, i) => {
                if (!c) return <div key={i} style={{ aspectRatio: '1' }} />;
                const hit = c.pages >= goal;
                const some = c.pages > 0 && !hit;
                return (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 10,
                      background: c.isFuture
                        ? 'transparent'
                        : hit
                        ? accentGrad(accent)
                        : some
                        ? accentSoftBg(accent)
                        : theme.chip,
                      border: c.isToday ? `2px solid ${accent[1]}` : '1px solid transparent',
                      color: hit ? '#fff' : theme.ink2,
                      position: 'relative',
                      cursor: c.isFuture ? 'default' : 'pointer',
                      opacity: c.isFuture ? 0.3 : 1,
                      overflow: 'hidden',
                    }}
                  >
                    {hit && (
                      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -55%)' }}>
                        <StreakIcon variant={streakIcon} size={28} accent={['#ffe19f', '#fff']} animated={false} />
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        font: `700 12px 'Inter Tight'`,
                        color: hit ? 'rgba(255,255,255,0.85)' : c.isToday ? accent[1] : theme.ink2,
                      }}
                    >
                      {c.d}
                    </div>
                    {some && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 6,
                          right: 6,
                          font: `700 11px 'Inter Tight'`,
                          color: accent[1],
                        }}
                      >
                        {c.pages}
                      </div>
                    )}
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
                }}
              >
                This month
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                <Stat2 v={monthStats.read} l={`of ${monthStats.total} days`} />
                <Stat2 v={monthStats.pct + '%'} l="completion" />
                <Stat2 v={monthStats.pages} l="total pages" />
                <Stat2 v={monthStats.read ? Math.round(monthStats.pages / monthStats.read) : 0} l="avg / read day" />
              </div>
            </Card>
            <Card>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Streak
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
                <StreakIcon variant={streakIcon} size={56} accent={accent} />
                <div>
                  <div
                    style={{
                      font: `900 32px 'Inter Tight'`,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      background: accentGrad(accent),
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {streak} days
                  </div>
                  <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink2, marginTop: 2 }}>
                    Best: {bestStreak} days
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                Legend
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <LegendRow
                  color={accentGrad(accent)}
                  icon={<StreakIcon variant={streakIcon} size={14} accent={['#fff', '#fff']} animated={false} />}
                  label="Goal hit"
                />
                <LegendRow color={accentSoftBg(accent)} label="Read, under goal" />
                <LegendRow color={theme.chip} label="No log" />
                <LegendRow color="transparent" border={`2px solid ${accent[1]}`} label="Today" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {view === 'year' && <YearView year={today.getFullYear()} />}
      {view === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <YearView year={today.getFullYear()} />
          <YearView year={today.getFullYear() - 1} />
        </div>
      )}
    </Page>
  );
}

function Stat2({ v, l }: { v: ReactNode; l: string }) {
  const { theme } = useTheme();
  return (
    <div>
      <div style={{ font: `800 22px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>{v}</div>
      <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>{l}</div>
    </div>
  );
}

function LegendRow({
  color,
  icon,
  label,
  border,
}: {
  color: string;
  icon?: ReactNode;
  label: string;
  border?: CSSProperties['border'];
}) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: color,
          border: border || 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink2 }}>{label}</div>
    </div>
  );
}
