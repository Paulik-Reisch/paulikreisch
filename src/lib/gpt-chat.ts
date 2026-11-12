import { ragContext } from './rag';

const MAX_REQUEST_BYTES = 120_000;
const MAX_PROVIDER_BYTES = 8_388_608; // 8 MiB abuse backstop; the character cap below is the real limit
const MAX_MESSAGES = 18;
const MAX_MESSAGE_LENGTH = 6_000;
const MAX_TOTAL_CHARACTERS = 50_000;
const MAX_RESPONSE_CHARACTERS = 120_000; // far beyond max_tokens, only a runaway-stream backstop
const MAX_OUTPUT_TOKENS = 8_192;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const MAX_CONCURRENT_REQUESTS = 2;

class ChatError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type ToolCall = { name: string; arguments: unknown };
type Dependencies = {
  apiKey: () => string | undefined;
  fetch?: typeof fetch;
  now?: () => number;
  /** Abort the provider stream after this long without a single byte. Defaults to 60s. */
  timeoutMs?: number;
};

const TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'analyze_writing_style',
      description: 'Analysiert den Schreibstil eines Textes und gibt Rückmeldung zu Ton, Satzbau und satirischen Elementen.',
      parameters: {
        type: 'object',
        properties: {
          tone: { type: 'string', description: 'Dominanter Ton des Textes (z. B. satirisch, trocken, warmherzig)' },
          sentenceStructure: { type: 'string', description: 'Bemerkung zum Satzbau (kurz, lang, verschachtelt)' },
          satireElements: { type: 'string', description: 'Gefundene satirische Elemente und Übertreibungen' },
          suggestion: { type: 'string', description: 'Konkreter Vorschlag zur stilistischen Verbesserung' },
        },
        required: ['tone', 'sentenceStructure', 'satireElements', 'suggestion'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'suggest_headline',
      description: 'Schlägt pointierte, satirische Überschriften für einen Text vor.',
      parameters: {
        type: 'object',
        properties: {
          headlines: {
            type: 'array',
            items: { type: 'string' },
            minItems: 3,
            maxItems: 5,
            description: 'Drei bis fünf Überschriftenvorschläge',
          },
        },
        required: ['headlines'],
        additionalProperties: false,
      },
    },
  },
] as const;

function providerEventContent(event: string): { done: boolean; content: string; truncated: boolean } {
  const data = event.split('\n')
    .filter(line => line.startsWith('data:'))
    .map(line => line.slice(5).trimStart())
    .join('\n');
  if (!data) return { done: false, content: '', truncated: false };
  if (data === '[DONE]') return { done: true, content: '', truncated: false };

  let payload: unknown;
  try {
    payload = JSON.parse(data);
  } catch {
    throw new ChatError(503, 'Die Schreibstube hat gerade keine lesbare Antwort geliefert.');
  }
  if (!payload || typeof payload !== 'object' || !('choices' in payload) || !Array.isArray(payload.choices)) {
    return { done: false, content: '', truncated: false };
  }
  const first = payload.choices[0];
  const truncated = Boolean(first && typeof first === 'object' && 'finish_reason' in first && first.finish_reason === 'length');
  if (!first || typeof first !== 'object' || !('delta' in first) || !first.delta || typeof first.delta !== 'object'
    || !('content' in first.delta) || typeof first.delta.content !== 'string') {
    return { done: false, content: '', truncated };
  }
  // Deltas are arbitrary fragments: even a single space or newline is content.
  return { done: false, content: first.delta.content, truncated };
}

const SYSTEM_PROMPT = `Du bist die experimentelle Schreib-KI von Paulik & Reisch. Schreibe auf Deutsch mit pointierter, warmherziger Satire: genaue Alltagsbeobachtungen, trockenes Understatement, überraschende Vergleiche und gelegentliche bürokratische Übertreibung. Richte den Witz auf Situationen und Systeme, nicht auf schutzbedürftige Menschen. Passe dich dem Auftrag an, hilf auch beim Überarbeiten und Erklären. Erfinde keine Tatsachen über reale Personen. Übernimm keine längeren Passagen aus dem Buch und behaupte nicht, ein Originaltext zu sein. Wenn ein nüchterner Ton gewünscht wird, folge diesem Wunsch.

Du hast Zugriff auf folgende Werkzeuge, die du bei Bedarf einsetzen sollst:
- analyze_writing_style: Analysiere den Schreibstil eines Textes (Ton, Satzbau, satirische Elemente) und gib eine stilistische Rückmeldung.
- suggest_headline: Schlage pointierte, satirische Überschriften für einen Text vor.

Nutze die Werkzeuge, wenn der Nutzer um eine Stilanalyse oder Überschriftenvorschläge bittet. Antworte ansonsten direkt im Chat.`;

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
        throw new ChatError(413, 'Die Anfrage ist zu groß.');
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

function parseMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    throw new ChatError(400, 'Bitte prüfe deine Nachricht und versuche es erneut.');
  }

  let totalCharacters = 0;
  const messages = value.map((message): ChatMessage => {
    if (!message || typeof message !== 'object' || !('role' in message) || !('content' in message)) {
      throw new ChatError(400, 'Bitte prüfe deine Nachricht und versuche es erneut.');
    }
    const { role, content } = message as { role: unknown; content: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim() || content.length > MAX_MESSAGE_LENGTH) {
      throw new ChatError(400, 'Bitte prüfe deine Nachricht und versuche es erneut.');
    }
    totalCharacters += content.length;
    if (totalCharacters > MAX_TOTAL_CHARACTERS) {
      throw new ChatError(413, 'Der Chatverlauf ist zu lang. Beginne bitte einen neuen Chat.');
    }
    return { role, content: content.trim() };
  });

  if (messages[0].role !== 'user' || messages.at(-1)?.role !== 'user'
    || messages.some((message, index) => index > 0 && message.role === messages[index - 1].role)) {
    throw new ChatError(400, 'Bitte starte mit einer Nachricht und sende jeweils abwechselnd.');
  }
  return messages;
}

export function createChatHandler(dependencies: Dependencies) {
  const fetchProvider = dependencies.fetch ?? fetch;
  const now = dependencies.now ?? Date.now;
  let windowStart = now();
  let requests = 0;
  let activeRequests = 0;

  return async function handleChat(request: Request): Promise<Response> {
    const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
    try {
      const origin = request.headers.get('origin');
      if (origin) {
        let originHost = '';
        try {
          originHost = new URL(origin).host;
        } catch {
          throw new ChatError(403, 'Diese Anfrage ist nicht erlaubt.');
        }
        const candidates = [request.headers.get('x-forwarded-host'), request.headers.get('host'), new URL(request.url).host]
          .filter((value): value is string => Boolean(value))
          .flatMap(value => value.split(',').map(entry => entry.trim()))
          .filter(Boolean);
        if (!candidates.includes(originHost)) throw new ChatError(403, 'Diese Anfrage ist nicht erlaubt.');
      }
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
        throw new ChatError(400, 'Bitte sende eine gültige Chatnachricht.');
      }

      let payload: unknown;
      try {
        payload = JSON.parse(await readBoundedBody(request.body, MAX_REQUEST_BYTES));
      } catch (error) {
        if (error instanceof ChatError) throw error;
        throw new ChatError(400, 'Bitte sende eine gültige Chatnachricht.');
      }
      const messages = parseMessages((payload as { messages?: unknown } | null)?.messages);
      const apiKey = dependencies.apiKey()?.trim();
      if (!apiKey) throw new ChatError(503, 'Der Schreibassistent ist lokal noch nicht eingerichtet.');

      if (now() - windowStart >= WINDOW_MS) {
        windowStart = now();
        requests = 0;
      }
      if (requests >= MAX_REQUESTS_PER_WINDOW || activeRequests >= MAX_CONCURRENT_REQUESTS) {
        headers['Retry-After'] = '60';
        throw new ChatError(429, 'Gerade schreiben viele gleichzeitig. Bitte versuche es in einer Minute erneut.');
      }
      requests += 1;
      activeRequests += 1;

      const controller = new AbortController();
      const timeoutMs = dependencies.timeoutMs ?? 60_000;
      let timer = setTimeout(() => controller.abort(), timeoutMs);
      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => controller.abort(), timeoutMs);
      };
      let streamStarted = false;
      try {
        const lastUserMessage = messages.at(-1)?.content ?? '';
        const ragCtx = ragContext(lastUserMessage, 3);
        const systemContent = ragCtx
          ? `${SYSTEM_PROMPT}\n\nStilistische Referenzen (nicht kopieren, nur adaptieren):\n${ragCtx}`
          : SYSTEM_PROMPT;
        const requestFromProvider = (maxTokens?: number) => fetchProvider('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            'HTTP-Referer': 'https://paulikreisch.de',
            'X-Title': 'Paulik & Reisch Schreibstube',
            'X-OpenRouter-Data-Collection': 'deny',
          },
          body: JSON.stringify({
            model: 'openrouter/free',
            ...(maxTokens ? { max_tokens: maxTokens } : {}),
            temperature: 0.82,
            reasoning: { effort: 'low' },
            stream: true,
            tools: TOOLS,
            tool_choice: 'auto',
            messages: [{ role: 'system', content: systemContent }, ...messages],
          }),
          signal: controller.signal,
          cache: 'no-store',
        });
        let response = await requestFromProvider(MAX_OUTPUT_TOKENS);
        if (!response.ok && response.status === 400) {
          // openrouter/free rotates between models; a few reject an explicit
          // max_tokens above their own cap. Retry once letting the model decide.
          await response.body?.cancel();
          response = await requestFromProvider();
        }
        if (!response.ok) {
          await response.body?.cancel();
          throw new ChatError(503, 'Die Schreibstube ist gerade nicht erreichbar. Bitte versuche es später erneut.');
        }
        if (!response.body) throw new ChatError(503, 'Die Schreibstube hat gerade keine Antwort geliefert. Bitte versuche es erneut.');

        let finished = false;
        let cancelled = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          activeRequests -= 1;
        };
        const encoder = new TextEncoder();
        const body = new ReadableStream<Uint8Array>({
          start(stream) {
            const pump = async () => {
              const reader = response.body!.getReader();
              const decoder = new TextDecoder();
              let buffer = '';
              let totalBytes = 0;
              let totalCharacters = 0;
              let fullMessage = '';
              let truncated = false;
              let done = false;
              const sendEvent = (event: string, data: unknown) => {
                stream.enqueue(encoder.encode(`${event ? `event: ${event}\n` : ''}data: ${JSON.stringify(data)}\n\n`));
              };
              const processEvent = (event: string) => {
                const result = providerEventContent(event);
                truncated = truncated || result.truncated;
                if (result.content) {
                  totalCharacters += result.content.length;
                  if (totalCharacters > MAX_RESPONSE_CHARACTERS) throw new ChatError(503, 'Die Antwort der Schreibstube ist zu lang.');
                  fullMessage += result.content;
                  sendEvent('', { content: result.content });
                }
                return result.done;
              };
              try {
                while (!done) {
                  const { done: ended, value } = await reader.read();
                  if (ended) break;
                  resetTimer();
                  totalBytes += value.byteLength;
                  if (totalBytes > MAX_PROVIDER_BYTES) throw new ChatError(413, 'Die Antwort der Schreibstube ist zu groß.');
                  buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, '\n');
                  let boundary = buffer.indexOf('\n\n');
                  while (boundary !== -1) {
                    const event = buffer.slice(0, boundary);
                    buffer = buffer.slice(boundary + 2);
                    if (processEvent(event)) {
                      done = true;
                      break;
                    }
                    boundary = buffer.indexOf('\n\n');
                  }
                }
                buffer += decoder.decode();
                if (!done && buffer.trim()) done = processEvent(buffer);
                if (!done || !fullMessage.trim()) {
                  throw new ChatError(503, 'Die Schreibstube hat gerade keine vollständige Antwort geliefert.');
                }
                if (truncated) {
                  const hint = '\n\n*\u2026Antwort gek\u00fcrzt. Schreib \u201eweiter\u201c, dann mache ich weiter.*';
                  fullMessage += hint;
                  sendEvent('', { content: hint });
                }
              } catch (error) {
                if (!cancelled) {
                  const timedOut = controller.signal.aborted;
                  if (!timedOut) controller.abort();
                  const knownError = error instanceof ChatError
                    ? error
                    : timedOut
                      ? new ChatError(504, 'Die Antwort dauert gerade zu lange. Bitte versuche es erneut.')
                      : new ChatError(503, 'Die Schreibstube ist gerade nicht erreichbar. Bitte versuche es später erneut.');
                  sendEvent('error', { error: knownError.message });
                }
              } finally {
                reader.releaseLock();
                if (!cancelled) stream.close();
                finish();
              }
            };
            void pump();
          },
          cancel() {
            cancelled = true;
            controller.abort();
            finish();
          },
        });
        streamStarted = true;
        return new Response(body, {
          headers: {
            ...headers,
            'Content-Type': 'text/event-stream; charset=utf-8',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
          },
        });
      } catch (error) {
        if (controller.signal.aborted) throw new ChatError(504, 'Die Antwort dauert gerade zu lange. Bitte versuche es erneut.');
        if (error instanceof ChatError) throw error;
        throw new ChatError(503, 'Die Schreibstube ist gerade nicht erreichbar. Bitte versuche es später erneut.');
      } finally {
        if (!streamStarted) {
          clearTimeout(timer);
          activeRequests -= 1;
        }
      }
    } catch (error) {
      const knownError = error instanceof ChatError ? error : new ChatError(503, 'Die Schreibstube ist gerade nicht verfügbar.');
      return Response.json({ error: knownError.message }, { status: knownError.status, headers });
    }
  };
}





