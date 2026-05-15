'use client';
import { useMemo } from 'react';
import { T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { AnimNum, Btn, Kicker } from '@/components/ui/Primitives';
import { StreakIcon } from '@/components/icons/StreakIcon';

interface Props {
  onClose: () => void;
  isStretch?: boolean;
}

export function CelebrateOverlay({ onClose, isStretch }: Props) {
  const { theme, accent, streakIcon } = useTheme();
  const { streak, todayPages, bestStreak } = useApp();

  const particles = useMemo(() => {
    const total = isStretch ? 60 : 40;
    return Array.from({ length: total }, (_, i) => {
      const ang = (Math.PI * 2 * i) / total + Math.random() * 0.2;
      const dist = 180 + Math.random() * 240;
      return {
        i,
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist - 40,
        delay: Math.random() * 0.3,
        size: 4 + Math.random() * 6,
        color: [accent[0], accent[1], '#ffe19f', '#ffb966'][i % 4],
      };
    });
  }, [isStretch, accent]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'ps-fade-up 0.5s ease',
        zIndex: 70,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: '42%', pointerEvents: 'none' }}>
        {particles.map((p) => (
          <div
            key={p.i}
            style={
              {
                position: 'absolute',
                left: 0,
                top: 0,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: p.color,
                ['--dx' as string]: p.dx + 'px',
                ['--dy' as string]: p.dy + 'px',
                animation: `ps-firework 2.2s cubic-bezier(0.2, 0.8, 0.3, 1) ${p.delay}s both`,
                boxShadow: `0 0 8px ${p.color}80`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 760, padding: 32 }}>
        <div style={{ animation: 'ps-rise 0.7s cubic-bezier(0.2, 1, 0.4, 1.2) both' }}>
          <StreakIcon variant={streakIcon} size={140} accent={accent} />
        </div>

        <Kicker style={{ marginTop: 36, animation: 'ps-fade-up 0.5s ease 0.25s both' }}>
          {isStretch ? 'Stretch goal — a perfect day' : 'Day complete'}
        </Kicker>

        <h1
          style={{
            margin: '24px 0 16px',
            font: `300 144px ${T.display}`,
            fontVariationSettings: '"opsz" 72',
            letterSpacing: '-0.045em',
            lineHeight: 0.9,
            color: theme.ink,
            animation: 'ps-fade-up 0.6s ease 0.3s both',
          }}
        >
          <AnimNum value={streak} />{' '}
          <span style={{ font: `300 56px ${T.display}`, fontStyle: 'italic', color: theme.ink2 }}>days</span>
        </h1>

        <div
          style={{
            font: `400 20px ${T.serif}`,
            fontStyle: 'italic',
            color: theme.ink2,
            animation: 'ps-fade-up 0.6s ease 0.4s both',
            marginBottom: 48,
          }}
        >
          {todayPages} pages today. Best ever: {bestStreak} days.
        </div>

        {isStretch && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 18px',
              border: `1px solid ${theme.lineStrong}`,
              animation: 'ps-badge-pop 0.7s cubic-bezier(0.2, 1.5, 0.4, 1) 0.6s both',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: theme.ink,
                color: theme.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: `400 18px ${T.display}`,
              }}
            >
              ✦
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ font: `500 13px ${T.serif}`, color: theme.ink }}>New badge — Perfect day</div>
              <div style={{ font: `400 11px ${T.sans}`, color: theme.ink3, marginTop: 1, letterSpacing: '0.04em' }}>
                30 or more pages in a single day
              </div>
            </div>
          </div>
        )}

        <div style={{ animation: 'ps-fade-up 0.5s ease 0.55s both' }}>
          <Btn primary onClick={onClose}>
            Continue reading
          </Btn>
        </div>
      </div>
    </div>
  );
}
