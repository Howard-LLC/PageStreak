export function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayKey(): string {
  return fmt(new Date());
}

export function computeStreak(log: Record<string, number>, todayPages: number): number {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const k = fmt(d);
    const pages = i === 0 ? todayPages : log[k] || 0;
    if (pages > 0) streak++;
    else break;
  }
  return streak;
}

export function computeBestStreak(log: Record<string, number>): number {
  const dates = Object.keys(log).sort();
  if (!dates.length) return 0;
  let best = 0;
  let cur = 0;
  let prev: string | null = null;
  for (const d of dates) {
    if (!prev) {
      cur = 1;
      prev = d;
      best = 1;
      continue;
    }
    const dt = (new Date(d).getTime() - new Date(prev).getTime()) / 86400000;
    if (dt === 1) cur++;
    else cur = 1;
    if (cur > best) best = cur;
    prev = d;
  }
  return best;
}

export function relativeDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  if (diff < 365) return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  return d.toLocaleDateString('en', { month: 'short', year: 'numeric' });
}
