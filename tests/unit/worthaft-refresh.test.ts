import assert from 'node:assert/strict';
import test from 'node:test';
import { WORTHAFT_WORD_LISTS_CACHE_TAG } from '../../src/lib/worthaft-cache-policy';
import { refreshWorthaftWordLists } from '../../src/lib/worthaft-refresh';

test('without a session the cache is not touched', async () => {
  const expired: string[] = [];
  const result = await refreshWorthaftWordLists({
    getSession: async () => null,
    expireTag: (tag) => expired.push(tag),
  });

  assert.equal(result, 'unauthenticated');
  assert.deepEqual(expired, []);
});

test('with an admin session only the word list tag is expired', async () => {
  const expired: string[] = [];
  const result = await refreshWorthaftWordLists({
    getSession: async () => ({ user: { id: 'admin' } }),
    expireTag: (tag) => expired.push(tag),
  });

  assert.equal(result, 'refreshed');
  assert.deepEqual(expired, [WORTHAFT_WORD_LISTS_CACHE_TAG]);
});

test('a failing session lookup does not expire the cache', async () => {
  const expired: string[] = [];
  await assert.rejects(
    refreshWorthaftWordLists({
      getSession: async () => {
        throw new Error('SESSION_SECRET missing');
      },
      expireTag: (tag) => expired.push(tag),
    }),
  );

  assert.deepEqual(expired, []);
});
