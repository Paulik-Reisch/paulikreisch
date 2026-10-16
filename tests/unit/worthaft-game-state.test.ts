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

import { readWorthaftRowStart, writeWorthaftRowStart, clearWorthaftRowStart, WORTHAFT_ROW_START_KEY } from '../../src/lib/worthaft-game-state';

const createFakeStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => { map.set(key, value); },
    removeItem: (key: string) => { map.delete(key); },
  };
};

test('row start roundtrips through storage', () => {
  const storage = createFakeStorage();
  writeWorthaftRowStart(storage, '2026-10-16', 1729080000000);
  assert.equal(readWorthaftRowStart(storage, '2026-10-16'), 1729080000000);
});

test('row start from another day is ignored', () => {
  const storage = createFakeStorage();
  writeWorthaftRowStart(storage, '2026-10-15', 1729080000000);
  assert.equal(readWorthaftRowStart(storage, '2026-10-16'), null);
});

test('missing or malformed row start returns null', () => {
  const storage = createFakeStorage();
  assert.equal(readWorthaftRowStart(storage, '2026-10-16'), null);
  storage.setItem(WORTHAFT_ROW_START_KEY, 'not-a-timestamp');
  assert.equal(readWorthaftRowStart(storage, '2026-10-16'), null);
  storage.setItem(WORTHAFT_ROW_START_KEY, '2026-10-16:abc');
  assert.equal(readWorthaftRowStart(storage, '2026-10-16'), null);
  storage.setItem(WORTHAFT_ROW_START_KEY, '2026-10-16:0');
  assert.equal(readWorthaftRowStart(storage, '2026-10-16'), null);
});

test('clearing removes the persisted row start', () => {
  const storage = createFakeStorage();
  writeWorthaftRowStart(storage, '2026-10-16', 1729080000000);
  clearWorthaftRowStart(storage);
  assert.equal(readWorthaftRowStart(storage, '2026-10-16'), null);
});
