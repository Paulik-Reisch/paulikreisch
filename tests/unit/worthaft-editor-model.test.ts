import test from 'node:test';
import assert from 'node:assert/strict';
import { previewWorthaftListEdit, worthaftEditorSnapshotMatches } from '../../src/lib/worthaft-editor-model';

const original = { words: ['birne', 'apfel', 'fähre'], antiWords: ['idiot'] };
const date = '2026-11-12';

test('unchanged arrays are a no-op; inputs are not mutated', () => {
  const snapshot = JSON.stringify(original);
  const result = previewWorthaftListEdit(original, original, date);
  assert.equal(result.changed, false);
  assert.equal(result.scheduleMayChange, false);
  assert.equal(JSON.stringify(original), snapshot);
});

test('normalizes NFC and case without sorting the list', () => {
  const result = previewWorthaftListEdit(original, { words: [' FA\u0308HRE ', ' BIRNE ', 'APFEL'], antiWords: ['IDIOT'] }, date);
  assert.deepEqual(result.normalized.words, ['fähre', 'birne', 'apfel']);
  assert.equal(result.wordChanges.orderChanged, true);
  assert.equal(result.scheduleMayChange, true);
});

test('appending warns about schedule even if a derived answer happens to match', () => {
  const result = previewWorthaftListEdit(original, { ...original, words: [...original.words, 'wolke'] }, date);
  assert.deepEqual(result.wordChanges.added, ['wolke']);
  assert.equal(result.scheduleMayChange, true);
});

test('blocked-only edit does not flag answer scheduling', () => {
  const result = previewWorthaftListEdit(original, { ...original, antiWords: ['idiot', 'wolke'] }, date);
  assert.equal(result.changed, true);
  assert.equal(result.scheduleMayChange, false);
  assert.equal(result.derivedAnswerChanges, false);
});

test('reports duplicates without silently removing them', () => {
  const result = previewWorthaftListEdit(original, { ...original, words: ['birne', 'apfel', 'birne'] }, date);
  assert.deepEqual(result.wordChanges.duplicates, ['birne']);
  assert.deepEqual(result.normalized.words, ['birne', 'apfel', 'birne']);
  assert.deepEqual(result.wordChanges.removed, ['fähre']);
});

test('reports a word that is simultaneously an answer and blocked', () => {
  const result = previewWorthaftListEdit(original, { ...original, antiWords: ['birne'] }, date);
  assert.deepEqual(result.overlap, ['birne']);
});

test('rejects empty lists, invalid entries and non-German five-letter inputs', () => {
  for (const words of [[], ['four'], ['12345'], ['<svg>'], [2], null]) {
    assert.throws(() => previewWorthaftListEdit(original, { ...original, words }, date));
  }
  assert.throws(() => previewWorthaftListEdit(original, { ...original, antiWords: [] }, date));
});

test('rejects malformed and impossible dates', () => {
  for (const invalid of ['2026-02-30', '2026-13-01', '2026-1-1', 'no']) {
    assert.throws(() => previewWorthaftListEdit(original, original, invalid));
  }
});

test('snapshot check detects concurrent reorder and blocked-list change', () => {
  assert.equal(worthaftEditorSnapshotMatches(original, structuredClone(original)), true);
  assert.equal(worthaftEditorSnapshotMatches(original, { ...original, words: [...original.words].reverse() }), false);
  assert.equal(worthaftEditorSnapshotMatches(original, { ...original, antiWords: ['birne'] }), false);
});
