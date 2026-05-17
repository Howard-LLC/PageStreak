'use client';
import { useId } from 'react';
import type { Accent } from '@/lib/design/theme';

export type BadgeId =
  // Streak — heat progression
  | 'spark'
  | 'ember'
  | 'flame'
  | 'flameDouble'
  | 'bonfire'
  | 'torch'
  | 'laurel'
  | 'sun'
  // Pages — accumulation
  | 'openBook'
  | 'bookStack'
  | 'tallStack'
  | 'shelf'
  // Books — achievement
  | 'medal'
  | 'ribbon'
  | 'trophy'
  | 'crown'
  // Moments
  | 'weekStar'
  | 'monthGrid'
  | 'moon'
  | 'sunrise';

interface Props {
  id: BadgeId;
  earned: boolean;
  accent: Accent;
  muted: string;
  size?: number;
}

export function BadgeIcon({ id, earned, accent, muted, size = 64 }: Props) {
  const gradId = 'bg_' + useId().replace(/:/g, '');
  const stroke = earned ? `url(#${gradId})` : muted;
  const fill = earned ? `url(#${gradId})` : 'none';
  const lockedStrokeWidth = 1.6;
  const earnedStrokeWidth = 0;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent[0]} />
          <stop offset="1" stopColor={accent[1]} />
        </linearGradient>
      </defs>
      {renderShape(id, { earned, fill, stroke, lockedSW: lockedStrokeWidth, earnedSW: earnedStrokeWidth, muted, accent })}
    </svg>
  );
}

interface ShapeCtx {
  earned: boolean;
  fill: string;
  stroke: string;
  lockedSW: number;
  earnedSW: number;
  muted: string;
  accent: Accent;
}

