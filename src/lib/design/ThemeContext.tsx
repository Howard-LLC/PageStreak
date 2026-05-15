'use client';
import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import { ACCENTS, type Accent, THEMES, type Theme, type ThemeKey, type StreakIconVariant } from './theme';

interface ThemeCtxValue {
  theme: Theme;
  accent: Accent;
  themeKey: ThemeKey;
  setThemeKey: (k: ThemeKey) => void;
  setAccent: (a: Accent) => void;
  streakIcon: StreakIconVariant;
  setStreakIcon: (v: StreakIconVariant) => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: THEMES.cream,
  accent: ACCENTS.fire,
  themeKey: 'cream',
  setThemeKey: () => {},
  setAccent: () => {},
  streakIcon: 'flame',
  setStreakIcon: () => {},
});

const STORAGE_KEY = 'page-streak:cosmetics';

interface StoredCosmetics {
  themeKey?: ThemeKey;
  accent?: Accent;
  streakIcon?: StreakIconVariant;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>('cream');
  const [accent, setAccentState] = useState<Accent>(ACCENTS.fire);
  const [streakIcon, setStreakIconState] = useState<StreakIconVariant>('flame');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredCosmetics;
      if (parsed.themeKey && THEMES[parsed.themeKey]) setThemeKeyState(parsed.themeKey);
      if (parsed.accent) setAccentState(parsed.accent);
      if (parsed.streakIcon) setStreakIconState(parsed.streakIcon);
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const persist = (next: StoredCosmetics) => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as StoredCosmetics;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...next }));
    } catch {
      // ignore quota errors
    }
  };

  const setThemeKey = (k: ThemeKey) => {
    setThemeKeyState(k);
    persist({ themeKey: k });
  };
  const setAccent = (a: Accent) => {
    setAccentState(a);
    persist({ accent: a });
  };
  const setStreakIcon = (v: StreakIconVariant) => {
    setStreakIconState(v);
    persist({ streakIcon: v });
  };

  const theme = THEMES[themeKey] ?? THEMES.cream;
  const value = useMemo<ThemeCtxValue>(
    () => ({ theme, accent, themeKey, setThemeKey, setAccent, streakIcon, setStreakIcon }),
    [theme, accent, themeKey, streakIcon],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
