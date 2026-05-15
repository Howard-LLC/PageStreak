'use client';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { accentGrad, T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';

interface BtnProps {
  children: ReactNode;
  primary?: boolean;
  ghost?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  full?: boolean;
  sm?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Btn({ children, primary, onClick, style = {}, full, sm, ghost, icon, type = 'button', disabled }: BtnProps) {
  const { theme } = useTheme();
  const base: CSSProperties = {
    appearance: 'none',
    border: 0,
    borderRadius: 999,
    font: `500 ${sm ? 13 : 14}px ${T.sans}`,
    letterSpacing: '-0.005em',
    padding: sm ? '7px 14px' : '11px 22px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    transition: 'all 0.15s ease',
    width: full ? '100%' : 'auto',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };
  if (primary) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: theme.ink, color: theme.bg, ...style }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = disabled ? '0.5' : '1')}
      >
        {icon}
        {children}
      </button>
    );
  }
  if (ghost) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={{ ...base, background: 'transparent', color: theme.ink, ...style }}
      >
        {icon}
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...base,
        background: 'transparent',
        color: theme.ink,
        border: `1px solid ${theme.lineStrong}`,
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = theme.chip)}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {children}
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padded?: boolean;
  soft?: boolean;
  onClick?: () => void;
}

export function Card({ children, style = {}, padded = true, soft, onClick }: CardProps) {
  const { theme } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        background: soft ? theme.surfaceAlt : theme.surface,
        border: `1px solid ${theme.line}`,
        borderRadius: 8,
        padding: padded ? 22 : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Rule({ label, style = {} }: { label?: string; style?: CSSProperties }) {
  const { theme } = useTheme();
  if (label)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
        <div style={{ flex: 1, height: 1, background: theme.line }} />
        <div
          style={{
            font: `500 10px ${T.sans}`,
            color: theme.ink3,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        <div style={{ flex: 1, height: 1, background: theme.line }} />
      </div>
    );
  return <div style={{ height: 1, background: theme.line, ...style }} />;
}

export function Kicker({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        font: `500 11px ${T.sans}`,
        color: theme.ink2,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface PillProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  sm?: boolean;
}

export function Pill({ children, active, onClick, style = {}, sm }: PillProps) {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none',
        border: `1px solid ${active ? theme.ink : theme.line}`,
        padding: sm ? '4px 10px' : '5px 12px',
        borderRadius: 999,
        font: `500 ${sm ? 12 : 13}px ${T.sans}`,
        background: active ? theme.ink : 'transparent',
        color: active ? theme.bg : theme.ink2,
        transition: 'all 0.15s',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Tag({
  children,
  style = {},
  accent: useAccent,
}: {
  children: ReactNode;
  style?: CSSProperties;
  accent?: boolean;
}) {
  const { theme, accent } = useTheme();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        font: `500 11px ${T.sans}`,
        letterSpacing: '0.02em',
        color: useAccent ? accent[1] : theme.ink2,
        borderBottom: `1px solid ${useAccent ? accent[1] : theme.lineStrong}`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  h = 4,
  style = {},
  gradient = true,
}: {
  value: number;
  max?: number;
  h?: number;
  style?: CSSProperties;
  gradient?: boolean;
}) {
  const { theme, accent } = useTheme();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      style={{
        height: h,
        borderRadius: 0,
        background: theme.chip,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: pct + '%',
          background: gradient ? accentGrad(accent) : theme.ink,
          transition: 'width 0.6s cubic-bezier(0.2,0.7,0.2,1)',
        }}
      />
    </div>
  );
}

export function Divider({ style = {} }: { style?: CSSProperties }) {
  const { theme } = useTheme();
  return <div style={{ height: 1, background: theme.line, ...style }} />;
}

export function DisplayNum({
  value,
  size = 96,
  gradient,
  style = {},
}: {
  value: number | string;
  size?: number;
  gradient?: boolean;
  style?: CSSProperties;
}) {
  const { theme, accent } = useTheme();
  return (
    <span
      style={{
        font: `300 ${size}px ${T.display}`,
        fontVariationSettings: `"opsz" 60`,
        letterSpacing: '-0.04em',
        lineHeight: 0.9,
        color: theme.ink,
        fontVariantNumeric: 'tabular-nums oldstyle-nums',
        ...(gradient && {
          background: accentGrad(accent),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }),
        ...style,
      }}
    >
      {typeof value === 'number' ? value.toLocaleString() : value}
    </span>
  );
}

export function AnimNum({
  value,
  duration = 700,
  style = {},
}: {
  value: number;
  duration?: number;
  style?: CSSProperties;
}) {
  const [v, setV] = useState(value);
  const ref = useRef({ from: value, to: value, t0: 0 });
  useEffect(() => {
    if (value === v) return;
    ref.current = { from: v, to: value, t0: performance.now() };
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - ref.current.t0) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      const cur = ref.current.from + (ref.current.to - ref.current.from) * e;
      setV(Math.round(cur));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, v]);
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{v}</span>;
}