function renderShape(id: BadgeId, c: ShapeCtx) {
  const sw = c.earned ? c.earnedSW : c.lockedSW;
  const f = c.earned ? c.fill : 'none';
  const s = c.stroke;
  // Helper for outline-only icons that always show a stroke.
  const lineStroke = c.earned ? c.fill : c.stroke;

  switch (id) {
    case 'spark':
      return (
        <path
          d="M16 5 L17.6 13.4 L26 16 L17.6 18.6 L16 27 L14.4 18.6 L6 16 L14.4 13.4 Z"
          fill={f}
          stroke={s}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );

    case 'ember':
      return (
        <g>
          <circle cx="16" cy="22" r="6" fill={f} stroke={s} strokeWidth={sw} />
          <path
            d="M16 7 C 14 11, 12 13, 12 16 C 12 19, 14 21, 16 21 C 18 21, 20 19, 20 16 C 20 13, 18 11, 16 7 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      );

    case 'flame':
      return (
        <path
          d="M16 3
             C 14 8, 11 10, 9 14
             C 7 18, 7 23, 10 26
             C 12 28, 14 29, 16 29
             C 18 29, 20 28, 22 26
             C 25 23, 25 18, 23 14
             C 21 11, 19 9, 18 6
             C 17.5 7, 17 8, 16.4 8.5
             C 16 7, 16 5, 16 3 Z"
          fill={f}
          stroke={s}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );

    case 'flameDouble':
      return (
        <g>
          <path
            d="M10 9
               C 8.5 12, 7 13.5, 7 17
               C 7 20, 9 22, 11 22
               C 13 22, 15 20, 15 17
               C 15 14, 13 12, 11.5 10
               C 11 10.5, 10.7 11, 10.3 11.3
               C 10 10.5, 10 9.7, 10 9 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M22 5
               C 20 9, 17.5 11, 17.5 16
               C 17.5 21, 20.5 24, 23 24
               C 25.5 24, 28 21, 28 16
               C 28 12, 26 10, 24 7
               C 23.5 7.5, 23 8, 22.5 8.5
               C 22.2 7.5, 22 6, 22 5 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      );

    case 'bonfire':
      return (
        <g>
          <path
            d="M16 2
               C 14 6, 11 8, 10 12
               C 9 15, 10 19, 13 21
               C 14.5 22, 17.5 22, 19 21
               C 22 19, 23 15, 22 12
               C 21 9, 19 7, 18 4
               C 17.5 5, 17 5.5, 16.5 6
               C 16.2 4.5, 16 3, 16 2 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <line x1="5" y1="26" x2="27" y2="22" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="5" y1="22" x2="27" y2="26" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );

    case 'torch':
      return (
        <g>
          <path
            d="M16 2
               C 14.5 5, 12.5 6.5, 11.5 9
               C 10.5 11.5, 11 14.5, 13 16
               C 14.5 17, 17.5 17, 19 16
               C 21 14.5, 21.5 11.5, 20.5 9
               C 19.5 7, 18 6, 17.5 4
               C 17 4.5, 16.5 5, 16 5.5
               C 16 4, 16 3, 16 2 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <rect x="13" y="16" width="6" height="2.6" rx="0.6" fill={lineStroke} />
          <rect x="14.2" y="18.6" width="3.6" height="11" rx="0.6" fill={f === 'none' ? 'none' : c.muted} stroke={lineStroke} strokeWidth={sw || 1.4} />
        </g>
      );

    case 'laurel':
      return (
        <g>
          <path
            d="M16 8
               C 15 11, 13.5 12.5, 12.5 14.5
               C 11.5 17, 12.5 19.5, 14.5 20.5
               C 15.5 21, 16.5 21, 17.5 20.5
               C 19.5 19.5, 20.5 17, 19.5 14.5
               C 18.5 12, 17.5 11, 17 9
               C 16.7 9.5, 16.4 10, 16.1 10.3
               C 16 9.5, 16 8.7, 16 8 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* left laurel */}
          <path
            d="M6 22 C 7 18, 8 14, 10 12"
            stroke={lineStroke}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M7.6 19 Q 8.6 19.2 9.2 18.4" stroke={lineStroke} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M8.2 16.4 Q 9.2 16.6 9.8 15.8" stroke={lineStroke} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          {/* right laurel */}
          <path
            d="M26 22 C 25 18, 24 14, 22 12"
            stroke={lineStroke}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M24.4 19 Q 23.4 19.2 22.8 18.4" stroke={lineStroke} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M23.8 16.4 Q 22.8 16.6 22.2 15.8" stroke={lineStroke} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'sun':
      return (
        <g>
          <circle cx="16" cy="16" r="6" fill={f} stroke={s} strokeWidth={sw} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 16 + Math.cos(rad) * 9.5;
            const y1 = 16 + Math.sin(rad) * 9.5;
            const x2 = 16 + Math.cos(rad) * 13.5;
            const y2 = 16 + Math.sin(rad) * 13.5;
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={lineStroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      );

    case 'openBook':
      return (
        <g>
          <path
            d="M16 8
               C 13 6, 7 6, 5 7
               L 5 24
               C 7 23, 13 23, 16 25
               C 19 23, 25 23, 27 24
               L 27 7
               C 25 6, 19 6, 16 8 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <line x1="16" y1="8" x2="16" y2="25" stroke={c.earned ? '#fff' : c.muted} strokeOpacity={c.earned ? 0.6 : 1} strokeWidth="1.4" />
        </g>
      );

    case 'bookStack':
      return (
        <g>
          <rect x="5" y="20" width="22" height="6" rx="1" fill={f} stroke={s} strokeWidth={sw} />
          <rect x="7" y="13" width="18" height="6" rx="1" fill={f} stroke={s} strokeWidth={sw} />
          <rect x="9" y="6" width="14" height="6" rx="1" fill={f} stroke={s} strokeWidth={sw} />
        </g>
      );

    case 'tallStack':
      return (
        <g>
          {[26, 21, 16, 11, 6].map((y, i) => (
            <rect
              key={i}
              x={5 + i * 0.6}
              y={y}
              width={22 - i * 1.2}
              height="4"
              rx="0.8"
              fill={f}
              stroke={s}
              strokeWidth={sw}
            />
          ))}
        </g>
      );

    case 'shelf':
      return (
        <g>
          <line x1="3" y1="26" x2="29" y2="26" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
          {[5, 8.5, 12, 15, 18, 21.5, 25].map((x, i) => {
            const h = [16, 13, 17, 14, 16, 13, 15][i];
            return (
              <rect
                key={i}
                x={x}
                y={26 - h}
                width={i === 2 || i === 5 ? 3 : 2.4}
                height={h}
                rx="0.4"
                fill={f}
                stroke={s}
                strokeWidth={sw}
              />
            );
          })}
        </g>
      );

    case 'medal':
      return (
        <g>
          <path
            d="M11 3 L13 13 L19 13 L21 3"
            fill="none"
            stroke={lineStroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="20" r="8" fill={f} stroke={s} strokeWidth={sw} />
          <path
            d="M16 16 L17.4 19 L20.6 19.4 L18.2 21.6 L18.8 24.8 L16 23.2 L13.2 24.8 L13.8 21.6 L11.4 19.4 L14.6 19 Z"
            fill={c.earned ? '#fff' : 'none'}
            stroke={c.earned ? 'none' : c.muted}
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity={c.earned ? 0.9 : 1}
          />
        </g>
      );

    case 'ribbon':
      return (
        <g>
          <circle cx="16" cy="13" r="8" fill={f} stroke={s} strokeWidth={sw} />
          <path d="M11 19 L9 29 L13 26 L16 28 L19 26 L23 29 L21 19" fill={f} stroke={s} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="16" cy="13" r="3.5" fill={c.earned ? '#fff' : 'none'} stroke={c.muted} strokeWidth="1.2" opacity={c.earned ? 0.85 : 1} />
        </g>
      );

    case 'trophy':
      return (
        <g>
          <path
            d="M10 6 L22 6 L22 14
               C 22 18, 19 21, 16 21
               C 13 21, 10 18, 10 14 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* handles */}
          <path d="M10 8 Q 6 9, 7 13 Q 8 15, 10 14" fill="none" stroke={lineStroke} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M22 8 Q 26 9, 25 13 Q 24 15, 22 14" fill="none" stroke={lineStroke} strokeWidth="1.6" strokeLinejoin="round" />
          {/* stem */}
          <rect x="14.5" y="21" width="3" height="4" fill={lineStroke} />
          {/* base */}
          <rect x="10" y="25" width="12" height="3" rx="0.8" fill={f} stroke={s} strokeWidth={sw} />
        </g>
      );

    case 'crown':
      return (
        <g>
          <path
            d="M4 12 L9 22 L23 22 L28 12 L22 17 L16 8 L10 17 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <rect x="6" y="23" width="20" height="3" rx="0.6" fill={f} stroke={s} strokeWidth={sw} />
          <circle cx="16" cy="8" r="1.6" fill={lineStroke} />
          <circle cx="4" cy="12" r="1.4" fill={lineStroke} />
          <circle cx="28" cy="12" r="1.4" fill={lineStroke} />
        </g>
      );

    case 'weekStar':
      return (
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const angle = (i * 360) / 7 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 16 + Math.cos(rad) * 5;
            const y1 = 16 + Math.sin(rad) * 5;
            const x2 = 16 + Math.cos(rad) * 13;
            const y2 = 16 + Math.sin(rad) * 13;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={lineStroke}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx="16" cy="16" r="3.4" fill={f} stroke={s} strokeWidth={sw} />
        </g>
      );

    case 'monthGrid':
      return (
        <g>
          {Array.from({ length: 30 }).map((_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            return (
              <rect
                key={i}
                x={5 + col * 3.7}
                y={6 + row * 3.7}
                width="3"
                height="3"
                rx="0.4"
                fill={f}
                stroke={s}
                strokeWidth={c.earned ? 0 : 0.8}
              />
            );
          })}
        </g>
      );

    case 'moon':
      return (
        <path
          d="M22 6
             A 11 11 0 1 0 22 26
             A 8.5 8.5 0 1 1 22 6 Z"
          fill={f}
          stroke={s}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );

    case 'sunrise':
      return (
        <g>
          {/* horizon */}
          <line x1="3" y1="24" x2="29" y2="24" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
          {/* half-sun */}
          <path
            d="M8 24 A 8 8 0 0 1 24 24 Z"
            fill={f}
            stroke={s}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* rays */}
          {[-30, 0, 30].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const x1 = 16 + Math.cos(rad) * 11;
            const y1 = 24 + Math.sin(rad) * 11;
            const x2 = 16 + Math.cos(rad) * 14.5;
            const y2 = 24 + Math.sin(rad) * 14.5;
            return (
              <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
            );
          })}
        </g>
      );

    default:
      return null;
  }
}
