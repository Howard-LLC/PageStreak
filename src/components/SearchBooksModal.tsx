'use client';
import { useEffect, useState } from 'react';
import { T, type Accent } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { findCover, openLibraryCoverUrl } from '@/lib/data/covers';
import type { BookStatus } from '@/lib/data/types';

interface SearchHit {
  key: string;
  title: string;
  author: string;
  pages: number | null;
  coverId: number | null;
  fallbackCoverUrl?: string | null;
}

const QUEUE_PALETTES: Accent[] = [
  ['#1c2541', '#5bc0be'],
  ['#3a1e1e', '#c9846d'],
  ['#1e3a2b', '#b8c69b'],
  ['#2b1e3a', '#dfc8e8'],
  ['#3a2e1f', '#e8b339'],
  ['#1a3a3a', '#9bc6c4'],
];

interface Props {
  onClose: () => void;
  defaultStatus?: BookStatus;
  title?: string;
  subtitle?: string;
}

export function SearchBooksModal({
  onClose,
  defaultStatus = 'toread',
  title = 'Add a book',
  subtitle = 'Search any title or author. Books you pick land in your queue.',
}: Props) {
  const { theme, accent } = useTheme();
  const { addBook } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [addedKeys, setAddedKeys] = useState<Set<string>>(new Set());
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            query,
          )}&limit=25&fields=key,title,author_name,cover_i,number_of_pages_median,edition_count&language=eng`,
          { signal: ctrl.signal },
        );
        if (!res.ok) return;
        const json = (await res.json()) as {
          docs?: {
            key?: string;
            title?: string;
            author_name?: string[];
            cover_i?: number;
            number_of_pages_median?: number;
            edition_count?: number;
          }[];
        };
        const docs = json.docs ?? [];

        const BAD_TITLE = /\b(summary|study guide|analysis|cliffsnotes|sparknotes|workbook|abridged|condensed|companion to|guide to|notes on)\b/i;
        const BAD_AUTHOR = /\b(bookcaps|summary|sparknotes|cliffsnotes|study guide|smartreads|instaread|booksumo|getflashnotes|reads ?on ?demand|publishing|press)\b/i;
        const normTitle = (s: string) =>
          s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/^the\s+/, '');
        const normAuthor = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();

        const filtered = docs.filter((d) => {
          if (!d.title || !d.author_name?.length) return false;
          if (BAD_TITLE.test(d.title)) return false;
          if (BAD_AUTHOR.test(d.author_name[0])) return false;
          return true;
        });

        const byKey = new Map<string, (typeof filtered)[number]>();
        for (const d of filtered) {
          const k = `${normTitle(d.title!)}|${normAuthor(d.author_name![0])}`;
          const prev = byKey.get(k);
          if (!prev || (d.edition_count ?? 0) > (prev.edition_count ?? 0)) {
            byKey.set(k, d);
          }
        }
        const deduped = Array.from(byKey.values());
        deduped.sort((a, b) => {
          const aCover = a.cover_i ? 1 : 0;
          const bCover = b.cover_i ? 1 : 0;
          if (aCover !== bCover) return bCover - aCover;
          return (b.edition_count ?? 0) - (a.edition_count ?? 0);
        });
        const hits: SearchHit[] = deduped.slice(0, 8).map((d) => ({
          key: d.key ?? `${d.title}-${d.author_name?.[0]}`,
          title: d.title!,
          author: d.author_name?.[0] ?? '',
          pages: d.number_of_pages_median ?? null,
          coverId: d.cover_i ?? null,
          fallbackCoverUrl: null,
        }));
        setResults(hits);

        // For results without an Open Library cover, run the fallback chain in
        // the background and patch each row when a URL resolves.
        const fallbackCtrl = new AbortController();
        ctrl.signal.addEventListener('abort', () => fallbackCtrl.abort());
        void Promise.all(
          hits
            .filter((h) => !h.coverId)
            .map(async (h) => {
              const url = await findCover(h.title, h.author, fallbackCtrl.signal);
              if (!url) return;
              setResults((curr) =>
                curr.map((c) => (c.key === h.key ? { ...c, fallbackCoverUrl: url } : c)),
              );
            }),
        );
      } catch (err) {
        if ((err as { name?: string })?.name !== 'AbortError') {
          // best-effort
        }
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  const addOne = async (hit: SearchHit, idx: number) => {
    if (addedKeys.has(hit.key) || pendingKey === hit.key) return;
    setPendingKey(hit.key);
    // Pick the best cover we know about right now; if none yet, run the
    // fallback chain inline so the saved row gets a cover the first time it
    // appears in the library.
    let coverUrl: string | null = hit.coverId
      ? openLibraryCoverUrl(hit.coverId)
      : hit.fallbackCoverUrl ?? null;
    if (!coverUrl) {
      coverUrl = await findCover(hit.title, hit.author);
    }
    const result = await addBook({
      title: hit.title,
      author: hit.author,
      pages: hit.pages ?? 300,
      palette: QUEUE_PALETTES[idx % QUEUE_PALETTES.length],
      status: defaultStatus,
      added_by: 'manual',
      added_at: new Date().toISOString(),
      cover_url: coverUrl,
    });
    setPendingKey(null);
    if (result) {
      setAddedKeys((prev) => {
        const next = new Set(prev);
        next.add(hit.key);
        return next;
      });
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,18,16,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 24px 24px',
        animation: 'ps-fade-up 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: 'calc(100vh - 120px)',
          background: theme.surface,
          border: `1px solid ${theme.line}`,
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <header
          style={{
            padding: '24px 28px 20px',
            borderBottom: `1px solid ${theme.line}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  font: `400 26px ${T.display}`,
                  fontVariationSettings: '"opsz" 36',
                  letterSpacing: '-0.02em',
                  color: theme.ink,
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  margin: '6px 0 0',
                  font: `400 14px ${T.serif}`,
                  fontStyle: 'italic',
                  color: theme.ink2,
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                appearance: 'none',
                border: 0,
                background: 'transparent',
                color: theme.ink3,
                fontSize: 24,
                lineHeight: 1,
                cursor: 'pointer',
                padding: 4,
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title or author…"
            style={{
              marginTop: 18,
              width: '100%',
              padding: '14px 16px',
              fontSize: 16,
              fontFamily: T.sans,
              background: theme.surfaceAlt,
              color: theme.ink,
              border: `1px solid ${theme.line}`,
              borderRadius: 12,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {results.length === 0 && query.trim().length >= 2 && !searching && (
            <div
              style={{
                padding: '32px 28px',
                font: `400 14px ${T.serif}`,
                fontStyle: 'italic',
                color: theme.ink3,
              }}
            >
              No matches. Try a different spelling or include the author.
            </div>
          )}
          {results.length === 0 && query.trim().length < 2 && (
            <div
              style={{
                padding: '32px 28px',
                font: `400 14px ${T.serif}`,
                fontStyle: 'italic',
                color: theme.ink3,
              }}
            >
              Start typing to search Open Library.
            </div>
          )}
          {results.map((hit, i) => {
            const added = addedKeys.has(hit.key);
            const pending = pendingKey === hit.key;
            return (
              <button
                key={hit.key}
                onClick={() => void addOne(hit, i)}
                disabled={added || pending}
                style={{
                  appearance: 'none',
                  border: 0,
                  background: added ? `${accent[1]}10` : 'transparent',
                  width: '100%',
                  padding: '14px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: added ? 'default' : 'pointer',
                  textAlign: 'left',
                  borderTop: i === 0 ? 0 : `1px solid ${theme.line}`,
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ width: 44, height: 66, flex: '0 0 auto' }}>
                  {hit.coverId || hit.fallbackCoverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hit.coverId ? `https://covers.openlibrary.org/b/id/${hit.coverId}-M.jpg` : hit.fallbackCoverUrl!}
                      alt=""
                      style={{ width: 44, height: 66, objectFit: 'cover', borderRadius: 3 }}
                    />
                  ) : (
                    <div style={{ width: 44, height: 66, background: theme.chip, borderRadius: 3 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      font: `600 15px ${T.sans}`,
                      color: theme.ink,
                      lineHeight: 1.25,
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {hit.title}
                  </div>
                  <div
                    style={{
                      font: `500 12px ${T.sans}`,
                      color: theme.ink3,
                      marginTop: 3,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {hit.author}
                    {hit.pages ? ` · ${hit.pages} pages` : ''}
                  </div>
                </div>
                <div
                  style={{
                    minWidth: 72,
                    textAlign: 'right',
                    font: `500 12px ${T.sans}`,
                    color: added ? accent[1] : theme.ink3,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {added ? '✓ Queued' : pending ? 'Adding…' : '+ Queue'}
                </div>
              </button>
            );
          })}
        </div>

        {addedKeys.size > 0 && (
          <footer
            style={{
              padding: '14px 28px',
              borderTop: `1px solid ${theme.line}`,
              font: `500 12px ${T.sans}`,
              color: theme.ink2,
              letterSpacing: '0.04em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              {addedKeys.size} {addedKeys.size === 1 ? 'book' : 'books'} added to your queue.
            </span>
            <button
              onClick={onClose}
              style={{
                appearance: 'none',
                border: 0,
                background: 'transparent',
                color: theme.ink,
                font: `600 13px ${T.sans}`,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
