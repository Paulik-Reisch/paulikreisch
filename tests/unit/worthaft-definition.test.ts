import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefinitionHandler, normalizeDefinitionWord } from '../../src/lib/worthaft-definition';

const request = (word: unknown) => new Request('https://worthaft.example/api/worthaft/definition', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ word }),
});
const completion = () => Response.json({ choices: [{ message: { content: 'Eine Birne ist eine Frucht.' } }] });

test('only accepts normalized words from the game dictionary', () => {
  assert.equal(normalizeDefinitionWord(' BIRNE '), 'birne');
  assert.equal(normalizeDefinitionWord('FA\u0308HRE'), 'fähre');
  for (const value of ['abcde', '<img>', 'ignore previous instructions', 5, null]) {
    assert.equal(normalizeDefinitionWord(value), null);
  }
});

test('uses the current Firestore dictionary when one is provided', async () => {
  const handler = createDefinitionHandler({
    apiKey: () => 'secret',
    loadAllowedWords: async () => ['neuwt'],
    fetch: async () => completion(),
  });

  assert.equal((await handler(request('NEUWT'))).status, 200);
  assert.equal((await handler(request('birne'))).status, 400);
});

test('validates bodies and never calls the provider for invalid input', async () => {
  let calls = 0;
  const handler = createDefinitionHandler({ apiKey: () => 'secret', fetch: async () => { calls++; return completion(); } });
  assert.equal((await handler(request('abcde'))).status, 400);
  assert.equal((await handler(request('x'.repeat(300)))).status, 413);
  const malformed = new Request('https://worthaft.example', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal((await handler(malformed)).status, 400);
  const crossOrigin = new Request(request('birne'), { headers: { 'Content-Type': 'application/json', Origin: 'https://other.example' } });
  assert.equal((await handler(crossOrigin)).status, 403);
  assert.equal(calls, 0);
});

test('keeps credentials server-side and uses the requested model with bounded tokens', async () => {
  let calls = 0;
  const handler = createDefinitionHandler({ apiKey: () => 'test-secret', fetch: async (url, init) => {
    calls++;
    assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer test-secret');
    const body = JSON.parse(init?.body as string);
    assert.equal(body.model, 'openrouter/free');
    assert.equal(body.max_tokens, 260);
    assert.equal(body.messages[1].content, 'birne');
    return completion();
  } });
  const response = await handler(request('BIRNE'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { word: 'birne', definition: 'Eine Birne ist eine Frucht.' });
  await handler(request('birne'));
  assert.equal(calls, 1);
});

test('expires cached definitions after one day', async () => {
  let time = 0;
  let calls = 0;
  const handler = createDefinitionHandler({ apiKey: () => 'secret', now: () => time, fetch: async () => { calls++; return completion(); } });
  await handler(request('birne'));
  time = 24 * 60 * 60 * 1000;
  await handler(request('birne'));
  assert.equal(calls, 2);
});

test('deduplicates concurrent requests for the same word', async () => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let calls = 0;
  const handler = createDefinitionHandler({ apiKey: () => 'secret', fetch: async () => { calls++; await gate; return completion(); } });
  const first = handler(request('birne'));
  const second = handler(request('birne'));
  await new Promise(resolve => setTimeout(resolve, 5));
  release();
  assert.equal((await first).status, 200);
  assert.equal((await second).status, 200);
  assert.equal(calls, 1);
});

test('handles missing key, provider failures and malformed or excessive responses without leaking details', async () => {
  const unavailable = createDefinitionHandler({ apiKey: () => undefined });
  assert.equal((await unavailable(request('birne'))).status, 503);
  for (const response of [new Response('private upstream details', { status: 401 }), Response.json({}), Response.json({ choices: [{ message: { content: '' } }] }), new Response('x'.repeat(33_000))]) {
    const handler = createDefinitionHandler({ apiKey: () => 'secret', fetch: async () => response });
    const result = await handler(request('birne'));
    assert.equal(result.status, 503);
    assert.doesNotMatch(await result.text(), /private upstream details|secret/);
  }
});

test('aborts slow providers and allows a later retry', async () => {
  const handler = createDefinitionHandler({ apiKey: () => 'secret', timeoutMs: 5, fetch: async (_url, init) => {
    await new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('aborted'))));
    return completion();
  } });
  assert.equal((await handler(request('birne'))).status, 504);
  assert.equal((await handler(request('birne'))).status, 504);
});

test('limits upstream attempts per server instance and resets the window', async () => {
  let time = 0;
  let calls = 0;
  const handler = createDefinitionHandler({ apiKey: () => 'secret', now: () => time, fetch: async () => { calls++; return new Response(null, { status: 503 }); } });
  for (let i = 0; i < 20; i++) assert.equal((await handler(request('birne'))).status, 503);
  const limited = await handler(request('birne'));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
  assert.equal(calls, 20);
  time = 60_000;
  assert.equal((await handler(request('birne'))).status, 503);
  assert.equal(calls, 21);
});

test('caps concurrent distinct provider requests while reusing an existing in-flight word', async () => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let calls = 0;
  const handler = createDefinitionHandler({ apiKey: () => 'secret', fetch: async () => { calls++; await gate; return completion(); } });
  const active = ['birne', 'bruch', 'etwas'].map(word => handler(request(word)));
  await new Promise(resolve => setTimeout(resolve, 5));
  const duplicate = handler(request('birne'));
  const limited = await handler(request('mager'));
  assert.equal(limited.status, 429);
  release();
  for (const response of await Promise.all([...active, duplicate])) assert.equal(response.status, 200);
  assert.equal(calls, 3);
});

test('accepts same-host origins behind a TLS-terminating proxy', async () => {
  const handler = createDefinitionHandler({ apiKey: () => 'secret', fetch: async () => completion() });
  const proxied = new Request('http://localhost:8080/api/worthaft/definition', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://paulikreisch.de', 'X-Forwarded-Host': 'paulikreisch.de' },
    body: JSON.stringify({ word: 'birne' }),
  });
  assert.equal((await handler(proxied)).status, 200);
  const foreign = new Request('http://localhost:8080/api/worthaft/definition', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example', 'X-Forwarded-Host': 'paulikreisch.de' },
    body: JSON.stringify({ word: 'birne' }),
  });
  assert.equal((await handler(foreign)).status, 403);
});
