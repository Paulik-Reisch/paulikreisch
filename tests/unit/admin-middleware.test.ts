import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import { middleware } from '../../src/middleware';

function request(path: string, host = 'admin.paulikreisch.de', method = 'GET', origin?: string) {
  return new NextRequest(`https://${host}${path}`, { method, headers: {
    host,
    ...(origin ? { origin } : {}),
  } });
}

test('admin login stays on admin host instead of canonicalizing to apex', () => {
  const response = middleware(request('/login'));
  assert.equal(response.headers.get('location'), null);
});
test('admin root enters dashboard without a host redirect loop', () => {
  assert.equal(middleware(request('/')).headers.get('x-middleware-rewrite'), 'https://admin.paulikreisch.de/admin/authors');
});
test('public login redirects to the same path on admin', () => {
  assert.equal(middleware(request('/login', 'paulikreisch.de')).headers.get('location'), 'https://admin.paulikreisch.de/login');
});
test('public admin deep link preserves its query', () => {
  assert.equal(middleware(request('/admin/lp/edit?slug=book', 'paulikreisch.de')).headers.get('location'), 'https://admin.paulikreisch.de/admin/lp/edit?slug=book');
});
test('apex action POST is rejected rather than redirected with a token body', () => {
  assert.equal(middleware(request('/login', 'paulikreisch.de', 'POST', 'https://paulikreisch.de')).status, 403);
});
test('cross-origin admin action POST is rejected', () => {
  assert.equal(middleware(request('/admin/authors', undefined, 'POST', 'https://paulikreisch.de')).status, 403);
});
test('admin action POST with no Origin is rejected', () => {
  assert.equal(middleware(request('/admin/authors', undefined, 'POST')).status, 403);
});
test('exact same-origin admin action POST passes routing', () => {
  assert.equal(middleware(request('/admin/authors', undefined, 'POST', 'https://admin.paulikreisch.de')).headers.get('x-middleware-next'), '1');
});
test('extension-bearing admin action cannot bypass Origin checking', () => {
  assert.equal(middleware(request('/admin/export.csv', undefined, 'POST', 'https://paulikreisch.de')).status, 403);
});
test('public page on admin redirects to public origin', () => {
  assert.equal(middleware(request('/shop')).headers.get('location'), 'https://paulikreisch.de/shop');
});
test('admin asset stays available and is not indexed', () => {
  const response = middleware(request('/_next/static/chunk.js'));
  assert.equal(response.headers.get('x-middleware-next'), '1');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
});
test('admin responses are never cacheable', () => {
  assert.equal(middleware(request('/login')).headers.get('cache-control'), 'private, no-store, max-age=0');
});
test('unrelated subdomain still canonicalizes to public apex', () => {
  assert.equal(middleware(request('/shop?x=1', 'dev.paulikreisch.de')).headers.get('location'), 'https://paulikreisch.de/shop?x=1');
});
test('old domain canonicalization remains intact', () => {
  assert.equal(middleware(request('/shop', 'www.paulik-reisch.de')).headers.get('location'), 'https://paulikreisch.de/shop');
});
test('public apex content remains unmodified', () => {
  assert.equal(middleware(request('/worthaft', 'paulikreisch.de')).headers.get('x-middleware-next'), '1');
});
test('admin-like public path is not redirected to privileged origin', () => {
  assert.equal(middleware(request('/administrator', 'paulikreisch.de')).headers.get('location'), null);
});

test('internal bookmark migrates to admin host preserving path and query', () => {
  assert.equal(middleware(request('/internal/idx/lp/editor/book?mode=edit', 'paulikreisch.de')).headers.get('location'), 'https://admin.paulikreisch.de/internal/idx/lp/editor/book?mode=edit');
});
test('internal tools remain reachable on admin host after migration', () => {
  assert.equal(middleware(request('/internal/idx/lp')).headers.get('x-middleware-next'), '1');
});
test('internal action on public host is rejected without forwarding body', () => {
  assert.equal(middleware(request('/internal/isdm/database', 'paulikreisch.de', 'POST', 'https://paulikreisch.de')).status, 403);
});
test('internal action accepts only exact admin Origin', () => {
  assert.equal(middleware(request('/internal/idx/nl', undefined, 'POST', 'https://admin.paulikreisch.de')).headers.get('x-middleware-next'), '1');
});
test('internal-like public path remains public', () => {
  assert.equal(middleware(request('/internal-help', 'paulikreisch.de')).headers.get('location'), null);
});

// Firebase Auth uses an HTTP-referrer-restricted public browser key.
test('admin pages preserve origin-only referrers for cross-origin Firebase Auth', () => {
  assert.equal(middleware(request('/login')).headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
});
