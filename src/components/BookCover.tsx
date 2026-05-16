'use client';
import type { CSSProperties } from 'react';
import { T } from '@/lib/design/theme';
import type { Book } from '@/lib/data/types';

const COVER_PALETTES: [string, string][] = [
  ['#1c2541', '#d8d5cf'],
  ['#2a1f10', '#d4a445'],
  ['#5e2129', '#e9b8a3'],
  ['#1e3a2b', '#c8d2a8'],
  ['#2b1e3a', '#dfc8e8'],
  ['#3a1e1e', '#dba39e'],
  ['#1a3a3a', '#9bc6c4'],
  ['#1a1814', '#e8d09b'],
];

const COVER_LAYOUTS = [
  'title-top',
  'title-mid',
  'title-bottom',
  'title-mid',
  'rules',
  'title-bottom',
  'title-top',
  'rules',
] as const;

type CoverLayout = (typeof COVER_LAYOUTS)[number];

interface BookCoverProps {
  book?: Partial<Book>;
  w?: number | string;
  h?: number | string;
  style?: CSSProperties;
  showBadge?: string | null;
}

export function BookCover({ book, w, h, style = {}, showBadge }: BookCoverProps) {
  if (book?.cover_url) {
    return (
      <div
        style={{
          width: w,
          height: h,
          position: 'relative',
          background: '#1a1814',
          boxShadow: `0 0 0 0.5px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1), 0 12px 24px rgba(0,0,0,0.18), inset 1px 0 0 rgba(255,255,255,0.08), inset -2px 0 4px rgba(0,0,0,0.25)`,
          overflow: 'hidden',
          ...style,
        }}
      >
        <img
          src={book.cover_url}
          alt={book.title ?? ''}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5%',
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        {showBadge && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: (typeof h === 'number' ? h : 120) * 0.06,
              padding: '4px 10px',
              background: '#fff',
              color: '#1a1814',
              font: `600 10px ${T.sans}`,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            {showBadge}
          </div>
        )}
      </div>
    );
  }

  const palette =
    book?.palette ??
    COVER_PALETTES[Math.abs(book?.id ?? 0) % COVER_PALETTES.length];
  const [c1, c2] = palette;
  const layout: CoverLayout =
    (book as { coverLayout?: CoverLayout } | undefined)?.coverLayout ??
    COVER_LAYOUTS[(book?.id ?? 0) % COVER_LAYOUTS.length];
  const numericH = typeof h === 'number' ? h : 120;
  const numericW = typeof w === 'number' ? w : numericH * 0.68;
  const titleSize = Math.max(8, numericH * 0.082);
  const authorSize = Math.max(7, numericH * 0.04);
  const rulesSize = Math.max(6, numericH * 0.035);

  const title = book?.title ?? 'BOOK';
  const words = title.split(' ');
  const titleLines =
    words.length > 4
      ? [words.slice(0, 2).join(' '), words.slice(2, 4).join(' '), words.slice(4).join(' ')]
      : words.length > 2
      ? [words.slice(0, 2).join(' '), words.slice(2).join(' ')]
      : [title];

  const author = (book?.author ?? '').toUpperCase();

  return (
    <div
      style={{
        width: w,
        height: h,
        position: 'relative',
        background: c1,
        boxShadow: `0 0 0 0.5px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1), 0 12px 24px rgba(0,0,0,0.18), inset 1px 0 0 rgba(255,255,255,0.08), inset -2px 0 4px rgba(0,0,0,0.25)`,
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
          width: '5%',
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '1.5%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />

      {layout === 'rules' && (
        <>
          <div style={{ position: 'absolute', top: '15%', left: '10%', right: '10%', height: 1, background: c2, opacity: 0.7 }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '10%', right: '10%', height: 1, background: c2, opacity: 0.7 }} />
          <div
            style={{
              position: 'absolute',
              top: '15%',
              bottom: '15%',
              left: '10%',
              right: '10%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: numericH * 0.025,
            }}
          >
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  font: `600 ${titleSize}px ${T.display}`,
                  fontVariationSettings: '"opsz" 36',
                  color: c2,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.05,
                  textAlign: 'center',
                }}
              >
                {line}
              </div>
            ))}
            <div style={{ width: numericW * 0.18, height: 1, background: c2, opacity: 0.5, margin: `${numericH * 0.03}px 0` }} />
            <div style={{ font: `500 ${authorSize}px ${T.sans}`, color: c2, letterSpacing: '0.16em', opacity: 0.85 }}>{author}</div>
          </div>
        </>
      )}

      {layout === 'title-top' && (
        <>
          <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%' }}>
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  font: `700 ${titleSize}px ${T.display}`,
                  fontVariationSettings: '"opsz" 36',
                  color: c2,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.05,
                }}
              >
                {line}
              </div>
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              left: '10%',
              right: '10%',
              font: `500 ${authorSize}px ${T.sans}`,
              color: c2,
              letterSpacing: '0.14em',
              opacity: 0.85,
            }}
          >
            {author}
          </div>
        </>
      )}

      {layout === 'title-mid' && (
        <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', transform: 'translateY(-50%)' }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                font: `400 ${titleSize}px ${T.display}`,
                fontVariationSettings: '"opsz" 36',
                fontStyle: 'italic',
                color: c2,
                lineHeight: 1.05,
              }}
            >
              {line}
            </div>
          ))}
          <div style={{ width: numericW * 0.22, height: 1, background: c2, opacity: 0.5, margin: `${numericH * 0.05}px 0 ${numericH * 0.02}px` }} />
          <div style={{ font: `500 ${authorSize}px ${T.sans}`, color: c2, letterSpacing: '0.14em', opacity: 0.85 }}>{author}</div>
        </div>
      )}

      {layout === 'title-bottom' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              font: `500 ${authorSize}px ${T.sans}`,
              color: c2,
              letterSpacing: '0.16em',
              opacity: 0.85,
            }}
          >
            {author}
          </div>
          <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%' }}>
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  font: `800 ${titleSize}px ${T.display}`,
                  fontVariationSettings: '"opsz" 60',
                  color: c2,
                  letterSpacing: '-0.025em',
                  lineHeight: 0.95,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </>
      )}

      {showBadge && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: numericH * 0.06,
            padding: `${numericH * 0.012}px ${numericW * 0.08}px`,
            background: c2,
            color: c1,
            font: `600 ${rulesSize}px ${T.sans}`,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {showBadge}
        </div>
      )}
    </div>
  );
}
