import test from 'node:test';
import assert from 'node:assert/strict';
import { countSolutions, generatePuzzle, getConflicts, getHint, isSolved, type Cell, type Size } from '../../src/lib/bits-engine';

for (const size of [4, 6, 8] as Size[]) {
  test(`${size}×${size} generated puzzles are deterministic, valid and uniquely solvable`, () => {
    for (const seed of ['2026-11-01', 'free-42', 'another']) {
      const puzzle = generatePuzzle(size, seed);
      assert.deepEqual(generatePuzzle(size, seed), puzzle);
      assert.equal(isSolved(puzzle.solution, size), true);
      assert.equal(countSolutions(puzzle.givens, size), 1);
      assert.equal(getConflicts(puzzle.givens, size).length, 0);
      assert.ok(puzzle.givens.includes(-1));
      assert.ok(puzzle.givens.some(v => v !== -1));
      puzzle.givens.forEach((v, i) => { if (v !== -1) assert.equal(v, puzzle.solution[i]); });
    }
  });
}

test('empty boards have multiple solutions, while invalid boards have none', () => {
  assert.equal(countSolutions(Array<Cell>(16).fill(-1), 4), 2);
  assert.equal(countSolutions(Array<Cell>(16).fill(0), 4), 0);
  assert.equal(isSolved(Array<Cell>(16).fill(-1), 4), false);
  assert.equal(isSolved([] , 4), false);
  assert.equal(isSolved(Array<Cell>(16), 4), false);
});

test('generation varies by seed and inspection does not mutate a board', () => {
  const first = generatePuzzle(8, 'first');
  const second = generatePuzzle(8, 'second');
  assert.notDeepEqual(first.givens, second.givens);
  const before = [...first.givens];
  countSolutions(first.givens, first.size);
  getHint(first.givens, first);
  getConflicts(first.givens, first.size);
  assert.deepEqual(first.givens, before);
});

test('conflicts include horizontal and vertical triples and excess bits', () => {
  const board = Array<Cell>(36).fill(-1);
  board[0] = board[1] = board[2] = 0;
  assert.deepEqual(getConflicts(board, 6), [0, 1, 2]);
  board[0] = board[6] = board[12] = 1;
  assert.deepEqual(getConflicts(board, 6), [0, 6, 12]);
  const excess = Array<Cell>(36).fill(-1);
  [0, 1, 3, 4].forEach(i => { excess[i] = 0; });
  assert.deepEqual(getConflicts(excess, 6), [0, 1, 3, 4]);
});

test('duplicate complete rows and columns are rejected', () => {
  const board: Cell[] = [0, 0, 1, 1, 0, 0, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1];
  assert.deepEqual(getConflicts(board, 4), [0, 1, 2, 3, 4, 5, 6, 7]);
  const transposed = board.map((_, i) => board[(i % 4) * 4 + Math.floor(i / 4)]);
  assert.equal(getConflicts(transposed, 4).length, 8);
});

test('hints fill editable cells, correct mistakes, and stop on completion', () => {
  const puzzle = generatePuzzle(6, 'hint');
  const hint = getHint(puzzle.givens, puzzle)!;
  assert.equal(puzzle.givens[hint.index], -1);
  assert.equal(hint.value, puzzle.solution[hint.index]);
  assert.ok(hint.reason.length > 20);
  const mistaken = [...puzzle.givens];
  mistaken[hint.index] = hint.value === 0 ? 1 : 0;
  assert.equal(getHint(mistaken, puzzle)!.index, hint.index);
  assert.equal(getHint(puzzle.solution, puzzle), null);
});
