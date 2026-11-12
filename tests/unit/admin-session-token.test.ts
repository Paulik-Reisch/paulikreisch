import assert from 'node:assert/strict';
import test from 'node:test';
import { SignJWT } from 'jose';
import { encodeAdminSession, decodeAdminSession } from '../../src/lib/admin-session-token';

const testKey = new TextEncoder().encode('unit-test-fixture-not-a-real-session-secret');
const fixedDate = new Date('2026-11-12T12:00:00Z');

test('admin session has the exact admin audience and roundtrips', async () => {
  const token = await encodeAdminSession({ user: { id: 'fixture-admin' } }, testKey, fixedDate);
  const payload = await decodeAdminSession(token, testKey, fixedDate);
  assert.equal(payload?.aud, 'admin.paulikreisch.de');
  assert.deepEqual(payload?.user, { id: 'fixture-admin' });
});
test('legacy JWT without an audience is rejected', async () => {
  const token = await new SignJWT({ user: { id: 'fixture-admin' } }).setProtectedHeader({ alg: 'HS256' }).sign(testKey);
  assert.equal(await decodeAdminSession(token, testKey, fixedDate), null);
});
test('JWT for public hostname is rejected', async () => {
  const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setAudience('paulikreisch.de').sign(testKey);
  assert.equal(await decodeAdminSession(token, testKey, fixedDate), null);
});
test('admin session expires after 24 hours', async () => {
  const token = await encodeAdminSession({}, testKey, fixedDate);
  assert.equal(await decodeAdminSession(token, testKey, new Date('2026-11-13T12:00:00Z')), null);
});
test('malformed session credential is unauthenticated', async () => {
  assert.equal(await decodeAdminSession('not-a-jwt', testKey, fixedDate), null);
});

test('session signed by a different key is rejected', async () => {
  const otherKey = new TextEncoder().encode('different-unit-test-fixture-key-not-a-real-secret');
  const token = await encodeAdminSession({}, otherKey, fixedDate);
  assert.equal(await decodeAdminSession(token, testKey, fixedDate), null);
});
test('tampered session signature is rejected', async () => {
  const token = await encodeAdminSession({}, testKey, fixedDate);
  const [header, payload, signature] = token.split('.');
  const tampered = `${header}.${payload}.${signature[0] === 'A' ? 'B' : 'A'}${signature.slice(1)}`;
  assert.equal(await decodeAdminSession(tampered, testKey, fixedDate), null);
});
