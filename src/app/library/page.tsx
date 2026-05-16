'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { relativeDate } from '@/lib/data/streak';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Btn, Card, Pill, ProgressBar } from '@/components/ui/Primitives';
import { BookCover } from '@/components/BookCover';

type Filter = 'all' | 'reading' | 'finished';

export default function LibraryPage() {
  const { theme, accent } = useTheme();
  const { books, setCurrentBookId } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'title'>('recent');

  const filtered = useMemo(() => {
    let r = books.filter((b) => b.status !== 'toread');
    if (filter !== 'all') r = r.filter((b) => b.status === filter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (sort === 'title') r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [books, filter, search, sort]);

  const counts = useMemo(
    () => ({
      reading: books.filter((b) => b.status === 'reading').length,
      finished: books.filter((b) => b.status === 'finished').length,
      toread: books.filter((b) => b.status === 'toread').length,
    }),
    [books],
  );

  return (
    <Page
      topBar={
        <TopBar
          title="Library"
          chevron
          subtabs={[
            { id: 'all', label: 'All' },
            { id: 'reading', label: 'Reading' },
            { id: 'finished', label: 'Finished' },
            { id: 'toread', label: 'To Read' },
          ]}
          activeSubtab={filter}
          onSubtab={(t) => (t === 'toread' ? router.push('/to-read') : setFilter(t as Filter))}
          right={
            <>
              <TopBarBtn
                icon={
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                    <line x1="10" y1="10" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                }
              >
                Search
              </TopBarBtn>
              <TopBarBtn
                icon={
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 4 L7 8 L11 4 M3 10 L11 10"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Sort: {sort === 'recent' ? 'Recent' : 'A–Z'}
              </TopBarBtn>
            </>
          }
        />
      }
    >
      <PageHeader
        kicker="Your books"
        title="Library"
        subtitle={`${counts.reading + counts.finished} books on your shelf · ${counts.toread} queued`}
        right={
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={() => router.push('/to-read')}>To read · {counts.toread}</Btn>
          </div>
        }
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill active={filter === 'all'} onClick={() => setFilter('all')}>
            All · {counts.reading + counts.finished}
          </Pill>
          <Pill active={filter === 'reading'} onClick={() => setFilter('reading')}>
            Reading · {counts.reading}
          </Pill>
          <Pill active={filter === 'finished'} onClick={() => setFilter('finished')}>
            Finished · {counts.finished}
          </Pill>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            background: theme.surface,
            border: `1px solid ${theme.line}`,
            borderRadius: 10,
            minWidth: 260,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke={theme.ink3} strokeWidth="1.5" />
            <line x1="10" y1="10" x2="13" y2="13" stroke={theme.ink3} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author"
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: 'transparent',
              color: theme.ink,
              font: `500 13px 'Inter Tight'`,
            }}
          />
        </div>
        <button
          onClick={() => setSort((s) => (s === 'recent' ? 'title' : 'recent'))}
          style={{
            appearance: 'none',
            border: `1px solid ${theme.line}`,
            background: theme.surface,
            padding: '8px 14px',
            borderRadius: 10,
            color: theme.ink,
            cursor: 'pointer',
            font: `600 13px 'Inter Tight'`,
          }}
        >
          Sort: {sort === 'recent' ? 'Recent' : 'A–Z'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 22,
        }}
      >
        {filtered.map((b) => (
          <div
            key={b.id}
            onClick={async () => {
              await setCurrentBookId(b.id);
              router.push(`/book?id=${b.id}`);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ width: '100%', aspectRatio: '2 / 3' }}>
              <BookCover
                book={b}
                w="100%"
                h="100%"
                style={{ width: '100%', height: '100%' }}
                showBadge={b.status === 'reading' ? 'reading' : null}
              />
            </div>
            <div
              style={{
                font: `700 14px 'Inter Tight'`,
                marginTop: 10,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                color: theme.ink,
              }}
            >
              {b.title}
            </div>
            <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>{b.author}</div>
            {b.status === 'reading' && (
              <div style={{ marginTop: 6 }}>
                <ProgressBar value={b.current_page ?? 0} max={b.pages} h={3} />
                <div style={{ font: `600 11px 'Inter Tight'`, color: accent[1], marginTop: 4 }}>
                  p. {b.current_page ?? 0}/{b.pages}
                </div>
              </div>
            )}
            {b.status === 'finished' && (
              <div style={{ font: `500 11px 'Inter Tight'`, color: theme.ink2, marginTop: 4 }}>
                <span style={{ color: accent[1] }}>{'★'.repeat(b.rating ?? 0)}</span>
                <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - (b.rating ?? 0))}</span>
                {b.finished && ` · ${relativeDate(b.finished)}`}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ font: `700 16px 'Inter Tight'`, color: theme.ink }}>No books match.</div>
          <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink2, marginTop: 4 }}>
            Try a different filter or search term.
          </div>
        </Card>
      )}
    </Page>
  );
}
