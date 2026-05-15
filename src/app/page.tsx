'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { fmt } from '@/lib/data/streak';
import { Page, PageHeader, TopBar, TopBarBtn } from '@/components/layout/Page';
import { Btn, DisplayNum, Kicker, ProgressBar, Rule } from '@/components/ui/Primitives';
import { BookCover } from '@/components/BookCover';
import { StreakIcon } from '@/components/icons/StreakIcon';
import { CheckinModal } from '@/components/checkin/CheckinModal';
import { CelebrateOverlay } from '@/components/checkin/CelebrateOverlay';
import { accentGrad } from '@/lib/design/theme';

export default function TodayPage() {
  const { theme, accent, streakIcon } = useTheme();
  const { streak, todayPages, goal, currentBook, books, bestStreak, log, profile, stretchGoal, setCurrentBookId } =
    useApp();
  const router = useRouter();
  const [showCheckin, setShowCheckin] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);

  const goalHit = todayPages >= goal;
  const remaining = Math.max(0, goal - todayPages);

  const today = useMemo(() => new Date(), []);
  const greeting = useMemo(() => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, [today]);
  const dateString = today.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });
  const greetingName = profile?.display_name?.split(' ')[0] ?? 'reader';

  const days = useMemo(() => {
    const out: { d: Date; k: string; pages: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = fmt(d);
      const pages = i === 0 ? todayPages : log[k] || 0;
      out.push({ d, k, pages, isToday: i === 0 });
    }
    return out;
  }, [log, todayPages, today]);

  const recentLog = useMemo(() => {
    const out: { k: string; pages: number; d: Date; rel: string }[] = [];
    for (let i = 1; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = fmt(d);
      const pages = log[k] || 0;
      if (pages > 0) out.push({ k, pages, d, rel: i === 1 ? 'Yesterday' : `${i} days ago` });
    }
    return out.slice(0, 4);
  }, [log, today]);

  const handleAfterLog = (newTotal: number) => {
    if (newTotal >= goal && todayPages < goal) {
      setTimeout(() => setShowCelebrate(true), 100);
    }
  };

  return (
    <>
      <Page
        wide
        topBar={
          <TopBar
            title="Today"
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
                      <path d="M7 1 V13 M1 7 H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  }
                  onClick={() => setShowCheckin(true)}
                >
                  Log pages
                </TopBarBtn>
              </>
            }
          />
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            font: `400 13px ${T.sans}`,
            color: theme.ink2,
            letterSpacing: '0.04em',
            paddingBottom: 32,
            marginBottom: 40,
            borderBottom: `1px solid ${theme.line}`,
          }}
        >
          <div>
            {greeting}, {greetingName}.
          </div>
          <div style={{ fontVariant: 'small-caps', letterSpacing: '0.1em' }}>{dateString}</div>
        </div>

        {currentBook && (
          <article
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 64,
              alignItems: 'center',
              marginBottom: 80,
            }}
          >
            <div style={{ position: 'relative', perspective: 1400 }}>
              <div
                style={{
                  transform: 'rotateY(-8deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.2, 0.7, 0.3, 1)',
                  cursor: 'pointer',
                  animation: 'ps-fade-up 0.5s ease',
                }}
                onClick={() => router.push(`/book?id=${currentBook.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateY(-2deg)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateY(-8deg)')}
              >
                <BookCover book={currentBook} w={260} h={376} />
              </div>
            </div>

            <div style={{ animation: 'ps-fade-up 0.5s ease 0.05s both' }}>
              <Kicker>Currently reading</Kicker>
              <h1
                style={{
                  margin: '14px 0 0',
                  font: `300 76px ${T.display}`,
                  fontVariationSettings: '"opsz" 72',
                  letterSpacing: '-0.035em',
                  lineHeight: 0.95,
                  color: theme.ink,
                  textWrap: 'pretty',
                }}
              >
                {currentBook.title}
              </h1>
              <div
                style={{
                  font: `400 22px ${T.serif}`,
                  fontStyle: 'italic',
                  color: theme.ink2,
                  marginTop: 18,
                }}
              >
                by {currentBook.author}
              </div>

              <div style={{ marginTop: 36, maxWidth: 480 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    font: `500 12px ${T.sans}`,
                    color: theme.ink2,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  <span>
                    Page {currentBook.current_page ?? 0} of {currentBook.pages}
                  </span>
                  <span>{Math.round(((currentBook.current_page ?? 0) / currentBook.pages) * 100)}% complete</span>
                </div>
                <ProgressBar value={currentBook.current_page ?? 0} max={currentBook.pages} h={3} gradient={false} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'center' }}>
                <Btn
                  primary
                  onClick={() => setShowCheckin(true)}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <path d="M7 2 V12 M2 7 H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  }
                >
                  Log today&apos;s pages
                </Btn>
                <Btn onClick={() => router.push(`/book?id=${currentBook.id}`)}>Open book</Btn>
                <span
                  style={{
                    font: `400 13px ${T.serif}`,
                    fontStyle: 'italic',
                    color: theme.ink3,
                    marginLeft: 6,
                  }}
                >
                  {Math.ceil((currentBook.pages - (currentBook.current_page ?? 0)) / 20)} days left at your pace
                </span>
              </div>
            </div>
          </article>
        )}

        <Rule label="Today" style={{ marginBottom: 36 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 56, marginBottom: 72 }}>
          <div>
            <Kicker style={{ marginBottom: 18 }}>Pages today</Kicker>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <DisplayNum value={todayPages} size={104} />
              <div style={{ font: `400 22px ${T.serif}`, fontStyle: 'italic', color: theme.ink3 }}>/ {goal}</div>
            </div>
            <div
              style={{
                font: `400 14px ${T.serif}`,
                color: theme.ink2,
                marginTop: 10,
                lineHeight: 1.5,
                maxWidth: 320,
              }}
            >
              {goalHit ? (
                <>
                  You read past today&apos;s goal. <span style={{ color: theme.ink }}>Well done.</span>
                </>
              ) : todayPages > 0 ? (
                <>You&apos;re {remaining} pages from today&apos;s goal. A short session, and it&apos;s done.</>
              ) : (
                <>Open a book, read a little, log when you stop.</>
              )}
            </div>
          </div>

          <div>
            <Kicker style={{ marginBottom: 18 }}>Streak</Kicker>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <DisplayNum value={streak} size={104} />
              <StreakIcon variant={streakIcon} size={40} accent={accent} />
            </div>
            <div style={{ font: `400 14px ${T.serif}`, color: theme.ink2, marginTop: 10, lineHeight: 1.5 }}>
              Day streak. Best ever: {bestStreak} days.
            </div>
          </div>

          <div>
            <Kicker style={{ marginBottom: 18 }}>Last seven days</Kicker>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {days.map((day, i) => {
                const hit = day.pages >= goal;
                const maxBar = Math.max(...days.map((d) => d.pages), goal);
                const h = Math.max(4, (day.pages / maxBar) * 88);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: '100%',
                        height: h,
                        background: hit ? accentGrad(accent) : day.pages > 0 ? theme.ink : theme.chip,
                        transition: 'height 0.5s ease',
                        position: 'relative',
                      }}
                    >
                      {day.isToday && (
                        <div
                          style={{
                            position: 'absolute',
                            top: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 4,
                            height: 4,
                            background: accent[1],
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        font: `400 10px ${T.sans}`,
                        color: day.isToday ? accent[1] : theme.ink3,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.d.getDay()]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {recentLog.length > 0 && (
          <>
            <Rule label="Recent" style={{ marginBottom: 32 }} />
            <div style={{ marginBottom: 72 }}>
              {recentLog.map((e, i) => (
                <div
                  key={e.k}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr auto',
                    gap: 24,
                    alignItems: 'baseline',
                    padding: '18px 0',
                    borderBottom: i < recentLog.length - 1 ? `1px solid ${theme.line}` : 'none',
                  }}
                >
                  <div>
                    <div style={{ font: `400 16px ${T.serif}`, color: theme.ink }}>{e.rel}</div>
                    <div
                      style={{
                        font: `400 12px ${T.sans}`,
                        color: theme.ink3,
                        marginTop: 3,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {e.d.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ font: `400 14px ${T.serif}`, fontStyle: 'italic', color: theme.ink2 }}>
                    {currentBook?.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span
                      style={{
                        font: `300 32px ${T.display}`,
                        fontVariationSettings: '"opsz" 24',
                        color: theme.ink,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {e.pages}
                    </span>
                    <span
                      style={{
                        font: `400 11px ${T.sans}`,
                        color: theme.ink3,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      pages
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <Rule label="On the shelf" style={{ marginBottom: 32 }} />
        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div style={{ font: `400 13px ${T.serif}`, fontStyle: 'italic', color: theme.ink2 }}>
            {books.filter((b) => b.status === 'finished').length} books finished.{' '}
            {books.filter((b) => b.status === 'toread').length} queued.
          </div>
          <button
            onClick={() => router.push('/library')}
            style={{
              appearance: 'none',
              border: 0,
              background: 'transparent',
              font: `500 12px ${T.sans}`,
              color: theme.ink2,
              cursor: 'pointer',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: 0,
            }}
          >
            Library →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 18 }}>
          {books
            .filter((b) => b.status === 'finished')
            .slice(0, 8)
            .map((b) => (
              <div
                key={b.id}
                onClick={async () => {
                  await setCurrentBookId(b.id);
                  router.push(`/book?id=${b.id}`);
                }}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
              >
                <BookCover book={b} w="100%" h={140} style={{ width: '100%', height: 140 }} />
                <div
                  style={{
                    font: `500 11px ${T.serif}`,
                    marginTop: 10,
                    lineHeight: 1.3,
                    color: theme.ink,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {b.title}
                </div>
              </div>
            ))}
        </div>
      </Page>

      {showCheckin && <CheckinModal onClose={() => setShowCheckin(false)} onAfterLog={handleAfterLog} />}
      {showCelebrate && (
        <CelebrateOverlay isStretch={todayPages >= stretchGoal} onClose={() => setShowCelebrate(false)} />
      )}
    </>
  );
}
