import test from 'node:test';
import assert from 'node:assert/strict';
import { isWorthaftAntiWord, WORTHAFT_ANTI_WORDS } from '../../src/lib/worthaft-anti-words';

test('classifies every configured Worthaft anti-word', () => {
  assert.ok(WORTHAFT_ANTI_WORDS.length > 0);
  for (const word of WORTHAFT_ANTI_WORDS) {
    assert.equal(isWorthaftAntiWord(word), true, `${word} must be recognized as an anti-word`);
  }
  assert.equal(isWorthaftAntiWord('falsch'), false);
});

test('matches configured anti-words case-insensitively and ignores surrounding whitespace', () => {
  assert.equal(isWorthaftAntiWord(' FALSCH ', ['falsch']), true);
});

test('does not classify words that are not in the anti-word list', () => {
  assert.equal(isWorthaftAntiWord('richtig', ['falsch']), false);
});
