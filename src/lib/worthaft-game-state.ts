export type WorthaftGameStatus = 'playing' | 'won' | 'lost';

export const canInteractWithWorthaftGame = (gameState: WorthaftGameStatus): boolean =>
  gameState === 'playing';

// Active per-row timer. Thinking time counts while the page is visible, but
// time with the page hidden or closed does not.
export type WorthaftRowTimer = {
  elapsedMs: number;
  startedAt: number | null;
};

export const WORTHAFT_ROW_START_KEY = 'worthaft-row-start';
const WORTHAFT_ROW_TIMER_VERSION = 1;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const createWorthaftRowTimer = (now: number, elapsedMs = 0): WorthaftRowTimer => ({
  elapsedMs,
  startedAt: now,
});

export const getWorthaftRowElapsed = (timer: WorthaftRowTimer, now: number): number =>
  timer.elapsedMs + (timer.startedAt === null ? 0 : Math.max(0, now - timer.startedAt));

export const pauseWorthaftRowTimer = (timer: WorthaftRowTimer, now: number): WorthaftRowTimer => ({
  elapsedMs: getWorthaftRowElapsed(timer, now),
  startedAt: null,
});

export const resumeWorthaftRowTimer = (timer: WorthaftRowTimer, now: number): WorthaftRowTimer =>
  timer.startedAt === null ? { ...timer, startedAt: now } : timer;

// Only accumulated active time is persisted. A reload resumes from this value
// with a fresh start timestamp, so the gap between page visits is excluded.
export const readWorthaftRowTimer = (
  storage: Pick<StorageLike, 'getItem'>,
  today: string,
): number | null => {
  try {
    const raw = storage.getItem(WORTHAFT_ROW_START_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version?: unknown; date?: unknown; elapsedMs?: unknown };
    if (
      parsed.version !== WORTHAFT_ROW_TIMER_VERSION ||
      parsed.date !== today ||
      typeof parsed.elapsedMs !== 'number' ||
      !Number.isFinite(parsed.elapsedMs) ||
      parsed.elapsedMs < 0
    ) {
      return null;
    }
    return parsed.elapsedMs;
  } catch {
    // This also rejects the legacy `date:wall-clock-start` format, whose
    // hidden/closed time cannot be separated from actual play time.
    return null;
  }
};

export const writeWorthaftRowTimer = (
  storage: Pick<StorageLike, 'setItem'>,
  today: string,
  elapsedMs: number,
): void => {
  try {
    storage.setItem(WORTHAFT_ROW_START_KEY, JSON.stringify({
      version: WORTHAFT_ROW_TIMER_VERSION,
      date: today,
      elapsedMs,
    }));
  } catch {
    // Storage may be unavailable (private mode); the in-memory ref still works.
  }
};

export const clearWorthaftRowStart = (storage: Pick<StorageLike, 'removeItem'>): void => {
  try {
    storage.removeItem(WORTHAFT_ROW_START_KEY);
  } catch {
    // Ignore - clearing is best-effort.
  }
};
