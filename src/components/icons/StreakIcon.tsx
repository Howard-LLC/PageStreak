'use client';
import { useId as useReactId, type CSSProperties } from 'react';
import { ACCENTS, type Accent, type StreakIconVariant } from '@/lib/design/theme';

interface IconProps {
  size?: number;
  accent?: Accent;
  animated?: boolean;
  style?: CSSProperties;
}

function useId(prefix: string) {
  return prefix + '_' + useReactId().replace(/:/g, '');
}

export function Flame({ size = 28, accent, animated = true, style = {} }: IconProps) {
  const id = useId('fl');
  const [a, b] = accent ?? ACCENTS.fire;
  return (
    <svg
      width={size * 0.78}
      height={size}
      viewBox="0 0 28 36"
      style={{
        display: 'block',
        transformOrigin: 'bottom center',
        animation: animated ? 'ps-flame-dance 2s ease-in-out infinite' : 'none',
        overflow: 'visible',
        ...style,
      }}
    >
      <defs>
        <linearGradient id={id + 'outer'} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.55" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={id + 'inner'} cx="0.5" cy="0.7" r="0.6">
          <stop offset="0" stopColor="#fff5d6" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#ffd58a" stopOpacity="0.4" />
          <stop offset="1" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M14 1
           C 12.6 5.5, 9.5 7.5, 7 11.5
           C 4 16, 3 21, 4.5 26
           C 6 30.5, 9.5 33.5, 14 33.5
           C 18.5 33.5, 22 30.5, 23.5 26
           C 25 21, 24 16, 21 11.5
           C 19 8.5, 17 6.5, 16.5 4
           C 16 5.5, 15.5 6.5, 14.5 7
           C 14 5.5, 14 3, 14 1 Z"
        fill={`url(#${id}outer)`}
      />
      <path
        d="M14 14.5
           C 12 18, 10.5 21, 10.5 24.5
           C 10.5 28.5, 12 31, 14 31
           C 16 31, 17.5 28.5, 17.5 24.5
           C 17.5 21.5, 16 18.5, 14 14.5 Z"
        fill={`url(#${id}inner)`}
      />
    </svg>
  );
}

export function Bookmark({ size = 28, accent, style = {} }: IconProps) {
  const id = useId('bm');
  const [a, b] = accent ?? ACCENTS.fire;
  return (
    <svg width={size} height={size * (40 / 32)} viewBox="0 0 32 40" style={style}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <path d="M6 2 H26 V38 L16 30 L6 38 Z" fill={`url(#${id})`} />
    </svg>
  );
}

export function Spark({ size = 28, accent, animated = true, style = {} }: IconProps) {
  const id = useId('sp');
  const [a, b] = accent ?? ACCENTS.fire;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{
        animation: animated ? 'ps-pulse-glow 2.4s ease-in-out infinite' : 'none',
        ...style,
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <path
        d="M16 3 L18.5 13.5 L29 16 L18.5 18.5 L16 29 L13.5 18.5 L3 16 L13.5 13.5 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

export function Sun({ size = 28, accent, animated = true, style = {} }: IconProps) {
  const id = useId('sn');
  const [a, b] = accent ?? ACCENTS.fire;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{
        animation: animated ? 'ps-spin 22s linear infinite' : 'none',
        ...style,
      }}
    >
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </radialGradient>
      </defs>
      {Array.from({ length: 8 }).map((_, i) => {
        const ang = (i * 45 * Math.PI) / 180;
        const x1 = 16 + Math.cos(ang) * 12;
        const y1 = 16 + Math.sin(ang) * 12;
        const x2 = 16 + Math.cos(ang) * 15;
        const y2 = 16 + Math.sin(ang) * 15;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={a}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="16" cy="16" r="8" fill={`url(#${id})`} />
    </svg>
  );
}

interface StreakIconProps extends IconProps {
  variant?: StreakIconVariant;
}

export function StreakIcon({ variant = 'flame', ...rest }: StreakIconProps) {
  if (variant === 'bookmark') return <Bookmark {...rest} />;
  if (variant === 'spark') return <Spark {...rest} />;
  if (variant === 'sun') return <Sun {...rest} />;
  return <Flame {...rest} />;
}
