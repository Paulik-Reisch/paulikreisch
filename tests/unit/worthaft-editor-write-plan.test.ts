import test from 'node:test';
import assert from 'node:assert/strict';
import { planWorthaftListWrite } from '../../src/lib/worthaft-editor-write-plan';
const current = { words: ['birne', 'apfel'], antiWords: ['idiot'], revision: '100:1|100:2' };
const request = { ...current, acknowledgeSchedule: true };

test('no-op transaction plan writes neither list nor audit', () => {
  assert.deepEqual(planWorthaftListWrite(current, request, '2026-11-12', 'admin'), { words: null, antiWords: null, audit: null });
});
test('blocked-only plan cannot write the solutions list', () => {
  const plan = planWorthaftListWrite(current, { ...request, antiWords: ['idiot', 'wolke'] }, '2026-11-12', 'admin');
  assert.equal(plan.words, null); assert.deepEqual(plan.antiWords, ['idiot', 'wolke']);
  assert.equal(plan.audit?.user, 'admin');
});
test('solution-only plan preserves duplicates/order and leaves blocked list untouched', () => {
  const plan = planWorthaftListWrite(current, { ...request, words: ['apfel', 'birne', 'apfel'] }, '2026-11-12', 'admin');
  assert.deepEqual(plan.words, ['apfel', 'birne', 'apfel']); assert.equal(plan.antiWords, null);
});
test('combined plan changes both lists only after valid revision and schedule acknowledgement', () => {
  const both = { ...request, words: ['wolke'], antiWords: ['idiot', 'birne'] };
  const plan = planWorthaftListWrite(current, both, '2026-11-12', 'admin');
  assert.deepEqual(plan.words, ['wolke']); assert.deepEqual(plan.antiWords, ['idiot', 'birne']);
  assert.throws(() => planWorthaftListWrite(current, { ...both, revision: '99:1|100:2' }, '2026-11-12', 'admin'));
  assert.throws(() => planWorthaftListWrite(current, { ...both, acknowledgeSchedule: false }, '2026-11-12', 'admin'));
});
