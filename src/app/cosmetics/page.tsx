'use client';
import { accentGrad, accentSoftBg, ACCENT_OPTIONS, THEMES, type ThemeKey, type StreakIconVariant } from '@/lib/design/theme';
import { useTheme } from '@/lib/design/ThemeContext';
import { useApp } from '@/lib/data/AppStateContext';
import { Page, PageHeader, TopBar } from '@/components/layout/Page';
import { Card } from '@/components/ui/Primitives';
import { StreakIcon } from '@/components/icons/StreakIcon';

const FLAME_VARIANTS: StreakIconVariant[] = ['flame', 'bookmark', 'spark', 'sun'];
const FLAME_LABELS: Record<StreakIconVariant, string> = {
  flame: 'Flame',
  bookmark: 'Bookmark',
  spark: 'Spark',
  sun: 'Sun',
};
const ACCENT_LABELS = ['Fire', 'Forest', 'Ocean', 'Dusk'];
const THEME_KEYS: ThemeKey[] = ['cream', 'warm', 'cool', 'dark'];

export default function CosmeticsPage() {
  const { theme, accent, themeKey, setThemeKey, setAccent, streakIcon, setStreakIcon } = useTheme();
  const { goal, setGoal } = useApp();

  return (
    <Page
      topBar={
        <TopBar
          title="Settings"
          chevron
          subtabs={[
            { id: 'cosmetics', label: 'Cosmetics' },
            { id: 'account', label: 'Account' },
            { id: 'data', label: 'Data' },
            { id: 'notifs', label: 'Reminders' },
          ]}
          activeSubtab="cosmetics"
        />
      }
    >
      <PageHeader
        kicker="Make it yours"
        title="Cosmetics"
        subtitle="Theme, accent, streak icon, goal. Same product, your taste."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 16, color: theme.ink }}>
            Theme
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {THEME_KEYS.map((t) => {
              const TH = THEMES[t];
              const active = themeKey === t;
              return (
                <button
                  key={t}
                  onClick={() => setThemeKey(t)}
                  style={{
                    appearance: 'none',
                    border: 0,
                    padding: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      height: 110,
                      borderRadius: 14,
                      background: TH.bg,
                      position: 'relative',
                      overflow: 'hidden',
                      border: active ? `2.5px solid ${accent[1]}` : `1px solid ${theme.lineStrong}`,
                      boxShadow: active ? `0 0 0 4px ${accent[1]}22` : 'none',
                      transition: 'border 0.15s, box-shadow 0.15s',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 10, background: TH.surface, borderRadius: 10 }}>
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          width: 32,
                          height: 5,
                          background: TH.ink,
                          borderRadius: 2,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 22,
                          left: 10,
                          width: 22,
                          height: 4,
                          background: TH.ink2,
                          borderRadius: 2,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 10,
                          right: 10,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: accentGrad(accent),
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      font: `600 13px 'Inter Tight'`,
                      marginTop: 8,
                      color: theme.ink,
                      textAlign: 'center',
                    }}
                  >
                    {TH.name}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 16, color: theme.ink }}>
            Accent
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {ACCENT_OPTIONS.map((a, i) => {
              const active = accent[0] === a[0];
              return (
                <button
                  key={i}
                  onClick={() => setAccent(a)}
                  style={{
                    appearance: 'none',
                    border: 0,
                    padding: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      height: 64,
                      borderRadius: 14,
                      background: accentGrad(a),
                      border: active ? `2.5px solid ${theme.ink}` : `1px solid transparent`,
                      boxShadow: active ? `0 0 0 4px ${theme.ink}22` : `0 6px 16px ${a[1]}33`,
                    }}
                  />
                  <div
                    style={{
                      font: `600 13px 'Inter Tight'`,
                      marginTop: 8,
                      textAlign: 'center',
                      color: theme.ink,
                    }}
                  >
                    {ACCENT_LABELS[i]}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', marginBottom: 16, color: theme.ink }}>
            Streak icon
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {FLAME_VARIANTS.map((v) => {
              const active = streakIcon === v;
              return (
                <button
                  key={v}
                  onClick={() => setStreakIcon(v)}
                  style={{
                    appearance: 'none',
                    border: 0,
                    padding: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '1',
                      borderRadius: 14,
                      background: active ? accentSoftBg(accent) : theme.surfaceAlt,
                      border: active ? `2px solid ${accent[1]}` : `1px solid ${theme.line}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StreakIcon variant={v} size={48} accent={accent} animated={active} />
                  </div>
                  <div
                    style={{
                      font: `600 13px 'Inter Tight'`,
                      marginTop: 8,
                      textAlign: 'center',
                      color: theme.ink,
                    }}
                  >
                    {FLAME_LABELS[v]}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 28 }}>
          <div style={{ font: `800 18px 'Inter Tight'`, letterSpacing: '-0.025em', color: theme.ink }}>
            Daily page goal
          </div>
          <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3, marginTop: 4 }}>
            Change any time. Be honest.
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 18 }}>
            <div
              style={{
                font: `900 72px 'Inter Tight'`,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                background: accentGrad(accent),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {goal}
            </div>
            <div style={{ font: `600 14px 'Inter Tight'`, color: theme.ink2, paddingBottom: 8 }}>pages / day</div>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={1}
            value={goal}
            onChange={(e) => void setGoal(+e.target.value)}
            style={{ width: '100%', marginTop: 16, accentColor: accent[1] }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              font: `500 11px 'Inter Tight'`,
              color: theme.ink3,
              marginTop: 2,
            }}
          >
            <span>5</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </Card>

        <Card style={{ padding: 28, gridColumn: '1 / -1' }}>
          <div
            style={{
              font: `800 18px 'Inter Tight'`,
              letterSpacing: '-0.025em',
              marginBottom: 4,
              color: theme.ink,
            }}
          >
            Other settings
          </div>
          <div style={{ font: `500 13px 'Inter Tight'`, color: theme.ink3, marginBottom: 18 }}>
            Nudges, data, and how strict the streak is.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {(
              [
                ['Reminders', '8:30 pm daily'],
                ['Backfill past days', 'Allowed within 48hrs'],
                ['Rest days', "Sundays don't break streak"],
                ['Export data', 'CSV / JSON / share'],
                ['Privacy', 'All data stays on Supabase'],
                ['Delete account', 'Permanently delete everything'],
              ] as [string, string][]
            ).map(([l, r]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: theme.surfaceAlt,
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ font: `600 13px 'Inter Tight'`, color: theme.ink }}>{l}</div>
                  <div style={{ font: `500 12px 'Inter Tight'`, color: theme.ink3, marginTop: 1 }}>{r}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ color: theme.ink3 }}>
                  <path
                    d="M4 2 L8 6 L4 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}
