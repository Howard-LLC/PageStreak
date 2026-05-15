'use client';

const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' } as const;
const stroke = 'currentColor';
const sw = 1.6;

export function NavIcon({ id, active }: { id: string; active?: boolean }) {
  switch (id) {
    case 'today':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.5" stroke={stroke} strokeWidth={sw} />
          <circle cx="8" cy="8" r="2" fill={active ? stroke : 'none'} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case 'shelf':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="3" height="12" stroke={stroke} strokeWidth={sw} />
          <rect x="6.5" y="2" width="3" height="12" stroke={stroke} strokeWidth={sw} />
          <rect x="11" y="3" width="3" height="11" transform="rotate(-6 12.5 8)" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case 'queue':
      return (
        <svg {...common}>
          <path d="M2 4 H10 M2 8 H10 M2 12 H7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="13" cy="12" r="1.5" fill={stroke} />
        </svg>
      );
    case 'cal':
      return (
        <svg {...common}>
          <rect x="2" y="3.5" width="12" height="10.5" rx="1" stroke={stroke} strokeWidth={sw} />
          <line x1="2" y1="6.5" x2="14" y2="6.5" stroke={stroke} strokeWidth={sw} />
          <line x1="5" y1="2" x2="5" y2="5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="11" y1="2" x2="11" y2="5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case 'recap':
      return (
        <svg {...common}>
          <path d="M3 13 V8 M7 13 V5 M11 13 V10" stroke={stroke} strokeWidth={sw + 0.4} strokeLinecap="round" />
        </svg>
      );
    case 'stats':
      return (
        <svg {...common}>
          <path d="M2 13 L6 8 L9 11 L14 4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="14" cy="4" r="1.5" fill={stroke} />
        </svg>
      );
    case 'badges':
      return (
        <svg {...common}>
          <path
            d="M8 1.5 L9.7 5 L13.5 5.5 L10.7 8.2 L11.4 12 L8 10.2 L4.6 12 L5.3 8.2 L2.5 5.5 L6.3 5 Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
            fill={active ? stroke : 'none'}
            fillOpacity={active ? 0.2 : 0}
          />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common}>
          <path
            d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
            fill={active ? stroke : 'none'}
            fillOpacity={active ? 0.2 : 0}
          />
        </svg>
      );
    default:
      return null;
  }
}
