'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { relativeDate } from '@/lib/data/streak';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Btn, Card, Tag } from '@/components/ui/Primitives';
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
        subtitle={`${toReadBooks.length} books queued. Top of the list reads first.`}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={() => router.push('/library')}>← Library</Btn>
            <Btn primary onClick={() => router.push('/discover')} icon={<Spark size={14} accent={['#fff', '#fff']} animated={false} />}>
              Find with AI
            </Btn>
          </div>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toReadBooks.map((b, i) => (
          <Card key={b.id} style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 18,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.ink3,
                cursor: 'grab',
              }}
            >
              <svg width="10" height="14" viewBox="0 0 10 14">
                <circle cx="2" cy="2" r="1.4" fill="currentColor" />
                <circle cx="2" cy="7" r="1.4" fill="currentColor" />
                <circle cx="2" cy="12" r="1.4" fill="currentColor" />
                <circle cx="8" cy="2" r="1.4" fill="currentColor" />
                <circle cx="8" cy="7" r="1.4" fill="currentColor" />
                <circle cx="8" cy="12" r="1.4" fill="currentColor" />
              </svg>
            </div>
            <div style={{ font: `800 22px 'Inter Tight'`, color: theme.ink3, width: 28, textAlign: 'center' }}>
              {i + 1}
            </div>
            <BookCover book={b} w={56} h={78} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: `700 17px 'Inter Tight'`, letterSpacing: '-0.015em', color: theme.ink }}>
                {b.title}
              </div>
              <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3, marginTop: 2 }}>
                {b.author} · {b.pages} pages · {b.genre ?? 'Non-fiction'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                {b.added_by === 'ai' && (
                  <Tag accent>
                    <Spark size={10} accent={accent} animated={false} />
                    AI Suggested
                  </Tag>
                )}
                {b.added_by === 'friend' && <Tag>👤 {b.friend} recommended</Tag>}
                {b.added_by === 'manual' && <Tag>You added</Tag>}
                <span style={{ font: `500 12px 'Inter Tight'`, color: theme.ink3 }}>
                  {b.reason ?? relativeDate(b.added_at ?? null)}
                </span>
              </div>
            </div>
            <Btn
              primary
              sm
              onClick={() =>
                void updateBook(b.id, { status: 'reading', current_page: 0, started: todayKey })
              }
            >
              Start →
            </Btn>
          </Card>
        ))}
      </div>

      {toReadBooks.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <Spark size={40} accent={accent} />
          <div style={{ font: `800 22px 'Inter Tight'`, marginTop: 14, color: theme.ink }}>Nothing queued.</div>
          <div style={{ font: `500 14px 'Inter Tight'`, color: theme.ink2, marginTop: 4 }}>
            Let AI suggest a few books matched to your taste.
          </div>
          <Btn primary onClick={() => router.push('/discover')} style={{ marginTop: 18 }}>
            Find books with AI
          </Btn>
        </Card>
      )}
    </Page>
  );
}
