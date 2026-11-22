import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import { middleware } from '../../src/middleware';
import AdminPage from '../../src/app/admin/page';

test('legacy admin entry redirects to Worthaft', () => {
  assert.throws(() => AdminPage(), (error: unknown) => {
    assert.ok(error && typeof error === 'object' && 'digest' in error);
    assert.match(String(error.digest), /;\/worthaft;/);
    return true;
  });
});

test('admin root keeps query and private response headers when opening Worthaft', () => {
  const response = middleware(new NextRequest('https://admin.paulikreisch.de/?from=bookmark', { headers: { host: 'admin.paulikreisch.de' } }));
  assert.equal(response.headers.get('x-middleware-rewrite'), 'https://admin.paulikreisch.de/admin/worthaft?from=bookmark');
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
});
