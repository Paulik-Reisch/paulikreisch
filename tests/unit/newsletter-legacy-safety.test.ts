import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { GET, POST } from '../../src/app/api/funnel/process/route';
import { processFunnelQueue } from '../../src/lib/funnel-queue';

const source = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

test('retired legacy funnel endpoint cannot dispatch for GET or POST, even with credentials', async () => {
  for (const handler of [GET, POST]) {
    const response = handler();
    assert.equal(response.status, 410);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.json()).ok, false);
  }
});

test('retired legacy funnel processor refuses direct internal calls', async () => {
  await assert.rejects(() => processFunnelQueue(20), /Legacy funnel dispatch disabled/);
});

test('retired route and processor do not import a queue, recipient store or provider', () => {
  for (const path of ['src/app/api/funnel/process/route.ts', 'src/lib/funnel-queue.ts']) {
    const code = source(path);
    assert.doesNotMatch(code, /^import /m);
    assert.doesNotMatch(code, /getCollectionData\(|updateDocument\(|sendTransactionalEmail\(/);
  }
});

test('public form has no legacy contact, recipient, Day0 or queue fallback', () => {
  const code = source('src/app/actions.ts');
  assert.doesNotMatch(code, /from ['"]@\/lib\/(?:firestore|resend|funnel-emails)['"]|addContact\(|addSubscriber\(|sendTransactionalEmail\(|addDocument\(/);
  assert.ok(code.indexOf('if (!newsletterStoreEnabled())') < code.indexOf('await import("@/newsletter/signup")'));
  assert.match(code, /if \(!newsletterStoreEnabled\(\)\) \{\s*return \{ error:/);
});
