import assert from 'node:assert/strict';
import test from 'node:test';
import { ADMIN_HOST, isAdminPath, isLoginPath, isSameOrigin, normalizeHost, requestHost } from '../../src/lib/admin-host-policy';

test('comma-separated forwarded authorities are rejected', () => {
  assert.equal(requestHost(new Headers({host:'backend.run.app','x-forwarded-host':'admin.paulikreisch.de, attacker.invalid'})), null);
});
test('conflicting public and forwarded admin authorities are rejected', () => {
  assert.equal(requestHost(new Headers({host:'paulikreisch.de','x-forwarded-host':ADMIN_HOST})), null);
});
test('Firebase backend can forward the exact admin authority', () => {
  assert.equal(requestHost(new Headers({host:'backend.run.app','x-forwarded-host':ADMIN_HOST})), ADMIN_HOST);
});
test('unrecognized forwarded authority never becomes the request host', () => {
  assert.equal(requestHost(new Headers({host:'backend.run.app','x-forwarded-host':'attacker.invalid'})), null);
});
test('hostname suffix impersonation does not match admin', () => {
  assert.notEqual(normalizeHost('admin.paulikreisch.de.attacker.invalid'), ADMIN_HOST);
});
test('admin-like public paths are not admin routes', () => {
  assert.equal(isAdminPath('/administrator'), false);
});
test('login-like public paths are not login routes', () => {
  assert.equal(isLoginPath('/login-help'), false);
});
test('admin subroutes containing file extensions remain admin routes', () => {
  assert.equal(isAdminPath('/admin/export.csv'), true);
});
test('same-site apex origin cannot submit admin actions', () => {
  assert.equal(isSameOrigin('https://paulikreisch.de', ADMIN_HOST, true), false);
});
test('insecure origin cannot submit production admin actions', () => {
  assert.equal(isSameOrigin('http://admin.paulikreisch.de', ADMIN_HOST, true), false);
});
test('exact HTTPS admin origin can submit admin actions', () => {
  assert.equal(isSameOrigin('https://admin.paulikreisch.de', ADMIN_HOST, true), true);
});
