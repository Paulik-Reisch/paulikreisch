import { WIKI_ARTICLES } from './wikiland-data';

export type WikiArticle = { id: string; title: string; paragraphs: string[]; sourceUrl: string; revisionId: number; category: string };
export type WikiGame = { version: 1; puzzleId: string; mode: 'daily' | 'free'; date: string; guesses: string[]; hints: string[]; elapsed: number; givenUp: boolean };
export type WikiToken = { text: string; word: boolean; key: string };
export type GuessOutcome = 'hit' | 'miss' | 'duplicate' | 'invalid' | 'finished';

/** Exact normalized spellings; no speculative stemming or substring matching. */
export function normalizeWord(text: string): string {
  return text.trim().toLocaleLowerCase('de').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').normalize('NFKD').replace(/\p{M}/gu, '').replace(/\s+/g, ' ');
}

export function tokenize(text: string): WikiToken[] {
  return (text.match(/[\p{L}\p{M}]+|[^\p{L}\p{M}]+/gu) ?? []).map(text => ({ text, word: /^[\p{L}\p{M}]+$/u.test(text), key: /^[\p{L}\p{M}]+$/u.test(text) ? normalizeWord(text) : '' }));
}

const COMMON_WORDS = new Set('der die das des dem den ein eine einer eines einem einen und oder aber als auch an am auf aus bei bis da dass denn durch ein für gegen im in ins ist mit nach nicht noch nur ob ohne seit so um und vom von vor war waren was wie wird zu zum zur sind wurde werden sich es er sie ihr ihre seiner sein dessen sowie'.split(' ').map(normalizeWord));
export const isCommonWord = (key: string): boolean => COMMON_WORDS.has(key);
export const getArticle = (id: string): WikiArticle | undefined => WIKI_ARTICLES.find(article => article.id === id);

export function berlinDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (name: string) => parts.find(value => value.type === name)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function isWikiDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

export function dailyArticle(date: string): WikiArticle {
  if (!isWikiDate(date)) throw new Error('Invalid Wikiland date.');
  if (!WIKI_ARTICLES.length) throw new Error('Wikiland needs at least one article.');
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
  return WIKI_ARTICLES[((day % WIKI_ARTICLES.length) + WIKI_ARTICLES.length) % WIKI_ARTICLES.length];
}

export function createGame(mode: 'daily' | 'free', date = berlinDate(), excludeId?: string): WikiGame {
  if (!isWikiDate(date)) throw new Error('Invalid Wikiland date.');
  const pool = WIKI_ARTICLES.filter(article => article.id !== excludeId);
  const article = mode === 'daily' ? dailyArticle(date) : (pool[Math.floor(Math.random() * pool.length)] ?? WIKI_ARTICLES[0]);
  if (!article) throw new Error('Wikiland needs at least one article.');
  return { version: 1, puzzleId: article.id, mode, date, guesses: [], hints: [], elapsed: 0, givenUp: false };
}

function titleKey(article: WikiArticle): string {
  return normalizeWord(article.title).replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function titleWords(article: WikiArticle): WikiToken[] {
  return tokenize(article.title).filter(token => token.word && !isCommonWord(token.key));
}

function alreadyFound(game: WikiGame, article: WikiArticle): Set<string> {
  const found = new Set([...game.guesses, ...game.hints]);
  if (found.has(titleKey(article))) titleWords(article).forEach(token => found.add(token.key));
  return found;
}

type GameFacts = { article: WikiArticle | undefined; found: Set<string>; won: boolean };
// Engine transitions return new states. Share derived sets across thousands of tokens
// during a render instead of rebuilding the complete guess history for each token.
const factsCache = new WeakMap<WikiGame, GameFacts>();
function gameFacts(game: WikiGame): GameFacts {
  const cached = factsCache.get(game);
  if (cached) return cached;
  const article = getArticle(game.puzzleId);
  const found = article ? alreadyFound(game, article) : new Set<string>();
  const required = article ? titleWords(article) : [];
  const facts = { article, found, won: !game.givenUp && required.length > 0 && required.every(token => found.has(token.key)) };
  factsCache.set(game, facts);
  return facts;
}

export const isWon = (game: WikiGame): boolean => gameFacts(game).won;

export function isRevealed(token: WikiToken, game: WikiGame, _inTitle = false): boolean {
  if (!token.word || isCommonWord(token.key) || game.givenUp) return true;
  const facts = gameFacts(game);
  return facts.won || facts.found.has(token.key);
}

const allTokens = (article: WikiArticle) => [article.title, ...article.paragraphs].flatMap(tokenize);

export function getGuessHits(article: WikiArticle, guess: string): number {
  const key = normalizeWord(guess);
  const matching = new Set(key === titleKey(article) ? titleWords(article).map(token => token.key) : [key]);
  return allTokens(article).filter(token => token.word && matching.has(token.key)).length;
}

export function submitGuess(game: WikiGame, input: string): { game: WikiGame; outcome: GuessOutcome; hits: number } {
  const article = getArticle(game.puzzleId);
  if (!article || game.givenUp || isWon(game)) return { game, outcome: 'finished', hits: 0 };
  const key = normalizeWord(input);
  const phrase = key.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const fullTitle = phrase === titleKey(article);
  if (!key || key.length > 160 || (!fullTitle && (!/^[\p{L}]+$/u.test(key) || key.length > 80))) return { game, outcome: 'invalid', hits: 0 };
  const canonical = fullTitle ? phrase : key;
  const found = alreadyFound(game, article);
  if (game.guesses.includes(canonical) || found.has(canonical) || isCommonWord(canonical)) return { game, outcome: 'duplicate', hits: 0 };
  const matches = new Set(fullTitle ? titleWords(article).map(token => token.key) : [canonical]);
  const hits = allTokens(article).filter(token => token.word && !isCommonWord(token.key) && matches.has(token.key) && !found.has(token.key)).length;
  return { game: { ...game, guesses: [...game.guesses, canonical] }, outcome: hits ? 'hit' : 'miss', hits };
}

export function applyHint(game: WikiGame): WikiGame {
  const article = getArticle(game.puzzleId);
  if (!article || game.givenUp || isWon(game)) return game;
  const found = alreadyFound(game, article);
  const title = new Set(titleWords(article).map(token => token.key));
  const frequency = new Map<string, number>();
  article.paragraphs.flatMap(tokenize).forEach(token => {
    if (token.word && !isCommonWord(token.key) && !found.has(token.key) && !title.has(token.key)) frequency.set(token.key, (frequency.get(token.key) ?? 0) + 1);
  });
  const key = [...frequency].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'de'))[0]?.[0] ?? titleWords(article).find(token => !found.has(token.key))?.key;
  return key ? { ...game, hints: [...game.hints, key] } : game;
}
