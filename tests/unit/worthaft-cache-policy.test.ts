import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORTHAFT_WORD_LISTS_REVALIDATE_SECONDS,
  buildWorthaftDailyData,
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
