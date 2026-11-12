import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createChatHandler } from '../../src/lib/gpt-chat';

const request = () => new Request('https://paulikreisch.de/api/gpt/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'Hallo!' }] }),
});

test('preserves every provider character across token and transport boundaries', async () => {
  const chunks = ['**Ein', ' guter', ' Satz', '**', '\n', '\n', '- ', 'erster Punkt', '\n', '- zweiter', ' Punkt', '\n\n', '```js\n', '  const', ' answer = 42;', '\n```'];
  const wire = chunks.map(content => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`).join('') + 'data: [DONE]\n\n';
  const bytes = new TextEncoder().encode(wire);
  const handler = createChatHandler({
    apiKey: () => 'test-secret',
    fetch: async () => new Response(new ReadableStream({
      start(controller) {
        for (let offset = 0; offset < bytes.length; offset += 7) controller.enqueue(bytes.slice(offset, offset + 7));
        controller.close();
      },
    })),
  });
  const response = await handler(request());
  const events = (await response.text()).trim().split('\n\n');
  const actual = events.map(event => JSON.parse(event.slice('data: '.length)).content).join('');
  assert.equal(actual, chunks.join(''));
});

test('chat starts and streams without optional native PDF graphics bindings', () => {
  // A fresh process is essential: a previous PDF import could polyfill DOMMatrix.
  const result = spawnSync(process.execPath, ['--no-addons', '--import', 'tsx', '--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    const { createChatHandler } = await import('./src/lib/gpt-chat.ts');
    const { initializeRag, ragContext } = await import('./src/lib/rag.ts');
    await initializeRag();
    assert.equal(ragContext('Hallo!'), '');
    const handler = createChatHandler({
      apiKey: () => 'test-secret',
      fetch: async () => new Response('data: {"choices":[{"delta":{"content":"Hallo zurück!"}}]}\\n\\ndata: [DONE]\\n\\n'),
    });
    const response = await handler(new Request('https://paulikreisch.de/api/gpt/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hallo!' }] }),
    }));
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\\/event-stream/);
    const body = await response.text();
    assert.match(body, /Hallo zurück!/);
    assert.doesNotMatch(body, /event: error|test-secret/);
  `], { cwd: process.cwd(), encoding: 'utf8', timeout: 15_000 });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('missing server credentials produce a readable JSON error', async () => {
  const response = await createChatHandler({ apiKey: () => undefined })(request());
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(typeof (await response.json()).error, 'string');
});

test('upstream failures stay readable and do not expose credentials or provider details', async () => {
  const handler = createChatHandler({
    apiKey: () => 'test-secret',
    fetch: async () => new Response('private provider details', { status: 401 }),
  });
  const response = await handler(request());
  assert.equal(response.status, 503);
  const body = await response.text();
  assert.match(body, /Schreibstube/);
  assert.doesNotMatch(body, /test-secret|private provider details/);
});


const sseResponse = (chunks: string[], tail = 'data: [DONE]\n\n') => new Response(
  chunks.map(content => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`).join('') + tail,
);

test('streams long answers past the old byte and character limits', async () => {
  // 45k characters in tiny 3-character deltas: raw SSE bytes exceed the old
  // 256 KiB cap several times over, so this failed with 413 before the fix.
  const chunk = 'abc';
  const chunks = Array.from({ length: 15_000 }, () => chunk);
  const handler = createChatHandler({
    apiKey: () => 'test-secret',
    fetch: async () => sseResponse(chunks),
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.doesNotMatch(body, /event: error/);
  const received = body.trim().split('\n\n').map(event => JSON.parse(event.slice('data: '.length)).content).join('');
  assert.equal(received.length, chunks.length * chunk.length);
});

test('a slow but steadily streaming answer is not killed by the inactivity timeout', async () => {
  const total = 8;
  const handler = createChatHandler({
    apiKey: () => 'test-secret',
    timeoutMs: 120,
    fetch: async () => new Response(new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for (let index = 0; index < total; index += 1) {
          await new Promise(resolve => setTimeout(resolve, 60));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: `Teil ${index} ` } }] })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    })),
  });
  const response = await handler(request());
  const body = await response.text();
  assert.doesNotMatch(body, /event: error/);
  assert.match(body, /Teil 7 /);
});

test('a stalled provider stream still times out', async () => {
  const handler = createChatHandler({
    apiKey: () => 'test-secret',
    timeoutMs: 100,
    fetch: async (_url, init) => {
      let streamController: ReadableStreamDefaultController<Uint8Array>;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          streamController = controller;
          controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Anfang"}}]}\n\n'));
          // never closes, never sends more
        },
      });
      init?.signal?.addEventListener('abort', () => streamController.error(new Error('aborted')));
      return new Response(stream);
    },
  });
  const response = await handler(request());
  const body = await response.text();
  assert.match(body, /event: error/);
  assert.match(body, /zu lange/);
});

test('a length-truncated answer gets a continuation hint instead of an error', async () => {
  const handler = createChatHandler({
    apiKey: () => 'test-secret',
    fetch: async () => sseResponse(['Langer Text'], `data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'length' }] })}\n\ndata: [DONE]\n\n`),
  });
  const response = await handler(request());
  const body = await response.text();
  assert.doesNotMatch(body, /event: error/);
  assert.match(body, /weiter/);
});

test('retries without max_tokens when the routed model rejects the cap', async () => {
  const bodies: string[] = [];
  const handler = createChatHandler({
    apiKey: () => 'test-secret',
    fetch: async (_url, init) => {
      bodies.push(String(init?.body));
      if (bodies.length === 1) return new Response('max tokens exceeded', { status: 400 });
      return sseResponse(['Lange Antwort']);
    },
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.equal(bodies.length, 2);
  assert.match(bodies[0], /"max_tokens":8192/);
  assert.doesNotMatch(bodies[1], /max_tokens/);
  const body = await response.text();
  assert.doesNotMatch(body, /event: error/);
  assert.match(body, /Lange Antwort/);
});
