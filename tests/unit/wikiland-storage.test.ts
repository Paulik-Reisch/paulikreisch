import test from 'node:test';
import assert from 'node:assert/strict';
import { applyHint, createGame, normalizeWord, type WikiGame } from '../../src/lib/wikiland-engine';
import { clearWikiGame, loadWikiGame, parseWikiGame, saveWikiGame, serializeWikiGame, WIKI_COOKIE } from '../../src/lib/wikiland-storage';

function saved(): WikiGame { return createGame('daily', '2026-11-01'); }
function miss(index: number): string {
  let letters = '';
  do { letters = String.fromCharCode(97 + index % 26) + letters; index = Math.floor(index / 26) - 1; } while (index >= 0);
  return `unbekannt${letters}`;
}

function withCookies(callback: (jar: Map<string, string>, writes: string[]) => void): void {
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const oldLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
  const jar = new Map<string, string>(), writes: string[] = [];
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    get cookie() { return [...jar].map(([key, value]) => `${key}=${value}`).join('; '); },
    set cookie(cookie: string) {
      writes.push(cookie);
      const [entry] = cookie.split(';');
      const separator = entry.indexOf('=');
      const name = entry.slice(0, separator), value = entry.slice(separator + 1);
      if (cookie.includes('Max-Age=0')) jar.delete(name); else jar.set(name, value);
    },
  } });
  Object.defineProperty(globalThis, 'location', { configurable: true, value: { protocol: 'https:' } });
  try { callback(jar, writes); } finally {
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else Reflect.deleteProperty(globalThis, 'document');
    if (oldLocation) Object.defineProperty(globalThis, 'location', oldLocation); else Reflect.deleteProperty(globalThis, 'location');
  }
}

test('compact serialization roundtrips guesses, hints and timing', () => {
  const state = applyHint(saved());
  state.elapsed = 125;
  state.guesses = ['unbekannt'];
  assert.deepEqual(parseWikiGame(serializeWikiGame(state)), state);
});

test('chunked cookies preserve 500 normal guesses within four bounded scoped cookies', () => {
  withCookies((jar, writes) => {
    const state = saved();
    state.guesses = Array.from({ length: 500 }, (_, index) => miss(index));
    assert.equal(saveWikiGame(state), true);
    assert.deepEqual(loadWikiGame(), state);
    assert.ok(jar.size <= 4 && jar.size > 1);
    for (const value of jar.values()) assert.ok(value.length <= 3500);
    for (const value of writes) assert.match(value, /Path=\/game-labs\/wikiland; Max-Age=\d+; SameSite=Lax; Secure/);
    clearWikiGame();
    assert.equal(jar.size, 0);
    assert.equal(loadWikiGame(), null);
  });
});

test('partial, mixed and corrupted cookie chunks cannot be restored', () => {
  withCookies(jar => {
    const state = saved();
    state.guesses = Array.from({ length: 500 }, (_, index) => miss(index));
    assert.equal(saveWikiGame(state), true);
    const name = `${WIKI_COOKIE}_1`;
    const original = jar.get(name)!;
    jar.delete(name);
    assert.equal(loadWikiGame(), null);
    jar.set(name, original.replace(/^./, original[0] === 'a' ? 'b' : 'a'));
    assert.equal(loadWikiGame(), null);
    jar.set(name, `${original.slice(0, -1)}${original.endsWith('A') ? 'B' : 'A'}`);
    assert.equal(loadWikiGame(), null);
    jar.set(name, original);
    assert.deepEqual(loadWikiGame(), state);
  });
});

test('oversized saves fail without overwriting the previous cookie', () => {
  withCookies(jar => {
    const state = saved();
    assert.equal(saveWikiGame(state), true);
    const original = [...jar];
    const large = { ...state, guesses: Array.from({ length: 2000 }, (_, index) => miss(index)) };
    assert.equal(saveWikiGame(large), false);
    assert.deepEqual([...jar], original);
    assert.equal(parseWikiGame(serializeWikiGame(large)), null);
  });
});

test('malformed state and invalid dates, identities and duplicate guesses are rejected', () => {
  for (const raw of ['', '{}', '%', 'a'.repeat(15000)]) assert.equal(parseWikiGame(raw), null);
  const state = saved();
  for (const patch of [
    { version: 2 }, { puzzleId: 'missing' }, { date: '2026-02-30' }, { elapsed: -1 },
    { elapsed: 0.5 }, { givenUp: 'false' }, { guesses: ['Duplikat', 'duplikat'] },
    { guesses: ['unbekannt', 'unbekannt'] }, { guesses: ['die'] }, { hints: ['unbekannteswort'] },
    { guesses: ['<script>'] }, { guesses: ['a'.repeat(81)] },
  ]) {
    assert.equal(parseWikiGame(serializeWikiGame({ ...state, ...patch } as WikiGame)), null, JSON.stringify(patch));
  }
  assert.equal(normalizeWord('Äpfel'), 'aepfel');
});
