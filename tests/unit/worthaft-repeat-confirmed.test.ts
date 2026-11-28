import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getConfirmedWorthaftLetters,
  getFirstEmptyWorthaftIndex,
  mergeConfirmedWorthaftLetters,
} from '../../src/lib/worthaft-game-state';
import { DEFAULT_WORTHAFT_SETTINGS, normalizeWorthaftSettings } from '../../src/lib/worthaft-settings';

const guesses = [
  { guess: 'REGEL', statuses: ['present', 'absent', 'correct', 'correct', 'absent'] },
  { guess: 'TIGER', statuses: ['absent', 'absent', 'correct', 'present', 'absent'] },
  { guess: 'BAGEL', statuses: ['correct', 'absent', 'correct', 'correct', 'absent'] },
];

test('confirmed letters from all guesses sit at their positions', () => {
  assert.deepEqual(getConfirmedWorthaftLetters(guesses, 5), ['B', '', 'G', 'E', '']);
});

test('no guesses means nothing confirmed', () => {
  assert.deepEqual(getConfirmedWorthaftLetters([], 5), ['', '', '', '', '']);
});

test('merge keeps typed letters and fills empty cells only', () => {
  assert.deepEqual(
    mergeConfirmedWorthaftLetters(['', 'X', '', '', 'Z'], ['B', '', 'G', 'E', '']),
    ['B', 'X', 'G', 'E', 'Z'],
  );
  assert.deepEqual(
    mergeConfirmedWorthaftLetters(['Q', '', '', '', ''], ['B', '', 'G', 'E', '']),
    ['Q', '', 'G', 'E', ''],
  );
});

test('first empty index falls back to the last cell when the row is full', () => {
  assert.equal(getFirstEmptyWorthaftIndex(['B', 'A', '', 'E', '']), 2);
  assert.equal(getFirstEmptyWorthaftIndex(['B', 'A', 'G', 'E', 'L']), 4);
});

test('repeat setting defaults to off and normalizes only booleans', () => {
  assert.equal(DEFAULT_WORTHAFT_SETTINGS.repeatConfirmedLetters, false);
  assert.equal(normalizeWorthaftSettings({}).repeatConfirmedLetters, false);
  assert.equal(normalizeWorthaftSettings({ repeatConfirmedLetters: true }).repeatConfirmedLetters, true);
  assert.equal(normalizeWorthaftSettings({ repeatConfirmedLetters: 'yes' }).repeatConfirmedLetters, false);
});
