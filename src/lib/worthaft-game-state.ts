export type WorthaftGameStatus = 'playing' | 'won' | 'lost';

export const canInteractWithWorthaftGame = (gameState: WorthaftGameStatus): boolean =>
  gameState === 'playing';

// Per-row timer persistence.
//
// The timer for a row starts when the row becomes active (game loaded for the
// first row, previous guess submitted for later rows) - not on the first
// keystroke. Thinking time is part of the measured time. The row start is
// persisted per day so a page reload keeps the clock running instead of
// silently resetting the current row to zero.
export const WORTHAFT_ROW_START_KEY = 'worthaft-row-start';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

// Returns the persisted row-start timestamp (ms) for `today`, or null when
// nothing valid is stored (missing, other day, malformed).
export const readWorthaftRowStart = (storage: Pick<StorageLike, 'getItem'>, today: string): number | null => {
  try {
    const raw = storage.getItem(WORTHAFT_ROW_START_KEY);
    if (!raw) return null;
    const separator = raw.indexOf(':');
    if (separator <= 0) return null;
    const date = raw.slice(0, separator);
    const timestamp = Number(raw.slice(separator + 1));
    if (date !== today || !Number.isFinite(timestamp) || timestamp <= 0) return null;
    return timestamp;
  } catch {
    return null;
  }
};

export const writeWorthaftRowStart = (storage: Pick<StorageLike, 'setItem'>, today: string, now: number): void => {
  try {
    storage.setItem(WORTHAFT_ROW_START_KEY, `${today}:${now}`);
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
