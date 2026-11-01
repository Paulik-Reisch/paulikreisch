/** Original Takuzu implementation. Empty cells are -1; the two bits are 0 and 1. */
export type Cell = -1 | 0 | 1;
export type Size = 4 | 6 | 8;
export type Puzzle = { size: Size; givens: Cell[]; solution: Cell[]; id: string };

const patternCache = new Map<Size, Cell[][]>();
function patterns(size: Size): Cell[][] {
  const cached = patternCache.get(size);
  if (cached) return cached;
  const result: Cell[][] = [];
  for (let mask = 0; mask < 2 ** size; mask++) {
    const row = Array.from({ length: size }, (_, i) => ((mask >> i) & 1) as Cell);
    if (row.filter(v => v === 1).length !== size / 2) continue;
    if (row.some((v, i) => i > 1 && v === row[i - 1] && v === row[i - 2])) continue;
    result.push(row);
  }
  patternCache.set(size, result);
  return result;
}

function validInput(board: Cell[], size: Size): boolean {
  return [4, 6, 8].includes(size) && board.length === size * size && Array.from(board).every(v => v === -1 || v === 0 || v === 1);
}

export function getConflicts(board: Cell[], size: Size): number[] {
  if (!validInput(board, size)) return [];
  const bad = new Set<number>();
  for (const vertical of [false, true]) {
    const lines = Array.from({ length: size }, (_, line) =>
      Array.from({ length: size }, (_, pos) => vertical ? pos * size + line : line * size + pos));
    for (const indices of lines) {
      for (const bit of [0, 1]) {
        const matches = indices.filter(i => board[i] === bit);
        if (matches.length > size / 2) matches.forEach(i => bad.add(i));
      }
      for (let p = 0; p < size - 2; p++) {
        const triple = indices.slice(p, p + 3);
        if (board[triple[0]] !== -1 && triple.every(i => board[i] === board[triple[0]])) triple.forEach(i => bad.add(i));
      }
    }
    for (let a = 0; a < size; a++) {
      if (lines[a].some(i => board[i] === -1)) continue;
      for (let b = a + 1; b < size; b++) {
        if (lines[a].every((i, p) => board[i] === board[lines[b][p]])) {
          [...lines[a], ...lines[b]].forEach(i => bad.add(i));
        }
      }
    }
  }
  return [...bad].sort((a, b) => a - b);
}

export function isSolved(board: Cell[], size: Size): boolean {
  return validInput(board, size) && !board.includes(-1) && getConflicts(board, size).length === 0;
}

/** Pattern search prunes both row and column domains; stops as soon as limit is reached. */
function solve(board: Cell[], size: Size, limit: number, random?: () => number): Cell[][] {
  if (!validInput(board, size) || getConflicts(board, size).length) return [];
  const all = patterns(size);
  const domains = Array.from({ length: size }, (_, r) => all.filter(row => row.every((v, c) => board[r * size + c] === -1 || board[r * size + c] === v)));
  const rows: Array<Cell[] | undefined> = Array(size).fill(undefined);
  const answers: Cell[][] = [];
  function visit(depth: number) {
    if (answers.length >= limit) return;
    if (depth === size) {
      const candidate = rows.flatMap(row => row!);
      if (isSolved(candidate, size)) answers.push(candidate);
      return;
    }
    let bestRow = -1;
    let best: Cell[][] = [];
    for (let r = 0; r < size; r++) {
      if (rows[r]) continue;
      const possible = domains[r].filter(row => {
        if (rows.some(other => other && other.every((v, c) => v === row[c]))) return false;
        return row.every((v, c) => all.some(column => column[r] === v && column.every((cv, rr) => rows[rr] ? rows[rr]![c] === cv : board[rr * size + c] === -1 || board[rr * size + c] === cv)));
      });
      if (!possible.length) return;
      if (bestRow === -1 || possible.length < best.length) { bestRow = r; best = possible; }
    }
    if (random) shuffle(best, random);
    for (const row of best) {
      rows[bestRow] = row;
      visit(depth + 1);
      rows[bestRow] = undefined;
      if (answers.length >= limit) return;
    }
  }
  visit(0);
  return answers;
}

export function countSolutions(board: Cell[], size: Size, limit = 2): number {
  if (!Number.isInteger(limit) || limit < 1) return 0;
  return solve(board, size, limit).length;
}

function seeded(seed: string): () => number {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function generatePuzzle(size: Size, seed: string): Puzzle {
  if (![4, 6, 8].includes(size)) throw new Error('Bits supports 4, 6 and 8 cells per side.');
  const random = seeded(`bits-v1:${size}:${seed}`);
  const solution = solve(Array<Cell>(size * size).fill(-1), size, 1, random)[0];
  if (!solution) throw new Error('Could not generate a Bits solution.');
  const givens = [...solution];
  const order = shuffle(Array.from({ length: givens.length }, (_, i) => i), random);
  // A single bounded removal pass; each accepted removal preserves exactly one solution.
  for (const index of order) {
    const previous = givens[index];
    givens[index] = -1;
    if (countSolutions(givens, size) !== 1) givens[index] = previous;
  }
  return { size, givens, solution, id: `bits-v1-${size}-${seed}` };
}

export function getHint(board: Cell[], puzzle: Puzzle): { index: number; value: Cell; reason: string } | null {
  const { size, solution, givens } = puzzle;
  if (!validInput(board, size)) return null;
  const incorrect = board.findIndex((v, i) => v !== -1 && v !== solution[i]);
  if (incorrect !== -1) return { index: incorrect, value: solution[incorrect], reason: 'Dieses Bit führt in eine Sackgasse. Korrigiere es, damit das Rätsel lösbar bleibt.' };
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== -1 || givens[i] !== -1) continue;
    const opposite = [...board];
    opposite[i] = solution[i] === 0 ? 1 : 0;
    if (getConflicts(opposite, size).length) return { index: i, value: solution[i], reason: 'Das andere Bit würde eine Dreierfolge, zu viele gleiche Bits oder eine doppelte Reihe erzeugen.' };
  }
  const index = board.findIndex((v, i) => v === -1 && givens[i] === -1);
  return index === -1 ? null : { index, value: solution[index], reason: 'Nur dieses Bit lässt eine vollständige Lösung nach allen drei Regeln zu.' };
}
