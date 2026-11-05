import test from 'node:test';
import assert from 'node:assert/strict';
import { WORTHAFT_ANTI_WORDS } from '../../src/lib/worthaft-anti-words';
import { parseWorthaftWordList } from '../../src/lib/worthaft-word-lists';
import { WORDS } from '../../src/lib/worthaft-words';

test('accepts and preserves the order of the bundled word lists', () => {
  assert.deepEqual(parseWorthaftWordList(WORDS, 'words'), WORDS);
  assert.deepEqual(parseWorthaftWordList(WORTHAFT_ANTI_WORDS, 'anti-words'), WORTHAFT_ANTI_WORDS);
});

test('normalizes valid words and rejects malformed Firestore list data', () => {
  assert.deepEqual(parseWorthaftWordList([' BIRNE ', 'FA\u0308HRE'], 'words'), ['birne', 'fähre']);
  assert.throws(() => parseWorthaftWordList([], 'words'), /non-empty array/);
  assert.throws(() => parseWorthaftWordList(['birne', 5], 'words'), /invalid entry/);
  assert.throws(() => parseWorthaftWordList(['not-a-word'], 'words'), /invalid word/);
});
