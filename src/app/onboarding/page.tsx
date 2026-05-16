'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { T, accentGrad, type Accent } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Wordmark } from '@/components/icons/Logo';

type Step = 'welcome' | 'birthday' | 'gender' | 'books' | 'done';

const STEPS: Step[] = ['welcome', 'birthday', 'gender', 'books', 'done'];

const GENDER_OPTIONS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'] as const;

interface SearchHit {
  key: string;
  title: string;
  author: string;
  pages: number | null;
  coverId: number | null;
}

const READ_PALETTES: Accent[] = [
  ['#1c2541', '#5bc0be'],
  ['#3a1e1e', '#c9846d'],
  ['#1e3a2b', '#b8c69b'],
  ['#2b1e3a', '#dfc8e8'],
  ['#3a2e1f', '#e8b339'],
  ['#1a3a3a', '#9bc6c4'],
];

export default function OnboardingPage() {
  const { theme, accent } = useTheme();
  const router = useRouter();
  const { authReady, user, profile, addBook, completeOnboarding } = useApp();
  const [step, setStep] = useState<Step>('welcome');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<SearchHit[]>([]);
  const [saving, setSaving] = useState(false);

  // Not signed in or already onboarded → leave.
  useEffect(() => {
    if (!authReady) return;
    if (!user) router.replace('/login');
    else if (profile?.onboarded_at) router.replace('/');
  }, [authReady, user, profile, router]);

  const idx = STEPS.indexOf(step);
  const goNext = () => setStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  const goBack = () => setStep(STEPS[Math.max(idx - 1, 0)]);

  const finish = async () => {
    setSaving(true);
    // Persist books first (so they exist in case onboarding marker write fails)
    for (let i = 0; i < selectedBooks.length; i++) {
      const b = selectedBooks[i];
      await addBook({
        title: b.title,
        author: b.author,
        pages: b.pages ?? 300,
        palette: READ_PALETTES[i % READ_PALETTES.length],
        status: 'finished',
        added_by: 'manual',
        added_at: new Date().toISOString(),
        cover_url: b.coverId ? `https://covers.openlibrary.org/b/id/${b.coverId}-L.jpg` : null,
      });
    }
    await completeOnboarding({
      birthday: birthday || null,
      gender: gender || null,
    });
    router.replace('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        color: theme.ink,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          padding: '28px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.line}`,
        }}
      >
        <Wordmark size={18} accent={accent} mono={false} />
        <ProgressDots step={step} accent={accent} ink={theme.ink3} />
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 32px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 640 }}>
          {step === 'welcome' && <Welcome onNext={goNext} accent={accent} theme={theme} firstName={profile?.display_name?.split(' ')[0] ?? null} />}
          {step === 'birthday' && (
            <BirthdayStep
              birthday={birthday}
              setBirthday={setBirthday}
              onBack={goBack}
              onNext={goNext}
              accent={accent}
              theme={theme}
            />
          )}
          {step === 'gender' && (
            <GenderStep
              gender={gender}
              setGender={setGender}
              onBack={goBack}
              onNext={goNext}
              accent={accent}
              theme={theme}
            />
          )}
          {step === 'books' && (
            <BooksStep
              selected={selectedBooks}
              setSelected={setSelectedBooks}
              onBack={goBack}
              onNext={goNext}
              accent={accent}
              theme={theme}
            />
          )}
          {step === 'done' && (
            <DoneStep
              count={selectedBooks.length}
              onBack={goBack}
              onFinish={finish}
              saving={saving}
              accent={accent}
              theme={theme}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function ProgressDots({
  step,
  accent,
  ink,
}: {
  step: Step;
  accent: Accent;
  ink: string;
}) {
  const at = STEPS.indexOf(step);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {STEPS.map((s, i) => (
        <div
          key={s}
          style={{
            width: i === at ? 32 : 8,
            height: 8,
            borderRadius: 4,
            background: i <= at ? accent[1] : ink,
            opacity: i <= at ? 1 : 0.25,
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

interface StepProps {
  accent: Accent;
  theme: ReturnType<typeof useTheme>['theme'];
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        font: `400 56px ${T.display}`,
        fontVariationSettings: '"opsz" 48',
        letterSpacing: '-0.022em',
        lineHeight: 1.05,
        margin: 0,
      }}
    >
      {children}
    </h1>
  );
}

function Sub({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p
      style={{
        font: `400 19px ${T.serif}`,
        fontStyle: 'italic',
        color,
        lineHeight: 1.5,
        margin: '20px 0 0',
        maxWidth: 540,
      }}
    >
      {children}
    </p>
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
  accent,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  accent: Accent;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        appearance: 'none',
        border: 0,
        background: disabled ? '#aaa' : accentGrad(accent),
        color: '#fff',
        font: `600 17px ${T.sans}`,
        padding: '14px 28px',
        borderRadius: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : `0 8px 20px ${accent[1]}55`,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({
  children,
  onClick,
  theme,
}: {
  children: React.ReactNode;
  onClick: () => void;
  theme: StepProps['theme'];
}) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none',
        border: `1px solid ${theme.lineStrong}`,
        background: 'transparent',
        color: theme.ink2,
        font: `500 15px ${T.sans}`,
        padding: '12px 22px',
        borderRadius: 14,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function Welcome({
  onNext,
  accent,
  theme,
  firstName,
}: {
  onNext: () => void;
  accent: Accent;
  theme: StepProps['theme'];
  firstName: string | null;
}) {
  return (
    <div style={{ animation: 'ps-fade-up 0.5s ease' }}>
      <Heading>
        Welcome{firstName ? ', ' : ''}
        {firstName && <span style={{ fontStyle: 'italic', fontWeight: 500 }}>{firstName}</span>}.
      </Heading>
      <Sub color={theme.ink2}>
        Page Streak keeps track of the pages you read. A daily check-in, a streak, a real library.
        Three quick questions and you&apos;re in.
      </Sub>
      <div style={{ marginTop: 40 }}>
        <PrimaryBtn onClick={onNext} accent={accent}>
          Let&apos;s go →
        </PrimaryBtn>
      </div>
    </div>
  );
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function daysInMonth(month: number, year: number): number {
  // month is 1-12. JS Date with day 0 of next month gives last day of this month.
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

function BirthdayStep({
  birthday,
  setBirthday,
  onBack,
  onNext,
  accent,
  theme,
}: {
  birthday: string;
  setBirthday: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  accent: Accent;
  theme: StepProps['theme'];
}) {
  // birthday is stored as ISO YYYY-MM-DD
  const parts = birthday.split('-');
  const initYear = parts[0] ? Number(parts[0]) : 0;
  const initMonth = parts[1] ? Number(parts[1]) : 0;
  const initDay = parts[2] ? Number(parts[2]) : 0;
  const [month, setMonth] = useState<number>(initMonth);
  const [day, setDay] = useState<number>(initDay);
  const [year, setYear] = useState<number>(initYear);

  const thisYear = new Date().getFullYear();
  const years = useMemo(() => {
    const out: number[] = [];
    for (let y = thisYear; y >= 1925; y--) out.push(y);
    return out;
  }, [thisYear]);
  const maxDay = daysInMonth(month, year);
  const days = useMemo(() => {
    const out: number[] = [];
    for (let d = 1; d <= maxDay; d++) out.push(d);
    return out;
  }, [maxDay]);

  // If the picked day exceeds the new month's day count, clip it.
  useEffect(() => {
    if (day > maxDay) setDay(maxDay);
  }, [maxDay, day]);

  // Sync the combined ISO date back up.
  useEffect(() => {
    if (month && day && year) {
      const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setBirthday(iso);
    } else {
      setBirthday('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, day, year]);

  const valid = !!month && !!day && !!year;

  return (
    <div style={{ animation: 'ps-fade-up 0.5s ease' }}>
      <Heading>When were you born?</Heading>
      <Sub color={theme.ink2}>
        We use this to pace recommendations to the right life stage — books that&apos;ll mean
        something to you now, not five years ago.
      </Sub>
      <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <DateSelect
          label="Month"
          value={month}
          onChange={setMonth}
          options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))}
          width={180}
          theme={theme}
        />
        <DateSelect
          label="Day"
          value={day}
          onChange={setDay}
          options={days.map((d) => ({ value: d, label: String(d) }))}
          width={110}
          theme={theme}
        />
        <DateSelect
          label="Year"
          value={year}
          onChange={setYear}
          options={years.map((y) => ({ value: y, label: String(y) }))}
          width={140}
          theme={theme}
        />
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
        <SecondaryBtn onClick={onBack} theme={theme}>
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={onNext} disabled={!valid} accent={accent}>
          Continue →
        </PrimaryBtn>
      </div>
    </div>
  );
}

function DateSelect({
  label,
  value,
  onChange,
  options,
  width,
  theme,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  options: { value: number; label: string }[];
  width: number;
  theme: StepProps['theme'];
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span
        style={{
          font: `600 11px ${T.sans}`,
          color: theme.ink3,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div style={{ position: 'relative', width }}>
        <select
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            width: '100%',
            padding: '14px 38px 14px 16px',
            fontSize: 17,
            fontFamily: T.sans,
            fontWeight: 500,
            background: theme.surface,
            color: value ? theme.ink : theme.ink3,
            border: `1px solid ${theme.lineStrong}`,
            borderRadius: 12,
            outline: 'none',
            cursor: 'pointer',
            lineHeight: 1.2,
          }}
        >
          <option value="" disabled>
            —
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: theme.ink3,
          }}
        >
          <path
            d="M3 5 L7 9 L11 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </label>
  );
}

function GenderStep({
  gender,
  setGender,
  onBack,
  onNext,
  accent,
  theme,
}: {
  gender: string | null;
  setGender: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  accent: Accent;
  theme: StepProps['theme'];
}) {
  return (
    <div style={{ animation: 'ps-fade-up 0.5s ease' }}>
      <Heading>How do you identify?</Heading>
      <Sub color={theme.ink2}>
        Reading life is personal. This helps the AI nudge recommendations toward voices that often
        resonate — never to exclude anything.
      </Sub>
      <div
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          maxWidth: 480,
        }}
      >
        {GENDER_OPTIONS.map((g) => {
          const selected = gender === g;
          return (
            <button
              key={g}
              onClick={() => setGender(g)}
              style={{
                appearance: 'none',
                border: `2px solid ${selected ? accent[1] : theme.line}`,
                background: selected ? `${accent[1]}10` : theme.surface,
                color: theme.ink,
                font: `500 16px ${T.sans}`,
                padding: '18px 20px',
                borderRadius: 14,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              {g}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
        <SecondaryBtn onClick={onBack} theme={theme}>
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={onNext} disabled={!gender} accent={accent}>
          Continue →
        </PrimaryBtn>
      </div>
    </div>
  );
}

function BooksStep({
  selected,
  setSelected,
  onBack,
  onNext,
  accent,
  theme,
}: {
  selected: SearchHit[];
  setSelected: (b: SearchHit[]) => void;
  onBack: () => void;
  onNext: () => void;
  accent: Accent;
  theme: StepProps['theme'];
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);

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
          )}&limit=25&fields=key,title,author_name,cover_i,number_of_pages_median,language,edition_count&language=eng`,
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
        const normAuthor = (s: string) =>
          s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();

        const filtered = docs.filter((d) => {
          if (!d.title || !d.author_name?.length) return false;
          const author = d.author_name[0];
          if (BAD_TITLE.test(d.title)) return false;
          if (BAD_AUTHOR.test(author)) return false;
          return true;
        });

        // Dedupe by normalised title+author, keep the one with the highest edition_count
        const byKey = new Map<string, (typeof filtered)[number]>();
        for (const d of filtered) {
          const k = `${normTitle(d.title!)}|${normAuthor(d.author_name![0])}`;
          const prev = byKey.get(k);
          if (!prev || (d.edition_count ?? 0) > (prev.edition_count ?? 0)) {
            byKey.set(k, d);
          }
        }

        const deduped = Array.from(byKey.values());
        // Cover-first, then by edition count (popularity proxy)
        deduped.sort((a, b) => {
          const aCover = a.cover_i ? 1 : 0;
          const bCover = b.cover_i ? 1 : 0;
          if (aCover !== bCover) return bCover - aCover;
          return (b.edition_count ?? 0) - (a.edition_count ?? 0);
        });

        const hits: SearchHit[] = deduped.slice(0, 6).map((d) => ({
          key: d.key ?? `${d.title}-${d.author_name?.[0]}`,
          title: d.title!,
          author: d.author_name?.[0] ?? '',
          pages: d.number_of_pages_median ?? null,
          coverId: d.cover_i ?? null,
        }));
        setResults(hits);
      } catch (err) {
        if ((err as { name?: string })?.name !== 'AbortError') {
          // ignore — search is best-effort
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

  const toggleSelect = (hit: SearchHit) => {
    if (selected.some((s) => s.key === hit.key)) {
      setSelected(selected.filter((s) => s.key !== hit.key));
    } else {
      setSelected([...selected, hit]);
    }
  };

  return (
    <div style={{ animation: 'ps-fade-up 0.5s ease' }}>
      <Heading>What have you read?</Heading>
      <Sub color={theme.ink2}>
        Add a few books you&apos;ve already finished. We use them to seed your library and shape
        recommendations. You can add more later.
      </Sub>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a book title or author…"
        autoFocus
        style={{
          marginTop: 32,
          width: '100%',
          padding: '16px 20px',
          fontSize: 17,
          fontFamily: T.sans,
          background: theme.surface,
          color: theme.ink,
          border: `1px solid ${theme.lineStrong}`,
          borderRadius: 14,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {results.length > 0 && (
        <div
          style={{
            marginTop: 14,
            background: theme.surface,
            border: `1px solid ${theme.line}`,
            borderRadius: 14,
            overflow: 'hidden',
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          {results.map((hit, i) => {
            const isSel = selected.some((s) => s.key === hit.key);
            return (
              <button
                key={hit.key}
                onClick={() => toggleSelect(hit)}
                style={{
                  appearance: 'none',
                  border: 0,
                  background: isSel ? `${accent[1]}12` : 'transparent',
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderTop: i === 0 ? 0 : `1px solid ${theme.line}`,
                }}
              >
                <div style={{ width: 36, height: 54, flex: '0 0 auto' }}>
                  {hit.coverId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://covers.openlibrary.org/b/id/${hit.coverId}-M.jpg`}
                      alt=""
                      style={{ width: 36, height: 54, objectFit: 'cover', borderRadius: 3 }}
                    />
                  ) : (
                    <div style={{ width: 36, height: 54, background: theme.chip, borderRadius: 3 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: `600 15px ${T.sans}`, color: theme.ink, lineHeight: 1.2 }}>
                    {hit.title}
                  </div>
                  <div style={{ font: `500 13px ${T.sans}`, color: theme.ink3, marginTop: 3 }}>
                    {hit.author}
                  </div>
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: `2px solid ${isSel ? accent[1] : theme.line}`,
                    background: isSel ? accent[1] : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSel && (
                    <svg width="12" height="12" viewBox="0 0 14 14">
                      <path
                        d="M3 7 L6 10 L11 4"
                        stroke="white"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {searching && results.length === 0 && (
        <div style={{ marginTop: 14, font: `400 14px ${T.serif}`, fontStyle: 'italic', color: theme.ink3 }}>
          Searching…
        </div>
      )}

      {selected.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              font: `600 11px ${T.sans}`,
              color: theme.ink3,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Added to your library · {selected.length}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {selected.map((b) => (
              <SelectedChip key={b.key} hit={b} onRemove={() => toggleSelect(b)} theme={theme} />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 40, display: 'flex', gap: 12, alignItems: 'center' }}>
        <SecondaryBtn onClick={onBack} theme={theme}>
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={onNext} accent={accent}>
          {selected.length === 0 ? 'Skip for now →' : `Continue with ${selected.length} →`}
        </PrimaryBtn>
      </div>
    </div>
  );
}

function SelectedChip({
  hit,
  onRemove,
  theme,
}: {
  hit: SearchHit;
  onRemove: () => void;
  theme: StepProps['theme'];
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 12px 6px 6px',
        background: theme.surface,
        border: `1px solid ${theme.line}`,
        borderRadius: 32,
      }}
    >
      <div style={{ width: 28, height: 40, flex: '0 0 auto' }}>
        {hit.coverId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://covers.openlibrary.org/b/id/${hit.coverId}-S.jpg`}
            alt=""
            style={{ width: 28, height: 40, objectFit: 'cover', borderRadius: 2 }}
          />
        ) : (
          <div style={{ width: 28, height: 40, background: theme.chip, borderRadius: 2 }} />
        )}
      </div>
      <div style={{ font: `600 13px ${T.sans}`, color: theme.ink, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {hit.title}
      </div>
      <button
        onClick={onRemove}
        style={{
          appearance: 'none',
          border: 0,
          background: 'transparent',
          color: theme.ink3,
          font: `600 18px ${T.sans}`,
          cursor: 'pointer',
          padding: '0 4px',
          lineHeight: 1,
        }}
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}

function DoneStep({
  count,
  onBack,
  onFinish,
  saving,
  accent,
  theme,
}: {
  count: number;
  onBack: () => void;
  onFinish: () => void;
  saving: boolean;
  accent: Accent;
  theme: StepProps['theme'];
}) {
  return (
    <div style={{ animation: 'ps-fade-up 0.5s ease' }}>
      <Heading>Ready to read.</Heading>
      <Sub color={theme.ink2}>
        {count > 0
          ? `We'll add ${count} book${count === 1 ? '' : 's'} to your shelf as finished, and you can start logging pages today.`
          : `Your shelf starts empty. Add your current read from the library page when you're ready.`}
      </Sub>
      <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
        <SecondaryBtn onClick={onBack} theme={theme}>
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={onFinish} disabled={saving} accent={accent}>
          {saving ? 'Setting up…' : 'Open my reading life →'}
        </PrimaryBtn>
      </div>
    </div>
  );
}
