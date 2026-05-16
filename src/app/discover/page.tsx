'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { accentGrad, accentSoftBg, type Accent } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { type AIPick } from '@/lib/data/seedBooks';
import { getSupabase } from '@/lib/supabase/client';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Btn, Card, Pill, Tag } from '@/components/ui/Primitives';
import { BookCover } from '@/components/BookCover';
import { Spark } from '@/components/icons/StreakIcon';

interface DragState {
  x: number;
  y: number;
  dragging: boolean;
}

const PICK_PALETTES: Accent[] = [
  ['#3a1e1e', '#c9846d'],
  ['#1c2541', '#5bc0be'],
  ['#2b1e3a', '#dfc8e8'],
  ['#1a3a3a', '#9bc6c4'],
  ['#3a2e1f', '#e8b339'],
  ['#1f1c3a', '#7d83c4'],
  ['#5e2129', '#e9b8a3'],
];

const ALL_GENRES = [
  'Sci-fi',
  'Self-help',
  'Business',
  'Romance',
  'History',
  'Memoir',
  'Mystery',
  'Literary',
  'Non-fiction',
  'Science',
  'Productivity',
  'Essays',
];

export default function DiscoverPage() {
  const { theme, accent } = useTheme();
  const { addBook, todayKey, books, currentBook } = useApp();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [picks, setPicks] = useState<AIPick[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState>({ x: 0, y: 0, dragging: false });
  const [history, setHistory] = useState<{ book: AIPick; action: 'save' | 'skip' }[]>([]);
  const [genres, setGenres] = useState<string[]>(['Non-fiction']);
  const [avoid, setAvoid] = useState<string[]>(['Atomic Habits']);
  const [prompt, setPrompt] = useState('');
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const fetchPicks = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    const sb = getSupabase();
    const finished = books
      .filter((b) => b.status === 'finished')
      .map((b) => ({ title: b.title, author: b.author, genre: b.genre, rating: b.rating ?? null }));
    const queued = books
      .filter((b) => b.status === 'toread' || b.status === 'reading' || b.status === 'paused')
      .map((b) => ({ title: b.title, author: b.author, genre: b.genre }));
    const current = currentBook
      ? { title: currentBook.title, author: currentBook.author, genre: currentBook.genre }
      : null;
    const { data, error } = await sb.functions.invoke<{ picks: Omit<AIPick, 'id' | 'palette'>[] }>(
      'discover-picks',
      { body: { genres, avoid, prompt, finished, queued, current } },
    );
    if (error || !data?.picks) {
      setFetchError(error?.message ?? 'Could not fetch picks. Try again.');
      setLoading(false);
      return;
    }
    const stamp = Date.now();
    const withMeta: AIPick[] = data.picks.map((p, i) => ({
      ...p,
      id: stamp + i,
      palette: PICK_PALETTES[i % PICK_PALETTES.length],
    }));
    setPicks(withMeta);
    setHistory([]);
    setLoading(false);
  }, [books, currentBook, genres, avoid, prompt]);

  // Fetch picks once the user's library has loaded.
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    if (books.length === 0 && !currentBook) return; // wait for app state
    hasFetchedRef.current = true;
    void fetchPicks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books.length, currentBook]);

  const topPick = picks[0];

  const swipe = async (action: 'save' | 'skip') => {
    if (!topPick) return;
    setHistory((h) => [...h, { book: topPick, action }]);
    if (action === 'save') {
      await addBook({
        title: topPick.title,
        author: topPick.author,
        pages: topPick.pages,
        palette: topPick.palette,
        genre: topPick.genre,
        status: 'toread',
        added_by: 'ai',
        added_at: new Date().toISOString(),
        reason: topPick.why,
      });
    }
    setPicks((p) => p.slice(1));
    setDrag({ x: 0, y: 0, dragging: false });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.dragging || !startRef.current) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, dragging: true });
  };
  const onPointerUp = () => {
    if (!drag.dragging) return;
    if (drag.x > 100) void swipe('save');
    else if (drag.x < -100) void swipe('skip');
    else setDrag({ x: 0, y: 0, dragging: false });
    startRef.current = null;
  };

  const regenerate = () => {
    setIntakeOpen(false);
    void fetchPicks();
  };

  const savedCount = history.filter((h) => h.action === 'save').length;
  const skippedCount = history.filter((h) => h.action === 'skip').length;
  void todayKey; // intentionally unused — addBook already stamps a date

  return (
    <Page
      topBar={
        <TopBar
          title="Discover"
          right={
            <TopBarBtn
              icon={
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              }
              onClick={() => setIntakeOpen((o) => !o)}
            >
              {intakeOpen ? 'Done' : 'Adjust'}
            </TopBarBtn>
          }
        />
      }
    >
      <PageHeader
        kicker="Discover"
        title="Find your next book"
        subtitle="Five honest picks, hand-tuned to your taste. Swipe to save or skip."
        right={<Btn onClick={() => setIntakeOpen((o) => !o)}>{intakeOpen ? 'Hide preferences' : 'Adjust preferences'}</Btn>}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: intakeOpen ? '1fr 380px' : '1fr 320px',
          gap: 32,
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div
            style={{
              position: 'relative',
              height: 580,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              userSelect: 'none',
            }}
          >
            {picks
              .slice(0, 3)
              .reverse()
              .map((b) => {
                const idx = picks.indexOf(b);
                const isTop = idx === 0;
                const scale = 1 - idx * 0.04;
                const offset = idx * 14;
                const rotation = isTop ? drag.x * 0.04 : 0;
                return (
                  <div
                    key={b.id}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: offset,
                      margin: '0 auto',
                      width: 420,
                      height: 560,
                      transform: isTop
                        ? `translate(${drag.x}px, ${drag.y * 0.3}px) rotate(${rotation}deg)`
                        : `scale(${scale}) translateY(${offset}px)`,
                      transformOrigin: 'top center',
                      transition: drag.dragging && isTop ? 'none' : 'transform 0.3s cubic-bezier(0.2,0.7,0.2,1)',
                      pointerEvents: isTop ? 'auto' : 'none',
                      zIndex: 10 - idx,
                      cursor: isTop ? 'grab' : 'default',
                      touchAction: 'none',
                    }}
                    onPointerDown={isTop ? onPointerDown : undefined}
                    onPointerMove={isTop ? onPointerMove : undefined}
                    onPointerUp={isTop ? onPointerUp : undefined}
                    onPointerCancel={isTop ? onPointerUp : undefined}
                  >
                    <AICard book={b} drag={isTop ? drag : null} />
                  </div>
                );
              })}

            {picks.length === 0 && loading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 32,
                  height: '100%',
                }}
              >
                <Spark size={56} accent={accent} />
                <div style={{ font: `900 28px 'Inter Tight'`, letterSpacing: '-0.025em', marginTop: 18, color: theme.ink }}>
                  Reading your shelf…
                </div>
                <div style={{ font: `500 14px 'Inter Tight'`, color: theme.ink2, marginTop: 6, maxWidth: 280, lineHeight: 1.5 }}>
                  Picking five books based on what you&apos;ve finished and what you said you want.
                </div>
              </div>
            )}

            {picks.length === 0 && !loading && fetchError && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 32,
                  height: '100%',
                }}
              >
                <div style={{ font: `900 28px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>
                  Something went wrong.
                </div>
                <div style={{ font: `500 14px 'Inter Tight'`, color: theme.ink2, marginTop: 6, maxWidth: 320, lineHeight: 1.5 }}>
                  {fetchError}
                </div>
                <Btn primary onClick={regenerate} style={{ marginTop: 20 }}>
                  Try again
                </Btn>
              </div>
            )}

            {picks.length === 0 && !loading && !fetchError && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 32,
                  height: '100%',
                }}
              >
                <Spark size={64} accent={accent} />
                <div style={{ font: `900 32px 'Inter Tight'`, letterSpacing: '-0.025em', marginTop: 18, color: theme.ink }}>
                  That&apos;s the stack.
                </div>
                <div style={{ font: `500 15px 'Inter Tight'`, color: theme.ink2, marginTop: 6 }}>
                  Saved <b>{savedCount}</b> · skipped <b>{skippedCount}</b>
                </div>
                <Btn primary onClick={regenerate} style={{ marginTop: 20 }}>
                  Get 5 more picks
                </Btn>
              </div>
            )}
          </div>

          {picks.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 24 }}>
              <button
                onClick={() => void swipe('skip')}
                style={{
                  appearance: 'none',
                  border: `2px solid ${theme.lineStrong}`,
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: theme.surface,
                  color: theme.ink2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Skip"
              >
                <svg width="22" height="22" viewBox="0 0 22 22">
                  <path d="M5 5 L17 17 M17 5 L5 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
              <button
                onClick={() => void swipe('save')}
                style={{
                  appearance: 'none',
                  border: 0,
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: accentGrad(accent),
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: `0 8px 20px ${accent[1]}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Save"
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path
                    d="M5 13 L11 19 L21 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', font: `500 12px 'Inter Tight'`, color: theme.ink3, marginTop: 14 }}>
            Swipe right to save · left to skip · use the buttons below
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 84 }}>
          {intakeOpen ? (
            <Card style={{ padding: 22 }}>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                In the mood for
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {ALL_GENRES.map((g) => (
                  <Pill
                    key={g}
                    sm
                    active={genres.includes(g)}
                    onClick={() =>
                      setGenres((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]))
                    }
                  >
                    {g}
                  </Pill>
                ))}
              </div>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: 18,
                }}
              >
                Avoid books like
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {avoid.map((a) => (
                  <Pill key={a} sm onClick={() => setAvoid((s) => s.filter((x) => x !== a))}>
                    {a} ×
                  </Pill>
                ))}
                <Pill sm>＋ Add</Pill>
              </div>
              <div
                style={{
                  font: `600 11px 'Inter Tight'`,
                  color: theme.ink3,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: 18,
                }}
              >
                Free prompt
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Like Sapiens but more recent…"'
                style={{
                  width: '100%',
                  marginTop: 8,
                  padding: 12,
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.line}`,
                  borderRadius: 10,
                  color: theme.ink,
                  font: `500 13px 'Inter Tight'`,
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                rows={3}
              />
              <Btn
                primary
                full
                onClick={regenerate}
                style={{ marginTop: 14 }}
                icon={<Spark size={14} accent={['#fff', '#fff']} animated={false} />}
              >
                Regenerate
              </Btn>
            </Card>
          ) : (
            <>
              <Card style={{ padding: 22 }}>
                <div
                  style={{
                    font: `600 11px 'Inter Tight'`,
                    color: theme.ink3,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  This session
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                  <div>
                    <div
                      style={{
                        font: `900 28px 'Inter Tight'`,
                        letterSpacing: '-0.025em',
                        color: '#3a7d44',
                      }}
                    >
                      {savedCount}
                    </div>
                    <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>saved</div>
                  </div>
                  <div>
                    <div
                      style={{
                        font: `900 28px 'Inter Tight'`,
                        letterSpacing: '-0.025em',
                        color: theme.ink2,
                      }}
                    >
                      {skippedCount}
                    </div>
                    <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>skipped</div>
                  </div>
                  <div>
                    <div style={{ font: `900 28px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>
                      {picks.length}
                    </div>
                    <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>remaining</div>
                  </div>
                </div>
              </Card>

              <Card style={{ padding: 22 }}>
                <div
                  style={{
                    font: `600 11px 'Inter Tight'`,
                    color: theme.ink3,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Based on
                </div>
                <div
                  style={{
                    font: `500 13px 'Inter Tight'`,
                    color: theme.ink,
                    lineHeight: 1.55,
                    marginTop: 8,
                  }}
                >
                  Your finished books · genres: <b>{genres.join(', ')}</b> · avoiding:{' '}
                  <b>{avoid.join(', ')}</b>
                </div>
              </Card>

              {history.length > 0 && (
                <Card style={{ padding: 22 }}>
                  <div
                    style={{
                      font: `600 11px 'Inter Tight'`,
                      color: theme.ink3,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 12,
                    }}
                  >
                    Recently swiped
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {history
                      .slice(-3)
                      .reverse()
                      .map((h, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <BookCover book={h.book} w={28} h={38} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ font: `700 12px 'Inter Tight'`, lineHeight: 1.2, color: theme.ink }}>
                              {h.book.title}
                            </div>
                          </div>
                          <Tag style={{ color: h.action === 'save' ? '#3a7d44' : theme.ink3 }}>
                            {h.action === 'save' ? '✓ saved' : '✕ skipped'}
                          </Tag>
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Page>
  );
}

function AICard({ book, drag }: { book: AIPick; drag: DragState | null }) {
  const { theme, accent } = useTheme();
  const saveOpacity = drag ? Math.min(1, Math.max(0, drag.x / 90)) : 0;
  const skipOpacity = drag ? Math.min(1, Math.max(0, -drag.x / 90)) : 0;
  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: 24,
        border: `1px solid ${theme.line}`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.06)',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 28,
          padding: '8px 18px',
          border: '3px solid #3a7d44',
          borderRadius: 10,
          font: `900 24px 'Inter Tight'`,
          color: '#3a7d44',
          transform: 'rotate(-12deg)',
          opacity: saveOpacity,
          zIndex: 3,
          letterSpacing: '0.04em',
        }}
      >
        SAVE
      </div>
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 28,
          padding: '8px 18px',
          border: '3px solid #c84a3a',
          borderRadius: 10,
          font: `900 24px 'Inter Tight'`,
          color: '#c84a3a',
          transform: 'rotate(12deg)',
          opacity: skipOpacity,
          zIndex: 3,
          letterSpacing: '0.04em',
        }}
      >
        SKIP
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${book.palette[0]} 0%, ${book.palette[1]} 100%)`,
          padding: '32px 0 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <BookCover book={book} w={200} h={280} style={{ boxShadow: '0 16px 36px rgba(0,0,0,0.4)' }} />
      </div>
      <div
        style={{
          padding: '22px 24px 24px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div>
          <div style={{ font: `800 24px 'Inter Tight'`, letterSpacing: '-0.025em', lineHeight: 1.1, color: theme.ink }}>
            {book.title}
          </div>
          <div style={{ font: `500 14px 'Inter Tight'`, color: theme.ink3, marginTop: 4 }}>
            {book.author} · {book.pages}pp · {book.genre}
          </div>
        </div>
        <div
          style={{
            padding: 14,
            background: accentSoftBg(accent),
            borderRadius: 12,
            font: `500 14px 'Inter Tight'`,
            color: theme.ink,
            lineHeight: 1.45,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Spark size={12} accent={accent} animated={false} />
            <span
              style={{
                font: `700 10px 'Inter Tight'`,
                color: accent[1],
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Why this
            </span>
          </div>
          {book.why}
        </div>
      </div>
    </div>
  );
}
