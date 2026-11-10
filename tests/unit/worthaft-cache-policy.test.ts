import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORTHAFT_WORD_LISTS_REVALIDATE_SECONDS,
  buildWorthaftDailyData,
  createDailyWordPin,
} from '../../src/lib/worthaft-cache-policy';

const lists = { words: ['alpha', 'bravo', 'delta'], antiWords: ['zzzzz'] };

test('word lists are cached for seven days', () => {
  assert.equal(WORTHAFT_WORD_LISTS_REVALIDATE_SECONDS, 604800);
});

test('the daily word follows the date while the same lists are reused', () => {
  const first = buildWorthaftDailyData(lists, '2024-01-01');
  const second = buildWorthaftDailyData(lists, '2024-01-02');
  const wrapped = buildWorthaftDailyData(lists, '2024-01-04');

  assert.equal(first.word, 'ALPHA');
  assert.equal(second.word, 'BRAVO');
  assert.equal(wrapped.word, 'ALPHA');
  assert.equal(first.words, second.words);
  assert.equal(first.antiWords, lists.antiWords);
  assert.equal(first.usedBundledFallback, false);
});

test('the fallback flag is passed through', () => {
  assert.equal(buildWorthaftDailyData(lists, '2024-01-01', true).usedBundledFallback, true);
});

test('an empty word list is rejected', () => {
  assert.throws(() => buildWorthaftDailyData({ words: [], antiWords: [] }, '2024-01-01'));
});

test('the pinned word of a date does not change when the lists change', () => {
  const pin = createDailyWordPin();
  const before = buildWorthaftDailyData(lists, '2024-01-02', false, pin);
  const changed = { words: ['omega', 'sigma', 'theta', 'kappa'], antiWords: [] };
  const after = buildWorthaftDailyData(changed, '2024-01-02', false, pin);

  assert.equal(before.word, 'BRAVO');
  assert.equal(after.word, 'BRAVO');
  assert.deepEqual(after.words, changed.words);
});

test('a new date picks again from the current lists', () => {
  const pin = createDailyWordPin();
  buildWorthaftDailyData(lists, '2024-01-02', false, pin);
  const next = buildWorthaftDailyData({ words: ['omega', 'sigma', 'theta'], antiWords: [] }, '2024-01-03', false, pin);

  assert.equal(next.word, 'THETA');
});
