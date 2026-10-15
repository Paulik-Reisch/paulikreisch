import test from 'node:test';
import assert from 'node:assert/strict';
import { canInteractWithWorthaftGame } from '../../src/lib/worthaft-game-state';

test('allows interaction while a Worthaft game is in progress', () => {
  assert.equal(canInteractWithWorthaftGame('playing'), true);
});

test('disables interaction after a Worthaft game is won or lost', () => {
  assert.equal(canInteractWithWorthaftGame('won'), false);
  assert.equal(canInteractWithWorthaftGame('lost'), false);
});
