import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchWikipediaRevision } from '../../src/lib/wikiland-wikipedia';

test('requests the pinned revision and returns the complete parsed text', async () => {
  const request: typeof fetch = async input => {
    const url = new URL(String(input));
    assert.equal(url.searchParams.get('oldid'), '123');
    assert.equal(url.searchParams.get('prop'), 'text|revid');
    return Response.json({ parse: { title: 'Titel', revid: 123, text: '<p>Erster Absatz</p><h2>Ende</h2>' } });
  };
  assert.deepEqual(await fetchWikipediaRevision(123, undefined, request), { title: 'Titel', html: '<p>Erster Absatz</p><h2>Ende</h2>' });
});

test('rejects an unavailable API or an incorrect revision', async () => {
  await assert.rejects(fetchWikipediaRevision(123, undefined, async () => new Response('', { status: 503 })), /HTTP 503/);
  await assert.rejects(fetchWikipediaRevision(123, undefined, async () => Response.json({ parse: { title: 'Titel', revid: 124, text: '<p>Text</p>' } })), /invalid revision/);
  await assert.rejects(fetchWikipediaRevision(123, undefined, async () => Response.json({ error: { code: 'missingtitle' } })), /no article/);
});
