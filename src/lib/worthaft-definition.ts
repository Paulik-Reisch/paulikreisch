import { WORDS } from './worthaft-words';

const allowedWords = new Set(WORDS);
const MAX_REQUEST_BYTES = 256;
const MAX_PROVIDER_BYTES = 32_768;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 512;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_CONCURRENT_REQUESTS = 3;

class DefinitionError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function readBoundedBody(body: ReadableStream<Uint8Array> | null, limit: number) {
  if (!body) return '';
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new DefinitionError(413, 'Die Anfrage ist zu groß.');
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export function normalizeDefinitionWord(value: unknown, words: readonly string[] = WORDS): string | null {
  if (typeof value !== 'string' || value.length > 20) return null;
  const word = value.trim().normalize('NFC').toLocaleLowerCase('de');
  const isAllowed = words === WORDS ? allowedWords.has(word) : words.includes(word);
  return /^[a-zäöüß]{5}$/.test(word) && isAllowed ? word : null;
}

type Dependencies = {
  apiKey: () => string | undefined;
  loadAllowedWords?: () => Promise<readonly string[]>;
  fetch?: typeof fetch;
  now?: () => number;
  timeoutMs?: number;
};

/** State is bounded and local to this server instance; see deployment notes. */
export function createDefinitionHandler(dependencies: Dependencies) {
  const fetchProvider = dependencies.fetch ?? fetch;
  const now = dependencies.now ?? Date.now;
  const cache = new Map<string, { definition: string; expires: number }>();
  const pending = new Map<string, Promise<string>>();
  let windowStart = now();
  let requests = 0;

  async function generate(word: string, apiKey: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), dependencies.timeoutMs ?? 20_000);
    try {
      const response = await fetchProvider('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openrouter/free',
          max_tokens: 260,
          temperature: 0.2,
          messages: [
            {
              role: 'system',
              content: 'Du erklärst Wörter für das deutsche Worträtsel Worthaft. Erkläre das angegebene Wort auf Deutsch in zwei bis drei kurzen, leicht verständlichen Sätzen. Nenne seine übliche Bedeutung und ein kurzes Beispiel. Bei mehreren Bedeutungen nenne die häufigste. Wenn du unsicher bist, sage das ehrlich. Antworte ausschließlich mit der Erklärung als Klartext, ohne Markdown, Überschrift oder Einleitung.',
            },
            { role: 'user', content: word },
          ],
        }),
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!response.ok) {
        await response.body?.cancel();
        throw new DefinitionError(503, 'Die Worterklärung ist gerade nicht verfügbar. Bitte versuche es später erneut.');
      }
      const payload: unknown = JSON.parse(await readBoundedBody(response.body, MAX_PROVIDER_BYTES));
      const content = (payload as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0]?.message?.content;
      if (typeof content !== 'string' || !content.trim() || content.length > 2000) {
        throw new DefinitionError(503, 'Es konnte gerade keine Worterklärung erstellt werden.');
      }
      const definition = content.trim();
      if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
      cache.set(word, { definition, expires: now() + CACHE_TTL_MS });
      return definition;
    } catch (error) {
      if (controller.signal.aborted) throw new DefinitionError(504, 'Die Worterklärung dauert gerade zu lange. Bitte versuche es erneut.');
      if (error instanceof DefinitionError && error.status !== 413) throw error;
      throw new DefinitionError(503, 'Die Worterklärung ist gerade nicht verfügbar. Bitte versuche es später erneut.');
    } finally {
      clearTimeout(timer);
    }
  }

  return async function handleDefinition(request: Request): Promise<Response> {
    const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
    try {
      const origin = request.headers.get('origin');
      if (origin) {
        // Behind a TLS-terminating proxy (Firebase App Hosting) request.url can
        // carry an internal scheme or host, so compare the Origin host against
        // the forwarded host headers instead of request.url.
        let originHost = '';
        try {
          originHost = new URL(origin).host;
        } catch {
          throw new DefinitionError(403, 'Diese Anfrage ist nicht erlaubt.');
        }
        const candidates = [
          request.headers.get('x-forwarded-host'),
          request.headers.get('host'),
          new URL(request.url).host,
        ]
          .filter((value): value is string => Boolean(value))
          .flatMap((value) => value.split(',').map((entry) => entry.trim()))
          .filter(Boolean);
        if (!originHost || !candidates.includes(originHost)) {
          throw new DefinitionError(403, 'Diese Anfrage ist nicht erlaubt.');
        }
      }
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
        throw new DefinitionError(400, 'Bitte sende ein gültiges Wort.');
      }
      let payload: unknown;
      try {
        payload = JSON.parse(await readBoundedBody(request.body, MAX_REQUEST_BYTES));
      } catch (error) {
        if (error instanceof DefinitionError) throw error;
        throw new DefinitionError(400, 'Bitte sende ein gültiges Wort.');
      }
      const allowedWords = dependencies.loadAllowedWords
        ? await dependencies.loadAllowedWords()
        : WORDS;
      const word = normalizeDefinitionWord((payload as { word?: unknown } | null)?.word, allowedWords);
      if (!word) throw new DefinitionError(400, 'Dieses Wort ist nicht in Worthaft enthalten.');
      const cached = cache.get(word);
      if (cached && cached.expires > now()) return Response.json({ word, definition: cached.definition }, { headers });
      cache.delete(word);
      const apiKey = dependencies.apiKey()?.trim();
      if (!apiKey) throw new DefinitionError(503, 'Die Worterklärung ist noch nicht eingerichtet.');
      let result = pending.get(word);
      if (!result) {
        if (now() - windowStart >= WINDOW_MS) {
          windowStart = now();
          requests = 0;
        }
        if (requests >= MAX_REQUESTS_PER_WINDOW || pending.size >= MAX_CONCURRENT_REQUESTS) {
          headers['Retry-After'] = '60';
          throw new DefinitionError(429, 'Gerade werden viele Wörter erklärt. Bitte versuche es in einer Minute erneut.');
        }
        requests += 1;
        result = generate(word, apiKey);
        pending.set(word, result);
        void result.finally(() => pending.delete(word)).catch(() => undefined);
      }
      return Response.json({ word, definition: await result }, { headers });
    } catch (error) {
      const knownError = error instanceof DefinitionError ? error : new DefinitionError(503, 'Die Worterklärung ist gerade nicht verfügbar.');
      return Response.json({ error: knownError.message }, { status: knownError.status, headers });
    }
  };
}
