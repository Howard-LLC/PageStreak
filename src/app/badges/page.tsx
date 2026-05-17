'use client';
import { accentGrad, T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Page, PageHeader, TopBar } from '@/components/layout/Page';
import { Card } from '@/components/ui/Primitives';
import { BadgeIcon, type BadgeId } from '@/components/icons/BadgeIcon';

interface Badge {
  id: BadgeId;
  label: string;
  desc?: string;
  earned: boolean;
  progress?: { current: number; goal: number; unit: string };
}

export default function BadgesPage() {
  const { theme, accent } = useTheme();
  const { streak, bestStreak, books, logWithToday } = useApp();

  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const totalPages = Object.values(logWithToday).reduce((s, v) => s + v, 0);
  const peakStreak = Math.max(streak, bestStreak);

  const streakBadges: Badge[] = [
    { id: 'spark',        label: '1 day',     earned: peakStreak >= 1,   progress: { current: peakStreak, goal: 1,   unit: 'days' } },
    { id: 'ember',        label: '3 days',    earned: peakStreak >= 3,   progress: { current: peakStreak, goal: 3,   unit: 'days' } },
    { id: 'flame',        label: '7 days',    earned: peakStreak >= 7,   progress: { current: peakStreak, goal: 7,   unit: 'days' } },
    { id: 'flameDouble',  label: '2 weeks',   earned: peakStreak >= 14,  progress: { current: peakStreak, goal: 14,  unit: 'days' } },
    { id: 'bonfire',      label: '30 days',   earned: peakStreak >= 30,  progress: { current: peakStreak, goal: 30,  unit: 'days' } },
    { id: 'torch',        label: '50 days',   earned: peakStreak >= 50,  progress: { current: peakStreak, goal: 50,  unit: 'days' } },
    { id: 'laurel',       label: '100 days',  earned: peakStreak >= 100, progress: { current: peakStreak, goal: 100, unit: 'days' } },
    { id: 'sun',          label: '1 year',    earned: peakStreak >= 365, progress: { current: peakStreak, goal: 365, unit: 'days' } },
  ];

  const pageBadges: Badge[] = [
    { id: 'openBook',  label: '100 pages',  earned: totalPages >= 100,    progress: { current: totalPages, goal: 100,    unit: 'pages' } },
    { id: 'bookStack', label: '1K pages',   earned: totalPages >= 1000,   progress: { current: totalPages, goal: 1000,   unit: 'pages' } },
    { id: 'tallStack', label: '10K pages',  earned: totalPages >= 10000,  progress: { current: totalPages, goal: 10000,  unit: 'pages' } },
    { id: 'shelf',     label: '100K pages', earned: totalPages >= 100000, progress: { current: totalPages, goal: 100000, unit: 'pages' } },
  ];

  const bookBadges: Badge[] = [
    { id: 'medal',   label: 'First book', earned: finishedCount >= 1,   progress: { current: finishedCount, goal: 1,   unit: 'books' } },
    { id: 'ribbon',  label: '10 books',   earned: finishedCount >= 10,  progress: { current: finishedCount, goal: 10,  unit: 'books' } },
    { id: 'trophy',  label: '25 books',   earned: finishedCount >= 25,  progress: { current: finishedCount, goal: 25,  unit: 'books' } },
    { id: 'crown',   label: '100 books',  earned: finishedCount >= 100, progress: { current: finishedCount, goal: 100, unit: 'books' } },
  ];

  const moments: Badge[] = [
    { id: 'weekStar',  label: 'Perfect week',  desc: '7/7 days in a single week',     earned: false },
    { id: 'monthGrid', label: 'Perfect month', desc: 'Every day of a calendar month', earned: false },
    { id: 'moon',      label: 'Night owl',     desc: '50 sessions logged after 10pm', earned: false },
    { id: 'sunrise',   label: 'Early bird',    desc: '20 sessions logged before 7am', earned: false },
  ];

  const all = [...streakBadges, ...pageBadges, ...bookBadges, ...moments];
  const total = all.length;
  const earnedTotal = all.filter((b) => b.earned).length;

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
          marginBottom: 36,
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
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div
              style={{
                font: `600 12px ${T.sans}`,
                opacity: 0.85,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ font: `400 64px ${T.display}`, fontVariationSettings: '"opsz" 48', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {earnedTotal}
              </span>
              <span style={{ font: `400 italic 24px ${T.display}`, opacity: 0.85 }}>/ {total}</span>
            </div>
            <div style={{ font: `400 italic 15px ${T.serif}`, opacity: 0.9, marginTop: 10, maxWidth: 360 }}>
              {earnedTotal === 0
                ? 'Log your first session to claim your first badge.'
                : earnedTotal < total / 3
                ? 'A few earned. Keep the streak going.'
                : earnedTotal < (2 * total) / 3
                ? "Most of the way there. The rare ones are the next stretch."
                : 'Closing in on the full set.'}
            </div>
          </div>
          <div style={{ flex: '0 0 auto', opacity: 0.95 }}>
            <BadgeIcon id="laurel" earned accent={['#ffe19f', '#ffffff']} muted="#ffffff" size={96} />
          </div>
        </div>
      </Card>

      <BadgeGrid title="Streak" subtitle="Built by reading day after day." badges={streakBadges} />
      <BadgeGrid title="Pages read" subtitle="Pages accumulate quickly. So does this." badges={pageBadges} />
      <BadgeGrid title="Books finished" subtitle="Every cover closed is an entry here." badges={bookBadges} />
      <BadgeGrid title="Moments" subtitle="Earned by reading at particular times." badges={moments} />
    </Page>
  );
}

function BadgeGrid({
  title,
  subtitle,
  badges,
}: {
  title: string;
  subtitle: string;
  badges: Badge[];
}) {
  const { theme, accent } = useTheme();
  return (
    <section style={{ marginBottom: 40 }}>
      <header style={{ marginBottom: 18 }}>
        <h2
          style={{
            margin: 0,
            font: `400 26px ${T.display}`,
            fontVariationSettings: '"opsz" 36',
            letterSpacing: '-0.02em',
            color: theme.ink,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            font: `400 14px ${T.serif}`,
            fontStyle: 'italic',
            color: theme.ink3,
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 14,
        }}
      >
        {badges.map((b) => (
          <BadgeTile key={b.id} badge={b} accent={accent} theme={theme} />
        ))}
      </div>
    </section>
  );
}

function BadgeTile({
  badge,
  accent,
  theme,
}: {
  badge: Badge;
  accent: ReturnType<typeof useTheme>['accent'];
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  const pct =
    badge.progress && !badge.earned
      ? Math.min(100, Math.round((badge.progress.current / badge.progress.goal) * 100))
      : null;

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 14,
        background: badge.earned ? theme.surface : theme.surfaceAlt,
        border: badge.earned ? `1px solid ${accent[1]}55` : `1px solid ${theme.line}`,
        boxShadow: badge.earned ? `0 6px 18px ${accent[1]}1a` : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: badge.earned
            ? `radial-gradient(circle at 50% 35%, ${accent[0]}22 0%, transparent 70%)`
            : theme.chip,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        <BadgeIcon id={badge.id} earned={badge.earned} accent={accent} muted={theme.ink3} size={56} />
      </div>

      <div style={{ minHeight: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            font: `600 14px ${T.sans}`,
            color: theme.ink,
            letterSpacing: '-0.005em',
            lineHeight: 1.2,
          }}
        >
          {badge.label}
        </div>
        {badge.desc && (
          <div
            style={{
              font: `400 12px ${T.serif}`,
              fontStyle: 'italic',
              color: theme.ink3,
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {badge.desc}
          </div>
        )}
        {!badge.earned && pct !== null && (
          <div style={{ marginTop: 6, width: '100%' }}>
            <div
              style={{
                font: `500 11px ${T.sans}`,
                color: theme.ink3,
                letterSpacing: '0.06em',
              }}
            >
              {badge.progress!.current.toLocaleString()} / {badge.progress!.goal.toLocaleString()}{' '}
              {badge.progress!.unit}
            </div>
            <div style={{ marginTop: 6, width: '100%', height: 3, background: theme.line, borderRadius: 2 }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: accent[1],
                  borderRadius: 2,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {badge.earned && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: accent[1],
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 5 L4 7 L8 3" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
