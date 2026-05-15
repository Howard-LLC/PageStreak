'use client';
import { accentGrad, accentSoftBg, T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Page, PageHeader, TopBar } from '@/components/layout/Page';
import { Card } from '@/components/ui/Primitives';
import { StreakIcon } from '@/components/icons/StreakIcon';

interface BadgeSimple {
  id?: string;
  d?: number;
  label: string;
  earned: boolean;
  icon?: string;
  desc?: string;
}

export default function BadgesPage() {
  const { theme, accent, streakIcon } = useTheme();
  const { streak, bestStreak, books, logWithToday } = useApp();

  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const totalPages = Object.values(logWithToday).reduce((s, v) => s + v, 0);

  const streakBadges: BadgeSimple[] = [
    { d: 1, earned: streak >= 1, label: '1 day' },
    { d: 3, earned: streak >= 3, label: '3 days' },
    { d: 7, earned: bestStreak >= 7, label: '7 days' },
    { d: 14, earned: bestStreak >= 14, label: '2 weeks' },
    { d: 30, earned: bestStreak >= 30, label: '30 days' },
    { d: 50, earned: bestStreak >= 50, label: '50 days' },
    { d: 100, earned: false, label: '100 days' },
    { d: 365, earned: false, label: '1 year' },
  ];

  const milestones: BadgeSimple[] = [
    { id: 'p100', earned: totalPages >= 100, label: '100 pages', icon: '📖' },
    { id: 'p1000', earned: totalPages >= 1000, label: '1K pages', icon: '📚' },
    { id: 'p10000', earned: totalPages >= 10000, label: '10K pages', icon: '🗞️' },
    { id: 'p100k', earned: false, label: '100K pages', icon: '📰' },
    { id: 'b1', earned: finishedCount >= 1, label: 'First book', icon: '🥇' },
    { id: 'b10', earned: finishedCount >= 10, label: '10 books', icon: '🎖️' },
    { id: 'b25', earned: finishedCount >= 25, label: '25 books', icon: '🏆' },
    { id: 'b100', earned: false, label: '100 books', icon: '👑' },
  ];

  const moments: BadgeSimple[] = [
    { id: 'pw', earned: true, label: 'Perfect week', icon: '✦', desc: '7/7 days in one week' },
    { id: 'pm', earned: false, label: 'Perfect month', icon: '✨', desc: 'All days in a calendar month' },
    { id: 'pn', earned: true, label: 'Night owl', icon: '🌙', desc: '50 sessions after 10pm' },
    { id: 'pe', earned: false, label: 'Early bird', icon: '🌅', desc: '20 sessions before 7am' },
  ];

  const total = streakBadges.length + milestones.length + moments.length;
  const earnedTotal =
    streakBadges.filter((b) => b.earned).length +
    milestones.filter((b) => b.earned).length +
    moments.filter((b) => b.earned).length;

  return (
    <Page
      topBar={
        <TopBar
          title="Badges"
          right={
            <span style={{ font: `500 12px ${T.serif}`, color: theme.ink3, fontStyle: 'italic' }}>
              {earnedTotal} of {total} earned
            </span>
          }
        />
      }
    >
      <PageHeader kicker="Collection" title="Badges" subtitle={`${earnedTotal} of ${total} earned`} />

      <Card
        style={{
          background: accentGrad(accent),
          padding: 32,
          color: '#fff',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
          }}
        />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                font: `600 12px 'Inter Tight'`,
                opacity: 0.85,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span
                style={{
                  font: `900 64px 'Inter Tight'`,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {earnedTotal}
              </span>
              <span style={{ font: `700 24px 'Inter Tight'`, opacity: 0.85 }}>/ {total}</span>
            </div>
            <div style={{ font: `500 14px 'Inter Tight'`, opacity: 0.85, marginTop: 6 }}>
              Halfway to the full set.
            </div>
          </div>
          <StreakIcon variant={streakIcon} size={90} accent={['#ffe19f', '#ffffff']} />
        </div>
      </Card>

      <BadgeGrid title="Streak badges" badges={streakBadges} variant="streak" />
      <BadgeGrid title="Milestones" badges={milestones} variant="emoji" />
      <BadgeGrid title="Moments" badges={moments} variant="emoji-desc" />
    </Page>
  );
}

function BadgeGrid({
  title,
  badges,
  variant,
}: {
  title: string;
  badges: BadgeSimple[];
  variant: 'streak' | 'emoji' | 'emoji-desc';
}) {
  const { theme, accent, streakIcon } = useTheme();
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 14, color: theme.ink }}>
        {title}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            variant === 'emoji-desc' ? 'repeat(auto-fill, minmax(220px, 1fr))' : 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 14,
        }}
      >
        {badges.map((b) => (
          <Card
            key={b.id ?? b.d ?? b.label}
            style={{
              padding: 18,
              textAlign: variant === 'emoji-desc' ? 'left' : 'center',
              opacity: b.earned ? 1 : 0.5,
              filter: b.earned ? 'none' : 'grayscale(0.7)',
              display: 'flex',
              flexDirection: variant === 'emoji-desc' ? 'row' : 'column',
              gap: 12,
              alignItems: 'center',
              background: b.earned ? theme.surface : theme.surfaceAlt,
            }}
          >
            <div
              style={{
                width: variant === 'emoji-desc' ? 56 : '100%',
                aspectRatio: '1',
                maxWidth: variant === 'emoji-desc' ? 56 : 120,
                margin: variant === 'emoji-desc' ? 0 : '0 auto',
                borderRadius: 14,
                background: b.earned ? accentSoftBg(accent) : theme.chip,
                border: b.earned ? `1.5px solid ${accent[1]}33` : `1px solid ${theme.line}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {variant === 'streak' ? (
                <StreakIcon variant={streakIcon} size={44} accent={accent} animated={b.earned} />
              ) : (
                <span style={{ fontSize: 32 }}>{b.icon}</span>
              )}
              {b.earned && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 6,
                    background: accent[1],
                    color: '#fff',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path
                      d="M2 5 L4 7 L8 3"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div
              style={{
                flex: variant === 'emoji-desc' ? 1 : 'none',
                textAlign: variant === 'emoji-desc' ? 'left' : 'center',
              }}
            >
              <div style={{ font: `700 13px 'Inter Tight'`, color: theme.ink }}>{b.label}</div>
              {b.desc && (
                <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>{b.desc}</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
