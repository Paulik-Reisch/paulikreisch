import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewWorthaftEntry, saveWorthaftLists, validateListSave, assertDocumentId, assertModerationKind, type EditorDependencies } from '../../src/lib/worthaft-editor-service';

const current = { words: ['birne', 'apfel'], antiWords: ['idiot'], revision: '100:1|100:2' };
const request = { ...current, acknowledgeSchedule: false };
function harness() {
  const calls: string[] = [];
  const deps: EditorDependencies = {
    authorize: async () => { calls.push('authorize'); return { id: 'admin' }; },
    commitLists: async () => { calls.push('commit'); return current; },
    expireLists: () => { calls.push('expire'); },
    markReviewed: async () => { calls.push('review'); },
  };
  return { calls, deps };
}

test('unauthenticated save and review cannot touch repository or cache', async () => {
  const { deps, calls } = harness(); deps.authorize = async () => null;
  assert.equal((await saveWorthaftLists(request, deps)).success, false);
  assert.equal((await reviewWorthaftEntry('feedback', 'abc', '100:1', deps)).success, false);
  assert.deepEqual(calls, []);
});

test('a rejected origin/auth check never commits or expires', async () => {
  const { deps, calls } = harness(); deps.authorize = async () => { throw new Error('wrong origin'); };
  await assert.rejects(saveWorthaftLists(request, deps), /wrong origin/);
  assert.deepEqual(calls, []);
});

test('cache expires strictly after confirmed commit', async () => {
  const { deps, calls } = harness();
  assert.equal((await saveWorthaftLists(request, deps)).success, true);
  assert.deepEqual(calls, ['authorize', 'commit', 'expire']);
});

test('failed commit does not expire cache and does not expose raw server errors', async () => {
  const { deps, calls } = harness(); deps.commitLists = async () => { calls.push('commit'); throw new Error('private server details'); };
  const result = await saveWorthaftLists(request, deps);
  assert.equal(result.success, false); assert.equal(result.message.includes('private server'), false);
  assert.deepEqual(calls, ['authorize', 'commit']);
});

test('cache failure after save is reported as saved, not falsely as unsaved', async () => {
  const { deps } = harness(); deps.expireLists = () => { throw new Error('failed'); };
  const result = await saveWorthaftLists(request, deps);
  assert.equal(result.success, true); assert.equal(result.snapshot, current);
  assert.match(result.message, /Gespeichert.*nicht geleert/);
});

test('stale or missing revision is rejected before candidate use', () => {
  assert.throws(() => validateListSave(current, { ...request, revision: '99:1|99:2' }, '2026-11-12'), /inzwischen geändert/);
  assert.throws(() => validateListSave(current, { ...request, revision: null }, '2026-11-12'), /Stand fehlt/);
});

test('solution changes require explicit acknowledgement, blocked-only edits do not', () => {
  assert.throws(() => validateListSave(current, { ...request, words: ['birne', 'apfel', 'wolke'] }, '2026-11-12'), /Tageswortfolge bestätigen/);
  assert.equal(validateListSave(current, { ...request, words: ['birne', 'apfel', 'wolke'], acknowledgeSchedule: true }, '2026-11-12').scheduleMayChange, true);
  assert.equal(validateListSave(current, { ...request, antiWords: ['idiot', 'wolke'] }, '2026-11-12').scheduleMayChange, false);
});

test('malformed, empty and oversized lists cannot be committed', () => {
  for (const words of [[], ['four'], Array(10001).fill('birne'), 'birne']) {
    assert.throws(() => validateListSave(current, { ...request, words, acknowledgeSchedule: true }, '2026-11-12'));
  }
});

test('review requires constrained collection, document ID and version', async () => {
  for (const [kind, id, rev] of [['users', 'abc', '100:1'], ['feedback', '../secret', '100:1'], ['suggestions', 'abc', 'bad']]) {
    const { deps, calls } = harness();
    assert.equal((await reviewWorthaftEntry(kind, id, rev, deps)).success, false);
    assert.deepEqual(calls, ['authorize']);
  }
});

test('valid review changes no word list or cache', async () => {
  const { deps, calls } = harness();
  const result = await reviewWorthaftEntry('feedback', 'Abc_123', '100:1', deps);
  assert.equal(result.success, true);
  assert.deepEqual(calls, ['authorize', 'review']);
});

test('collection/path traversal and ID surprises are rejected', () => {
  for (const id of ['a/b', '.', '..', '', 'a?x', 'x'.repeat(151)]) assert.throws(() => assertDocumentId(id));
  assert.throws(() => assertModerationKind('__proto__'));
});
