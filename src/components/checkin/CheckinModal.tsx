'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Btn, Pill, Kicker } from '@/components/ui/Primitives';

interface Props {
  onClose: () => void;
  onAfterLog?: (totalToday: number) => void;
}

export function CheckinModal({ onClose, onAfterLog }: Props) {
  const { theme } = useTheme();
  const { goal, todayPages, logPages } = useApp();
  const [val, setVal] = useState(Math.max(1, goal - todayPages));
  const scrollRef = useRef<HTMLDivElement>(null);
  const VALUES = useMemo(() => Array.from({ length: 200 }, (_, i) => i + 1), []);
  const ROW_H = 64;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = (val - 1) * ROW_H;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapTimer = useRef<number | null>(null);
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    const idx = Math.round(top / ROW_H);
    const v = VALUES[Math.max(0, Math.min(VALUES.length - 1, idx))];
    if (v && v !== val) setVal(v);
    if (snapTimer.current) window.clearTimeout(snapTimer.current);
    const el = e.currentTarget;
    snapTimer.current = window.setTimeout(() => {
      const i = Math.round(el.scrollTop / ROW_H);
      el.scrollTo({ top: i * ROW_H, behavior: 'smooth' });
    }, 120);
  };

  const submit = async () => {
    await logPages(val);
    onAfterLog?.(todayPages + val);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28,24,20,0.4)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        animation: 'ps-fade-up 0.2s ease',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          maxWidth: '100%',
          background: theme.bg,
          borderRadius: 4,
          padding: '40px 40px 36px',
          animation: 'ps-fade-up 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          border: `1px solid ${theme.line}`,
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Kicker>Daily check-in</Kicker>
            <h2
              style={{
                margin: '12px 0 6px',
                font: `300 36px ${T.display}`,
                fontVariationSettings: '"opsz" 36',
                letterSpacing: '-0.025em',
                color: theme.ink,
                lineHeight: 1,
              }}
            >
              How many pages?
            </h2>
            <div style={{ font: `400 13px ${T.serif}`, fontStyle: 'italic', color: theme.ink3 }}>
              Goal {goal} · logged {todayPages} so far
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              appearance: 'none',
              border: 0,
              background: 'transparent',
              width: 28,
              height: 28,
              color: theme.ink2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ position: 'relative', height: ROW_H * 3, marginTop: 28 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: ROW_H,
              height: ROW_H,
              borderTop: `1px solid ${theme.lineStrong}`,
              borderBottom: `1px solid ${theme.lineStrong}`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: ROW_H,
              background: `linear-gradient(${theme.bg}, transparent)`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: ROW_H,
              background: `linear-gradient(transparent, ${theme.bg})`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="ps-noscroll"
            style={{ height: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}
          >
            <div style={{ paddingTop: ROW_H, paddingBottom: ROW_H }}>
              {VALUES.map((v) => (
                <div
                  key={v}
                  style={{
                    height: ROW_H,
                    scrollSnapAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    font: v === val ? `300 60px ${T.display}` : `400 24px ${T.serif}`,
                    fontVariationSettings: v === val ? '"opsz" 60' : '"opsz" 24',
                    letterSpacing: '-0.025em',
                    color: v === val ? theme.ink : theme.ink3,
                    opacity: v === val ? 1 : 0.4 - Math.min(0.3, Math.abs(v - val) * 0.08),
                    transition: 'font-size 0.18s, color 0.18s',
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          {[5, 10, 20, 30, 50].map((v) => (
            <Pill
              key={v}
              sm
              active={val === v}
              onClick={() => {
                setVal(v);
                if (scrollRef.current) scrollRef.current.scrollTo({ top: (v - 1) * ROW_H, behavior: 'smooth' });
              }}
            >
              {v}
            </Pill>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
          <Btn onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn primary onClick={submit} style={{ flex: 2 }}>
            Log {val} {val === 1 ? 'page' : 'pages'}
          </Btn>
        </div>
      </div>
    </div>
  );
}
