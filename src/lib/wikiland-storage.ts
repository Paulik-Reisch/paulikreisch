import { dailyArticle, getArticle, isCommonWord, isWikiDate, normalizeWord, type WikiGame } from './wikiland-engine';

export const WIKI_COOKIE = 'pr_wikiland_v1';
export const WIKI_COOKIE_PATH = '/game-labs/wikiland';
const CHUNK_SIZE = 3450;
const MAX_CHUNKS = 4;
const MAX_RAW = CHUNK_SIZE * MAX_CHUNKS;

export function serializeWikiGame(game: WikiGame): string {
  const json = JSON.stringify({ v: game.version, i: game.puzzleId, m: game.mode, d: game.date, g: game.guesses, h: game.hints, t: game.elapsed, x: game.givenUp, r: game.revisionAware || undefined, w: game.legacyWon || undefined });
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function parseWikiGame(raw: string): WikiGame | null {
  try {
    if (!raw || raw.length > MAX_RAW || !/^[A-Za-z0-9_-]+$/.test(raw)) return null;
    const binary = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, char => char.charCodeAt(0))));
    if (!data || data.v !== 1 || typeof data.i !== 'string' || !['daily', 'free'].includes(data.m) || typeof data.d !== 'string' || !isWikiDate(data.d)) return null;
    const article = getArticle(data.i);
    if (!article || (data.m === 'daily' && dailyArticle(data.d).id !== article.id)) return null;
    if ((data.r !== undefined && data.r !== true) || (data.w !== undefined && (data.w !== true || data.r !== true))) return null;
    if (!Number.isSafeInteger(data.t) || data.t < 0 || data.t > 31536000 || typeof data.x !== 'boolean') return null;
    if (!Array.isArray(data.g) || !Array.isArray(data.h) || data.g.length > 2000 || data.h.length > 2000) return null;
    const validGuess = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length <= 160 && normalizeWord(value) === value && ((/^[\p{L}\p{N}]+(?: [\p{L}\p{N}]+)*$/u.test(value) && value.includes(' ')) || (/^[\p{L}]+$/u.test(value) && value.length <= 80)) && !isCommonWord(value);
    if (!data.g.every(validGuess) || new Set(data.g).size !== data.g.length) return null;
    // Full revision text is loaded asynchronously and is not available to this parser.
    if (!data.h.every((value: unknown) => validGuess(value) && !data.g.includes(value)) || new Set(data.h).size !== data.h.length) return null;
    return { version: 1, puzzleId: data.i, mode: data.m, date: data.d, guesses: data.g, hints: data.h, elapsed: data.t, givenUp: data.x, ...(data.r ? { revisionAware: true } : {}), ...(data.w ? { legacyWon: true } : {}) };
  } catch { return null; }
}

function checksum(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function cookieJar(): Map<string, string> {
  return new Map(document.cookie.split(/;\s*/).filter(Boolean).map(entry => {
    const separator = entry.indexOf('=');
    return [entry.slice(0, separator), entry.slice(separator + 1)];
  }));
}

export function loadWikiGame(): WikiGame | null {
  try {
    const cookies = cookieJar();
    const first = cookies.get(`${WIKI_COOKIE}_0`);
    const header = first?.match(/^([a-f0-9]{8})\.([1-4])\.0\.([A-Za-z0-9_-]+)$/);
    if (!header) return null;
    const count = Number(header[2]), hash = header[1];
    let raw = '';
    for (let index = 0; index < count; index++) {
      const value = cookies.get(`${WIKI_COOKIE}_${index}`);
      const prefix = `${hash}.${count}.${index}.`;
      if (!value?.startsWith(prefix) || value.length > 3500) return null;
      raw += value.slice(prefix.length);
    }
    if (checksum(raw) !== hash) return null;
    return parseWikiGame(raw);
  } catch { return null; }
}

function attributes(maxAge: number): string {
  return `; Path=${WIKI_COOKIE_PATH}; Max-Age=${maxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}

export function saveWikiGame(game: WikiGame): boolean {
  try {
    const raw = serializeWikiGame(game);
    if (raw.length > MAX_RAW || !parseWikiGame(raw)) return false;
    const count = Math.ceil(raw.length / CHUNK_SIZE), hash = checksum(raw);
    for (let index = 0; index < MAX_CHUNKS; index++) {
      document.cookie = index < count
        ? `${WIKI_COOKIE}_${index}=${hash}.${count}.${index}.${raw.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE)}${attributes(31536000)}`
        : `${WIKI_COOKIE}_${index}=${attributes(0)}`;
    }
    const restored = loadWikiGame();
    return restored !== null && serializeWikiGame(restored) === raw;
  } catch { return false; }
}

export function clearWikiGame(): void {
  try {
    for (let index = 0; index < MAX_CHUNKS; index++) document.cookie = `${WIKI_COOKIE}_${index}=${attributes(0)}`;
  } catch { /* Game still works in memory when cookies are unavailable. */ }
}
