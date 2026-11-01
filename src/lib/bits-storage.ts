import { isSolved, type Cell, type Puzzle } from './bits-engine';

export const BITS_COOKIE = 'pr_bits_v1';
export const BITS_HISTORY_LIMIT = 20;
const COOKIE_PATH = '/game-labs/bits';

export type SavedBits = {
  version: 1;
  puzzle: Puzzle;
  board: Cell[];
  elapsed: number;
  hints: number;
  history: Cell[][];
  completed: boolean;
};

const pack = (board: Cell[]) => board.map(value => value === -1 ? '.' : String(value)).join('');
function unpack(value: unknown, length: number): Cell[] | null {
  if (typeof value !== 'string' || value.length !== length || /[^.01]/.test(value)) return null;
  return [...value].map(value => value === '.' ? -1 : value === '0' ? 0 : 1);
}

export function serializeBitsState(state: SavedBits): string {
  return encodeURIComponent(JSON.stringify({
    v: 1, n: state.puzzle.size, id: state.puzzle.id,
    g: pack(state.puzzle.givens), s: pack(state.puzzle.solution), b: pack(state.board),
    t: Math.floor(state.elapsed), h: state.hints,
    u: state.history.slice(-BITS_HISTORY_LIMIT).map(pack), c: state.completed,
  }));
}

export function parseBitsState(raw: string): SavedBits | null {
  try {
    if (raw.length > 3800) return null;
    const data = JSON.parse(decodeURIComponent(raw));
    if (!data || data.v !== 1 || ![4, 6, 8].includes(data.n) || typeof data.id !== 'string' || data.id.length > 120) return null;
    const length = data.n * data.n;
    const givens = unpack(data.g, length), solution = unpack(data.s, length), board = unpack(data.b, length);
    if (!givens || !solution || !board || !isSolved(solution, data.n)) return null;
    const preservesGivens = (cells: Cell[]) => givens.every((value, index) => value === -1 || (value === solution[index] && cells[index] === value));
    if (!preservesGivens(board)) return null;
    if (!Number.isSafeInteger(data.t) || data.t < 0 || data.t > 31536000 || !Number.isSafeInteger(data.h) || data.h < 0 || data.h > 1000000) return null;
    if (!Array.isArray(data.u) || data.u.length > BITS_HISTORY_LIMIT || typeof data.c !== 'boolean') return null;
    const history: Cell[][] = [];
    for (const entry of data.u) {
      const cells = unpack(entry, length);
      if (!cells || !preservesGivens(cells)) return null;
      history.push(cells);
    }
    if (data.c !== isSolved(board, data.n)) return null;
    return { version: 1, puzzle: { size: data.n, id: data.id, givens, solution }, board, elapsed: data.t, hints: data.h, history, completed: data.c };
  } catch { return null; }
}

export function loadBitsState(): SavedBits | null {
  try {
    const entry = document.cookie.split('; ').find(value => value.startsWith(`${BITS_COOKIE}=`));
    return entry ? parseBitsState(entry.slice(BITS_COOKIE.length + 1)) : null;
  } catch { return null; }
}

export function saveBitsState(state: SavedBits): boolean {
  try {
    const value = serializeBitsState(state);
    if (value.length > 3800) return false;
    document.cookie = `${BITS_COOKIE}=${value}; Path=${COOKIE_PATH}; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    return document.cookie.split('; ').some(entry => entry === `${BITS_COOKIE}=${value}`);
  } catch { return false; }
}

export function clearBitsState(): void {
  try { document.cookie = `${BITS_COOKIE}=; Path=${COOKIE_PATH}; Max-Age=0; SameSite=Lax`; } catch { /* Playing remains possible when cookies are blocked. */ }
}
