import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorthaftVoteDescription, hasWorthaftFeedbackDecision } from '../../src/lib/worthaft-feedback';

test('describes a positive Worthaft vote as good', () => {
  assert.equal(getWorthaftVoteDescription('up'), 'gut');
});

test('describes a negative Worthaft vote as not good', () => {
  assert.equal(getWorthaftVoteDescription('down'), 'nicht gut');
});

test('remembers submitted and skipped feedback separately for the current day', () => {
  const date = '2026-10-18';
  for (const decision of ['true', 'skipped']) {
    const storage = { getItem: (key: string) => key === `worthaft-feedback-${date}` ? decision : null };
    assert.equal(hasWorthaftFeedbackDecision(storage, date), true);
    assert.equal(hasWorthaftFeedbackDecision(storage, '2026-10-19'), false);
  }
  for (const value of [null, 'false', 'up', 'down']) {
    assert.equal(hasWorthaftFeedbackDecision({ getItem: () => value }, date), false);
  }
  assert.equal(hasWorthaftFeedbackDecision({ getItem: () => { throw new Error('Storage unavailable'); } }, date), false);
});
