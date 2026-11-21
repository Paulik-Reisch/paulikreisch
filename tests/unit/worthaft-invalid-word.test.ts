import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInvalidWorthaftWord,
  getInvalidWordVoteAction,
} from '../../src/lib/worthaft-invalid-word';

test('keeps the submitted word with its anti-word status for the invalid-word popup', () => {
  assert.deepEqual(createInvalidWorthaftWord('PUTOS', true), {
    word: 'PUTOS',
    isKnownInvalid: true,
  });
});

test('does not create an invalid-word popup submission without a word', () => {
  assert.equal(createInvalidWorthaftWord('', false), null);
  assert.equal(createInvalidWorthaftWord('   ', false), null);
});

test('anti-word Yes shows the reviewed message instead of submitting a suggestion', () => {
  assert.equal(getInvalidWordVoteAction(true, true), 'show-reviewed-message');
});

test('anti-word No dismisses without submitting a suggestion', () => {
  assert.equal(getInvalidWordVoteAction(true, false), 'dismiss');
});

test('unlisted invalid words submit only an explicit Yes', () => {
  assert.equal(getInvalidWordVoteAction(false, true), 'submit');
  assert.equal(getInvalidWordVoteAction(false, false), 'dismiss');
});

test('No never submits a suggestion, for listed or unlisted words', () => {
  assert.equal(getInvalidWordVoteAction(true, false), 'dismiss');
  assert.equal(getInvalidWordVoteAction(false, false), 'dismiss');
});
