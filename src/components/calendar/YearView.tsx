'use client';
import { useMemo } from 'react';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { fmt } from '@/lib/data/streak';
import { Card } from '@/components/ui/Primitives';

export function YearView({ year }: { year: number }) {
  const { theme, accent } = useTheme();
  const { log, todayKey, todayPages } = useApp();
  const cells = useMemo(() => {
    const start = new Date(year, 0, 1);
    const offset = start.getDay();
    const cols = 53;
    const grid: ({ pages: number; d: Date; k: string } | null)[][] = [];
    for (let c = 0; c < cols; c++) {
      const col: ({ pages: number; d: Date; k: string } | null)[] = [];
      for (let r = 0; r < 7; r++) {
        const dayN = c * 7 + r - offset;
        if (dayN < 0) {
          col.push(null);
          continue;
        }
        const d = new Date(year, 0, 1);
        d.setDate(dayN + 1);
        if (d.getFullYear() !== year) {
          col.push(null);
          continue;
        }
        const k = fmt(d);
        const pages = k === todayKey ? todayPages : log[k] || 0;
        col.push({ pages, d, k });
      }
      grid.push(col);
    }
    return grid;
  }, [year, log, todayPages, todayKey]);

  const colorFor = (p: number) => {
    if (!p || p === 0) return theme.chip;
    if (p < 10) return `${accent[0]}40`;
    if (p < 20) return `${accent[0]}80`;
    if (p < 30) return accent[0];
    return accent[1];
  };

  const totals = useMemo(() => {
    let pages = 0;
    let days = 0;
    cells.flat().forEach((c) => {
      if (c && c.pages > 0) {
        pages += c.pages;
        days++;
      }
    });
    return { pages, days };
  }, [cells]);

  return (
    <Card style={{ padding: 28 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ font: `800 22px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>{year}</div>
          <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>
            {totals.days} read days · {totals.pages.toLocaleString()} pages
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3 }}>less</span>
          {[theme.chip, `${accent[0]}40`, `${accent[0]}80`, accent[0], accent[1]].map((c) => (
            <div key={c} style={{ width: 12, height: 12, background: c, borderRadius: 3 }} />
          ))}
          <span style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3 }}>more</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {cells.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            {col.map((c, ri) => (
              <div
                key={ri}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 3,
                  background: c ? colorFor(c.pages) : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          font: `500 11px 'Inter Tight'`,
          color: theme.ink3,
          marginTop: 10,
        }}
      >
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </Card>
  );
}
