// Only these three storage methods are exposed. Getting window.localStorage
// itself can throw, so the property access must also stay inside the try block.
export const worthaftStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = {
  getItem(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
  setItem(key, value) { try { window.localStorage.setItem(key, value); } catch { /* Keep playing in memory. */ } },
  removeItem(key) { try { window.localStorage.removeItem(key); } catch { /* Best effort. */ } },
};

export type SavedLetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';
export type SavedDailyGame = {
  date: string;
  guesses: { guess: string; statuses: SavedLetterStatus[] }[];
  status: 'won' | 'lost' | 'playing';
  letterStatuses: Record<string, SavedLetterStatus>;
  hotTip?: { letter: string | null; attempt: number | null };
  hotTipUsed?: boolean;
  jokerPosition?: { guessIndex: number; letterIndex: number };
  rowTimes?: number[];
};
export const EMPTY_WORTHAFT_STATS = { games: 0, wins: 0, streak: 0, maxStreak: 0 };
type Stats = typeof EMPTY_WORTHAFT_STATS;
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const count = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0;
const index = (value: unknown, max: number): value is number => count(value) && value < max;
const status = (value: unknown): value is SavedLetterStatus =>
  ['correct', 'present', 'absent', 'empty', 'tbd'].includes(value as string);
const letter = (value: unknown): value is string => typeof value === 'string' && /^[A-ZÄÖÜẞ]$/.test(value);

export function parseWorthaftStats(raw: string | null): Stats | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!record(value)) return null;
    // Older records may omit counters. Keep their valid counters, default only
    // missing ones, and reject malformed values rather than spreading objects.
    const stats = { ...EMPTY_WORTHAFT_STATS };
    for (const key of Object.keys(stats) as (keyof Stats)[]) {
      if (value[key] !== undefined) {
        if (!count(value[key])) return null;
        stats[key] = value[key];
      }
    }
    return stats;
  } catch { return null; }
}

export function parseWorthaftDailyGame(raw: string | null): SavedDailyGame | null {
  if (raw === null) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (!record(v) || typeof v.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v.date) ||
      !['playing', 'won', 'lost'].includes(v.status as string) ||
      !Array.isArray(v.guesses) || v.guesses.length > 6 ||
      !v.guesses.every(g => record(g) && typeof g.guess === 'string' && /^[A-ZÄÖÜẞ]{5}$/.test(g.guess) &&
        Array.isArray(g.statuses) && g.statuses.length === 5 && g.statuses.every(status))) return null;
    if (v.letterStatuses !== undefined && (!record(v.letterStatuses) ||
      !Object.entries(v.letterStatuses).every(([key, value]) => letter(key) && status(value)))) return null;
    if (v.rowTimes !== undefined && (!Array.isArray(v.rowTimes) || v.rowTimes.length > 6 ||
      !v.rowTimes.every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0))) return null;
    if (v.hotTip !== undefined && v.hotTip !== null && (!record(v.hotTip) ||
      !(v.hotTip.letter === null || letter(v.hotTip.letter)) ||
      !(v.hotTip.attempt === null || (count(v.hotTip.attempt) && v.hotTip.attempt >= 1 && v.hotTip.attempt <= 6)))) return null;
    if (v.hotTipUsed !== undefined && typeof v.hotTipUsed !== 'boolean') return null;
    if (v.jokerPosition !== undefined && (!record(v.jokerPosition) ||
      !index(v.jokerPosition.guessIndex, 6) || !index(v.jokerPosition.letterIndex, 5))) return null;
    return { ...v, letterStatuses: v.letterStatuses ?? {}, hotTip: v.hotTip ?? undefined } as SavedDailyGame;
  } catch { return null; }
}
