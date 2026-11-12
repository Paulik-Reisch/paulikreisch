import assert from 'node:assert/strict';
import test from 'node:test';
import { completeLogout } from '../../src/lib/complete-logout';

test('logout clears Firebase state before revoking server session', async () => {
  const events: string[] = [];
  await completeLogout(async () => { events.push('firebase'); }, async () => { events.push('server'); });
  assert.deepEqual(events, ['firebase', 'server']);
});
test('failed Firebase signout does not pretend server logout succeeded', async () => {
  let serverCalled = false;
  await assert.rejects(completeLogout(async () => { throw new Error('client failed'); }, async () => { serverCalled = true; }), /client failed/);
  assert.equal(serverCalled, false);
});
test('server logout failure remains visible after Firebase signout', async () => {
  await assert.rejects(completeLogout(async () => {}, async () => { throw new Error('server failed'); }), /server failed/);
});
