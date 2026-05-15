'use client';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { Kicker } from '@/components/ui/Primitives';

interface PageProps {
  children: ReactNode;
  narrow?: boolean;
  wide?: boolean;
  style?: CSSProperties;
  topBar?: ReactNode;
}

export function Page({ children, narrow, wide, style = {}, topBar }: PageProps) {
  return (
    <>
      {topBar}
      <div
        style={{
          maxWidth: narrow ? 720 : wide ? 1200 : 940,
          margin: '0 auto',
          padding: '28px 40px 60px',
          ...style,
        }}
      >
        {children}
      </div>
    </>
  );
}

interface SubTab {
  id: string;
  label: string;
}

interface TopBarProps {
  title: string;
  chevron?: boolean;
  subtabs?: SubTab[];
  activeSubtab?: string;
  onSubtab?: (id: string) => void;
  right?: ReactNode;
  sticky?: boolean;
}

export function TopBar({ title, chevron, subtabs, activeSubtab, onSubtab, right, sticky = true }: TopBarProps) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 15,
        background: theme.bg,
        borderBottom: `1px solid ${theme.line}`,
        padding: '0 40px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          font: `500 16px ${T.serif}`,
          fontVariationSettings: '"opsz" 18',
          color: theme.ink,
          letterSpacing: '-0.015em',
          cursor: chevron ? 'pointer' : 'default',
        }}
      >
        <span>{title}</span>
        {chevron && (
          <svg width="11" height="11" viewBox="0 0 12 12" style={{ color: theme.ink3 }}>
            <path d="M3 5 L6 8 L9 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {subtabs && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: '100%' }}>
          {subtabs.map((t) => {
            const active = t.id === activeSubtab;
            return (
              <button
                key={t.id}
                onClick={() => onSubtab?.(t.id)}
                style={{
                  appearance: 'none',
                  border: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                  height: '100%',
                  position: 'relative',
                  font: `500 11px ${T.sans}`,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: active ? theme.ink : theme.ink3,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s',
                }}
              >
                {t.label}
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -1,
                      height: 2,
                      background: theme.ink,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>{right}</div>}
    </div>
  );
}

export function TopBarBtn({
  icon,
  children,
  onClick,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none',
        border: 0,
        background: 'transparent',
        padding: '6px 8px',
        borderRadius: 6,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: `500 13px ${T.serif}`,
        color: theme.ink2,
        transition: 'color 0.12s, background 0.12s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = theme.ink;
        e.currentTarget.style.background = theme.chip;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = theme.ink2;
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

interface PageHeaderProps {
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  large?: boolean;
}

export function PageHeader({ kicker, title, subtitle, right, large = true }: PageHeaderProps) {
  const { theme } = useTheme();
  return (
    <header style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {kicker && <Kicker style={{ marginBottom: 10 }}>{kicker}</Kicker>}
          <h1
            style={{
              margin: 0,
              font: `${large ? 300 : 400} ${large ? 56 : 38}px ${T.display}`,
              fontVariationSettings: `"opsz" ${large ? 60 : 36}`,
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              color: theme.ink,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <div
              style={{
                font: `400 16px ${T.serif}`,
                fontStyle: 'italic',
                color: theme.ink2,
                marginTop: 12,
                maxWidth: 540,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {right && <div style={{ flex: '0 0 auto' }}>{right}</div>}
      </div>
    </header>
  );
}
