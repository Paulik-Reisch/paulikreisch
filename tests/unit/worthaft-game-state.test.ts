import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canInteractWithWorthaftGame,
  clearWorthaftRowStart,
  createWorthaftRowTimer,
  getWorthaftRowElapsed,
  pauseWorthaftRowTimer,
  readWorthaftRowTimer,
  resumeWorthaftRowTimer,
  WORTHAFT_ROW_START_KEY,
  writeWorthaftRowTimer,
} from '../../src/lib/worthaft-game-state';

test('allows interaction while a Worthaft game is in progress', () => {
  assert.equal(canInteractWithWorthaftGame('playing'), true);
});

test('disables interaction after a Worthaft game is won or lost', () => {
  assert.equal(canInteractWithWorthaftGame('won'), false);
  assert.equal(canInteractWithWorthaftGame('lost'), false);
});

const createFakeStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => { map.set(key, value); },
    removeItem: (key: string) => { map.delete(key); },
  };
};

test('active row time includes visible thinking time', () => {
  const timer = createWorthaftRowTimer(1_000);
  assert.equal(getWorthaftRowElapsed(timer, 6_000), 5_000);
});

test('hidden time is excluded and resuming does not double count', () => {
  const running = createWorthaftRowTimer(1_000);
  const paused = pauseWorthaftRowTimer(running, 6_000);
  assert.deepEqual(paused, { elapsedMs: 5_000, startedAt: null });
  assert.deepEqual(pauseWorthaftRowTimer(paused, 20_000), paused);
  assert.equal(getWorthaftRowElapsed(paused, 7_205_000), 5_000);

  const resumed = resumeWorthaftRowTimer(paused, 7_205_000);
  assert.deepEqual(resumeWorthaftRowTimer(resumed, 7_210_000), resumed);
  assert.equal(getWorthaftRowElapsed(resumed, 7_210_000), 10_000);
});

test('only active elapsed time roundtrips through storage', () => {
  const storage = createFakeStorage();
  writeWorthaftRowTimer(storage, '2026-10-16', 5_000);
  assert.equal(readWorthaftRowTimer(storage, '2026-10-16'), 5_000);

  const afterReload = createWorthaftRowTimer(7_205_000, readWorthaftRowTimer(storage, '2026-10-16')!);
  assert.equal(getWorthaftRowElapsed(afterReload, 7_210_000), 10_000);
});

test('row timer from another day is ignored', () => {
  const storage = createFakeStorage();
  writeWorthaftRowTimer(storage, '2026-10-15', 5_000);
  assert.equal(readWorthaftRowTimer(storage, '2026-10-16'), null);
});

test('missing, malformed and legacy wall-clock starts return null', () => {
  const storage = createFakeStorage();
  assert.equal(readWorthaftRowTimer(storage, '2026-10-16'), null);
  storage.setItem(WORTHAFT_ROW_START_KEY, 'not-a-timestamp');
  assert.equal(readWorthaftRowTimer(storage, '2026-10-16'), null);
  storage.setItem(WORTHAFT_ROW_START_KEY, '2026-10-16:1729080000000');
  assert.equal(readWorthaftRowTimer(storage, '2026-10-16'), null);
  storage.setItem(WORTHAFT_ROW_START_KEY, JSON.stringify({ version: 1, date: '2026-10-16', elapsedMs: -1 }));
  assert.equal(readWorthaftRowTimer(storage, '2026-10-16'), null);
});

test('clearing removes the persisted row timer', () => {
  const storage = createFakeStorage();
  writeWorthaftRowTimer(storage, '2026-10-16', 5_000);
  clearWorthaftRowStart(storage);
  assert.equal(readWorthaftRowTimer(storage, '2026-10-16'), null);
});
