import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePuzzle, type Cell } from '../../src/lib/bits-engine';
import { parseBitsState, serializeBitsState, type SavedBits } from '../../src/lib/bits-storage';

function saved(): SavedBits {
  const puzzle = generatePuzzle(8, 'cookie-test');
  return { version: 1, puzzle, board: [...puzzle.givens], elapsed: 42, hints: 0, history: [], completed: false };
}

test('cookie roundtrip preserves puzzle, board, time and undo within cookie budget', () => {
  const state = saved();
  state.history = Array.from({ length: 20 }, () => [...state.board]);
  const encoded = serializeBitsState(state);
  assert.ok(encoded.length < 3800);
  assert.deepEqual(parseBitsState(encoded), state);
});

test('serialization bounds undo history to twenty entries', () => {
  const state = saved();
  state.history = Array.from({ length: 100 }, () => [...state.board]);
  assert.equal(parseBitsState(serializeBitsState(state))?.history.length, 20);
});

test('malformed, oversized and inconsistent cookies are safely rejected', () => {
  for (const raw of ['', '%', 'null', '{}', 'x'.repeat(4000)]) assert.equal(parseBitsState(raw), null);
  const base = JSON.parse(decodeURIComponent(serializeBitsState(saved())));
  for (const patch of [
    { n: 10 }, { v: 2 }, { t: -1 }, { h: 1.5 }, { c: true },
    { s: '0'.repeat(64) }, { b: 'x'.repeat(64) }, { u: ['...'] },
    { id: 'a'.repeat(121) }, { b: '.'.repeat(64) },
  ]) assert.equal(parseBitsState(encodeURIComponent(JSON.stringify({ ...base, ...patch }))), null);
});

test('legitimate wrong moves survive resume; locked clues cannot be edited', () => {
  const state = saved();
  const editable = state.board.indexOf(-1);
  state.board[editable] = (1 - state.puzzle.solution[editable]) as Cell;
  assert.deepEqual(parseBitsState(serializeBitsState(state)), state);
  const locked = state.puzzle.givens.findIndex(value => value !== -1);
  state.board[locked] = -1;
  assert.equal(parseBitsState(serializeBitsState(state)), null);
});

test('finished game roundtrip is validated by rules', () => {
  const state = saved();
  state.board = [...state.puzzle.solution];
  state.completed = true;
  assert.deepEqual(parseBitsState(serializeBitsState(state)), state);
});
