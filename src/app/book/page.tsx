'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { accentGrad, mix, T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { relativeDate } from '@/lib/data/streak';
import { Page } from '@/components/layout/Page';
import { Btn, Card, Divider, ProgressBar, Tag } from '@/components/ui/Primitives';
import { BookCover } from '@/components/BookCover';
import { CheckinModal } from '@/components/checkin/CheckinModal';

export default function BookDetailPage() {
  return (
    <Suspense>
      <BookDetail />
    </Suspense>
  );
}

function BookDetail() {
  const { theme, accent } = useTheme();
  const { books, setCurrentBookId, updateBook, todayKey } = useApp();
  const router = useRouter();
  const sp = useSearchParams();
  const id = Number(sp?.get('id'));
  const book = useMemo(() => books.find((b) => b.id === id), [books, id]);
  const [showCheckin, setShowCheckin] = useState(false);
  const sessions = useMemo(() => [5, 8, 12, 0, 14, 9, 11, 18, 22, 15, 12, 16, 9, 14, 0, 18, 22, 15, 11, 9, 16, 18, 12, 8], []);

  useEffect(() => {
    if (book) void setCurrentBookId(book.id);
  }, [book, setCurrentBookId]);

  if (!book) {
    return (
      <Page>
        <div style={{ color: theme.ink3, padding: 40 }}>Book not found.</div>
      </Page>
    );
  }

  const pct = Math.round(((book.current_page ?? 0) / book.pages) * 100);

  return (
    <>
      <div
        style={{
          background: `linear-gradient(180deg, ${book.palette[0]}, ${mix(book.palette[0], theme.bg, 0.6)})`,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '32px 32px 56px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 36,
            alignItems: 'flex-end',
          }}
        >
          <BookCover
            book={book}
            w={200}
            h={280}
            style={{ flex: '0 0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
          />
          <div>
            <button
              onClick={() => router.push('/library')}
              style={{
                appearance: 'none',
                border: 0,
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 8,
                font: `600 12px 'Inter Tight'`,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              ← Library
            </button>
            <div
              style={{
                font: `900 56px 'Inter Tight'`,
                letterSpacing: '-0.035em',
                lineHeight: 1,
                marginTop: 18,
              }}
            >
              {book.title}
            </div>
            <div style={{ font: `500 22px 'Inter Tight'`, opacity: 0.85, marginTop: 6 }}>by {book.author}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Tag style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', font: `600 12px 'Inter Tight'` }}>
                {book.status === 'reading' ? 'Currently reading' : book.status === 'finished' ? `★ ${book.rating ?? 0}/5` : 'To read'}
              </Tag>
              <Tag style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
                {book.pages} pages
              </Tag>
              <Tag style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
                {book.genre ?? 'Non-fiction'}
              </Tag>
              {book.started && (
                <Tag style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
                  started {relativeDate(book.started)}
                </Tag>
              )}
              {book.finished && (
                <Tag style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
                  finished {relativeDate(book.finished)}
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      <Page>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, marginTop: -36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {book.status === 'reading' && (
              <Card style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div
                      style={{
                        font: `600 11px 'Inter Tight'`,
                        color: theme.ink3,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Your progress
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                      <span
                        style={{
                          font: `900 48px 'Inter Tight'`,
                          letterSpacing: '-0.035em',
                          lineHeight: 1,
                          background: accentGrad(accent),
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {pct}%
                      </span>
                      <span style={{ font: `600 16px 'Inter Tight'`, color: theme.ink2 }}>
                        p. {book.current_page ?? 0} of {book.pages}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        font: `600 11px 'Inter Tight'`,
                        color: theme.ink3,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      At this pace
                    </div>
                    <div style={{ font: `800 18px 'Inter Tight'`, marginTop: 4, color: theme.ink }}>
                      {Math.ceil((book.pages - (book.current_page ?? 0)) / 20)} more days
                    </div>
                    <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3, marginTop: 1 }}>
                      at 20pp/day
                    </div>
                  </div>
                </div>
                <ProgressBar value={book.current_page ?? 0} max={book.pages} h={10} style={{ marginTop: 18 }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                  <Btn primary onClick={() => setShowCheckin(true)}>
                    Log pages
                  </Btn>
                  <Btn
                    onClick={() =>
                      void updateBook(book.id, { status: 'finished', finished: todayKey, rating: 4 })
                    }
                  >
                    Mark finished
                  </Btn>
                  <Btn onClick={() => void updateBook(book.id, { status: 'paused' })}>Pause reading</Btn>
                </div>
              </Card>
            )}

            <Card style={{ padding: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    font: `600 11px 'Inter Tight'`,
                    color: theme.ink3,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Reading cadence
                </div>
                <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink2 }}>
                  {sessions.filter((s) => s > 0).length} sessions · avg{' '}
                  {Math.round(sessions.reduce((a, b) => a + b, 0) / sessions.filter((s) => s > 0).length)} pp
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
                {sessions.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: Math.max(2, v * 3),
                      background: v ? accentGrad(accent) : theme.chip,
                      borderRadius: '4px 4px 1px 1px',
                    }}
                  />
                ))}
              </div>
            </Card>

            <Card style={{ padding: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    font: `600 11px 'Inter Tight'`,
                    color: theme.ink3,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Notes & highlights
                </div>
                <button
                  style={{
                    appearance: 'none',
                    border: 0,
                    background: 'transparent',
                    color: accent[1],
                    font: `600 12px 'Inter Tight'`,
                    cursor: 'pointer',
                  }}
                >
                  ＋ Add
                </button>
              </div>
              <div
                style={{
                  padding: 16,
                  borderLeft: `3px solid ${accent[1]}`,
                  background: theme.surfaceAlt,
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <div
                  style={{
                    font: `500 15px 'Inter Tight'`,
                    color: theme.ink,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;The ability to perform deep work is becoming increasingly rare at the same time it&rsquo;s
                  becoming increasingly valuable.&rdquo;
                </div>
                <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink3, marginTop: 6 }}>
                  p. 14 · 2 weeks ago
                </div>
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                About this book
              </div>
              <div
                style={{
                  font: `500 14px 'Inter Tight'`,
                  color: theme.ink,
                  lineHeight: 1.55,
                  marginTop: 8,
                }}
              >
                A rules-based approach to producing valuable, cognitively demanding work in an
                increasingly distracted economy.
              </div>
              <Divider style={{ margin: '14px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, font: `500 13px ${T.sans}` }}>
                <Row k="Author" v={book.author} />
                <Row k="Genre" v={book.genre ?? 'Non-fiction'} />
                <Row k="Pages" v={book.pages} />
                <Row k="Source" v={book.added_by ?? 'Manual add'} />
              </div>
            </Card>
            <Card>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Up next
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {books
                  .filter((b) => b.status === 'toread')
                  .slice(0, 3)
                  .map((b) => (
                    <div
                      key={b.id}
                      onClick={async () => {
                        await setCurrentBookId(b.id);
                        router.push(`/book?id=${b.id}`);
                      }}
                      style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}
                    >
                      <BookCover book={b} w={32} h={44} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: `700 12px 'Inter Tight'`, lineHeight: 1.2, color: theme.ink }}>
                          {b.title}
                        </div>
                        <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3 }}>{b.author}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </Page>
      {showCheckin && <CheckinModal onClose={() => setShowCheckin(false)} />}
    </>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: theme.ink3 }}>{k}</span>
      <span style={{ color: theme.ink, fontWeight: 600 }}>{v}</span>
    </div>
  );
}
