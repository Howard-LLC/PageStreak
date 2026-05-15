'use client';
import { useRef, type CSSProperties } from 'react';
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
  const id = useRef('lg_' + Math.random().toString(36).slice(2, 9)).current;
  const stroke = Math.max(1.1, size * 0.05);
  const r = size * 0.24;
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
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
      )}
      <rect
        x={stroke * 0.5}
        y={stroke * 0.5}
        width={64 - stroke}
        height={64 - stroke}
        rx={r * (64 / size)}
        fill="none"
        stroke={mono ? ink : `url(#${id})`}
        strokeWidth={stroke * (64 / size)}
      />
      <g fill={mono ? ink : `url(#${id})`}>
        <path
          d="M 19 14 L 33 14 L 33 18 L 30 18 L 30 50 L 35 50 L 35 54 L 19 54 L 19 50 L 24 50 L 24 18 L 19 18 Z"
        />
        <path
          d="M 30 14 L 40 14 C 50 14, 50 34, 40 34 L 30 34 L 30 30 L 39 30 C 44 30, 44 18, 39 18 L 30 18 Z"
        />
      </g>
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
