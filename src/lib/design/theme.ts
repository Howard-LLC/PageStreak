export const T = {
  display: `'Newsreader', 'Source Serif 4', Georgia, serif`,
  serif: `'Source Serif 4', 'Newsreader', Georgia, serif`,
  sans: `'Inter Tight', system-ui, sans-serif`,
  mono: `'JetBrains Mono', ui-monospace, monospace`,
} as const;

export type ThemeKey = 'cream' | 'warm' | 'cool' | 'dark';

export interface Theme {
  key: ThemeKey;
  name: string;
  bg: string;
  bgDeep: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  lineStrong: string;
  chip: string;
  chipHover: string;
  isDark: boolean;
}

export const THEMES: Record<ThemeKey, Theme> = {
  cream: {
    key: 'cream',
    name: 'Paper',
    bg: '#faf7f1',
    bgDeep: '#f3eee3',
    surface: '#faf7f1',
    surfaceAlt: '#f3eee3',
    ink: '#1c1814',
    ink2: '#6a6259',
    ink3: '#a89e93',
    line: 'rgba(28,24,20,0.10)',
    lineStrong: 'rgba(28,24,20,0.20)',
    chip: 'rgba(28,24,20,0.05)',
    chipHover: 'rgba(28,24,20,0.09)',
    isDark: false,
  },
  warm: {
    key: 'warm',
    name: 'Linen',
    bg: '#f6efe1',
    bgDeep: '#ede4d0',
    surface: '#f6efe1',
    surfaceAlt: '#ede4d0',
    ink: '#2a1f10',
    ink2: '#6e5a3e',
    ink3: '#a89077',
    line: 'rgba(42,31,16,0.10)',
    lineStrong: 'rgba(42,31,16,0.22)',
    chip: 'rgba(42,31,16,0.05)',
    chipHover: 'rgba(42,31,16,0.1)',
    isDark: false,
  },
  cool: {
    key: 'cool',
    name: 'Cool',
    bg: '#f1f1ee',
    bgDeep: '#e6e6e2',
    surface: '#f1f1ee',
    surfaceAlt: '#e6e6e2',
    ink: '#15151a',
    ink2: '#525258',
    ink3: '#9a9a9f',
    line: 'rgba(21,21,26,0.08)',
    lineStrong: 'rgba(21,21,26,0.18)',
    chip: 'rgba(21,21,26,0.04)',
    chipHover: 'rgba(21,21,26,0.08)',
    isDark: false,
  },
  dark: {
    key: 'dark',
    name: 'Midnight',
    bg: '#181612',
    bgDeep: '#0e0c09',
    surface: '#181612',
    surfaceAlt: '#211e19',
    ink: '#f0ebe0',
    ink2: '#a59c8e',
    ink3: '#6a6359',
    line: 'rgba(240,235,224,0.10)',
    lineStrong: 'rgba(240,235,224,0.22)',
    chip: 'rgba(240,235,224,0.05)',
    chipHover: 'rgba(240,235,224,0.1)',
    isDark: true,
  },
};

export type Accent = [string, string];

export const ACCENTS = {
  fire: ['#ff7a45', '#d22b6b'] as Accent,
  forest: ['#5cb85c', '#1f6e49'] as Accent,
  ocean: ['#4a90e2', '#1f3a93'] as Accent,
  dusk: ['#a87bd9', '#5b2a8e'] as Accent,
};

export const ACCENT_OPTIONS: Accent[] = [
  ACCENTS.fire,
  ACCENTS.forest,
  ACCENTS.ocean,
  ACCENTS.dusk,
];

export const accentGrad = (a: Accent) =>
  `linear-gradient(135deg, ${a[0]} 0%, ${a[1]} 100%)`;

export const accentSoftBg = (a: Accent) =>
  `linear-gradient(135deg, ${a[0]}1a 0%, ${a[1]}1a 100%)`;

export function mix(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 255;
  const ag = (ah >> 8) & 255;
  const ab = ah & 255;
  const br = (bh >> 16) & 255;
  const bg = (bh >> 8) & 255;
  const bb = bh & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return '#' + ((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0');
}

export type StreakIconVariant = 'flame' | 'bookmark' | 'spark' | 'sun';
