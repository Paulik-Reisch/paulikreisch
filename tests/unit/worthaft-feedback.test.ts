import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorthaftVoteDescription } from '../../src/lib/worthaft-feedback';

test('describes a positive Worthaft vote as good', () => {
  assert.equal(getWorthaftVoteDescription('up'), 'gut');
});

test('describes a negative Worthaft vote as not good', () => {
  assert.equal(getWorthaftVoteDescription('down'), 'nicht gut');
});
