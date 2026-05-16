'use client';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Btn } from '@/components/ui/Primitives';
import { BookCover } from '@/components/BookCover';
import { Spark } from '@/components/icons/StreakIcon';

export default function ToReadPage() {
  const { theme, accent } = useTheme();
  const { books, updateBook, todayKey } = useApp();
  const router = useRouter();
  const toReadBooks = books.filter((b) => b.status === 'toread');

  return (
    <Page
      narrow
      topBar={
        <TopBar
          title="To-read"
          chevron
          subtabs={[
            { id: 'queue', label: 'Queue' },
            { id: 'ai', label: 'From AI' },
            { id: 'manual', label: 'Manual' },
            { id: 'friends', label: 'From friends' },
          ]}
          activeSubtab="queue"
          right={
            <TopBarBtn icon={<Spark size={12} accent={accent} animated={false} />} onClick={() => router.push('/discover')}>
              Find with AI
            </TopBarBtn>
          }
        />
      }
    >
      <PageHeader
        kicker="Up next"
        title="To-read list"
        subtitle={`${toReadBooks.length} ${toReadBooks.length === 1 ? 'book' : 'books'} queued. Top of the list reads first.`}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={() => router.push('/library')}>← Library</Btn>
            <Btn primary onClick={() => router.push('/discover')} icon={<Spark size={14} accent={['#fff', '#fff']} animated={false} />}>
              Find with AI
            </Btn>
          </div>
        }
      />

      {toReadBooks.length > 0 && (
        <div>
          {toReadBooks.map((b, i) => {
            const source =
              b.added_by === 'ai'
                ? 'AI suggested'
                : b.added_by === 'friend'
                ? `Recommended by ${b.friend ?? 'a friend'}`
                : 'You added it';
            const isLast = i === toReadBooks.length - 1;
            return (
              <article
                key={b.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 110px 1fr auto',
                  gap: 32,
                  padding: '28px 0',
                  borderBottom: isLast ? 'none' : `1px solid ${theme.line}`,
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    font: `400 italic 32px ${T.display}`,
                    fontVariationSettings: '"opsz" 36',
                    color: theme.ink3,
                    lineHeight: 1,
                    paddingTop: 6,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                <BookCover book={b} w={110} h={165} />

                <div style={{ minWidth: 0, paddingTop: 4 }}>
                  <h3
                    style={{
                      margin: 0,
                      font: `400 28px ${T.display}`,
                      fontVariationSettings: '"opsz" 36',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      color: theme.ink,
                      textWrap: 'pretty',
                    }}
                  >
                    {b.title}
                  </h3>
                  <div
                    style={{
                      marginTop: 12,
                      font: `500 11px ${T.sans}`,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: theme.ink3,
                    }}
                  >
                    {b.author} · {b.pages} pages{b.genre ? ` · ${b.genre}` : ''}
                  </div>
                  {b.reason && (
                    <p
                      style={{
                        margin: '16px 0 0',
                        font: `400 16px ${T.serif}`,
                        fontStyle: 'italic',
                        color: theme.ink2,
                        lineHeight: 1.55,
                        maxWidth: 520,
                      }}
                    >
                      {b.reason}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: 14,
                      font: `500 11px ${T.sans}`,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: theme.ink3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ color: theme.line }}>—</span>
                    <span>{source}</span>
                  </div>
                </div>

                <div style={{ paddingTop: 6 }}>
                  <Btn
                    onClick={() =>
                      void updateBook(b.id, { status: 'reading', current_page: 0, started: todayKey })
                    }
                  >
                    Start reading →
                  </Btn>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {toReadBooks.length === 0 && (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <div
            style={{
              font: `400 44px ${T.display}`,
              fontVariationSettings: '"opsz" 48',
              letterSpacing: '-0.022em',
              lineHeight: 1.1,
              color: theme.ink,
            }}
          >
            Nothing queued.
          </div>
          <p
            style={{
              margin: '14px auto 0',
              maxWidth: 460,
              font: `400 17px ${T.serif}`,
              fontStyle: 'italic',
              color: theme.ink2,
              lineHeight: 1.5,
            }}
          >
            Let the AI suggest five books matched to what you&apos;ve already loved.
          </p>
          <div style={{ marginTop: 28, display: 'inline-flex', gap: 10 }}>
            <Btn primary onClick={() => router.push('/discover')} icon={<Spark size={14} accent={['#fff', '#fff']} animated={false} />}>
              Find with AI
            </Btn>
            <Btn onClick={() => router.push('/library')}>Browse library</Btn>
          </div>
        </div>
      )}
    </Page>
  );
}
