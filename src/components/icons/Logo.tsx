'use client';
import { useId, type CSSProperties } from 'react';
import { ACCENTS, T, type Accent } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';

interface LogoProps {
  size?: number;
  mono?: boolean;
  accent?: Accent;
  style?: CSSProperties;
}

export function Logo({ size = 28, mono = true, accent, style = {} }: LogoProps) {
  const { theme } = useTheme();
  const [a, b] = accent ?? ACCENTS.fire;
  const ink = mono ? (style.color as string | undefined) ?? theme.ink : a;
  const id = 'lg_' + useId().replace(/:/g, '');
  const paint = mono ? ink : `url(#${id})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ display: 'inline-block', overflow: 'visible', ...style }}
      aria-label="Page Streak"
    >
      {!mono && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M 19 6 H 31 A 14 14 0 0 1 31 34 V 58 H 19 Z M 31 15 V 25 A 5 5 0 0 0 31 15 Z"
        fillRule="evenodd"
        fill={paint}
      />
    </svg>
  );
}

export function Wordmark({
  size = 18,
  mono = true,
  accent,
  style = {},
}: LogoProps) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
      <Logo size={size + 10} mono={mono} accent={accent} />
      <div
        style={{
          font: `500 ${size}px ${T.display}`,
          fontVariationSettings: `"opsz" 24`,
          letterSpacing: '-0.02em',
          color: theme.ink,
          lineHeight: 1,
        }}
      >
        Page Streak
      </div>
    </div>
  );
}
