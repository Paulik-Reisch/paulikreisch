import test from 'node:test';
import assert from 'node:assert/strict';
import { WIKI_ARTICLES } from '../../src/lib/wikiland-data';
import { applyHint, berlinDate, createGame, dailyArticle, getGuessHits, hasValidHints, isCommonWord, isRevealed, isWikiDate, isWon, normalizeWord, submitGuess, tokenize, upgradeLegacyGame, type WikiArticle, type WikiGame } from '../../src/lib/wikiland-engine';

const fixture: WikiArticle = { id: 'wikiland-engine-fixture', title: 'Die blaue Brücke', paragraphs: ['Die blaue Brücke ist eine Brücke über einen Fluss. Der Fluss ist 42 Kilometer lang.', 'Brücken verbinden Orte. Am Fluss wachsen Bäume. Ein Café liegt am Fluss.'], sourceUrl: 'https://de.wikipedia.org/wiki/Br%C3%BCcke', revisionId: 1, category: 'Test' };
WIKI_ARTICLES.push(fixture);
const game = (): WikiGame => ({ version: 1, puzzleId: fixture.id, mode: 'free', date: '2026-11-01', guesses: [], hints: [], elapsed: 0, givenUp: false });

test('Unicode tokens preserve punctuation and normalize German spellings without substring matches', () => {
  const text = 'Bäume, STRAẞE – Café: 42!';
  const tokens = tokenize(text);
  assert.equal(tokens.map(token => token.text).join(''), text);
  assert.deepEqual(tokens.filter(token => token.word).map(token => token.key), ['baeume', 'strasse', 'cafe']);
  assert.equal(normalizeWord('  ÜBER  '), normalizeWord('ueber'));
  assert.equal(isCommonWord('die'), true);
  assert.equal(isCommonWord('bruecke'), false);
  assert.equal(getGuessHits(fixture, 'Bruecke'), 3);
  assert.equal(getGuessHits(fixture, 'Brücken'), 1);
  assert.equal(getGuessHits(fixture, 'Brueck'), 0);
});

test('daily selection uses Berlin dates, is deterministic and free play avoids the current article', () => {
  assert.equal(berlinDate(new Date('2026-10-31T23:30:00Z')), '2026-11-01');
  assert.equal(berlinDate(new Date('2026-07-01T22:30:00Z')), '2026-07-02');
  assert.equal(isWikiDate('2026-02-30'), false);
  assert.equal(isWikiDate('2026-11-01'), true);
  assert.throws(() => dailyArticle('invalid'));
  assert.equal(createGame('daily', '2026-11-01').puzzleId, dailyArticle('2026-11-01').id);
  assert.equal(dailyArticle('2026-11-01'), dailyArticle('2026-11-01'));
  for (let i = 0; i < 10; i++) assert.notEqual(createGame('free', '2026-11-01', fixture.id).puzzleId, fixture.id);
});

test('single guesses reveal every exact occurrence and count misses without mutating previous state', () => {
  const initial = game();
  const result = submitGuess(initial, 'BRÜCKE');
  assert.equal(result.outcome, 'hit');
  assert.equal(result.hits, 3);
  assert.deepEqual(initial.guesses, []);
  assert.deepEqual(result.game.guesses, ['bruecke']);
  assert.equal(isWon(result.game), false);
  assert.equal(isRevealed(tokenize('Brücke')[0], result.game), true);
  assert.equal(isRevealed(tokenize('Brücken')[0], result.game), false);
  const miss = submitGuess(result.game, 'Unbekannt');
  assert.equal(miss.outcome, 'miss');
  assert.equal(miss.hits, 0);
  assert.deepEqual(miss.game.guesses, ['bruecke', 'unbekannt']);
});

test('duplicate and already-visible guesses cost no attempt; malformed guesses are rejected', () => {
  const state = submitGuess(game(), 'Bäume').game;
  assert.equal(submitGuess(state, 'BAEUME').outcome, 'duplicate');
  assert.equal(submitGuess(state, 'die').outcome, 'duplicate');
  assert.equal(submitGuess(state, 'BAEUME').game, state);
  for (const input of ['', 'nicht der titel', 'a'.repeat(81), '123', '<script>alert(1)</script>']) {
    assert.equal(submitGuess(state, input).outcome, 'invalid');
    assert.equal(submitGuess(state, input).game, state);
  }
});

test('finding all meaningful title words or the full title wins and reveals the article', () => {
  const partial = submitGuess(game(), 'blaue').game;
  assert.equal(isWon(partial), false);
  const won = submitGuess(partial, 'Bruecke').game;
  assert.equal(isWon(won), true);
  assert.equal(isRevealed(tokenize('Kilometer')[0], won), true);
  assert.equal(submitGuess(won, 'Fluss').outcome, 'finished');
  assert.equal(isWon(submitGuess(game(), 'Die blaue Bruecke').game), true);
  assert.equal(isRevealed(tokenize('die')[0], game(), true), true);
  assert.equal(isRevealed(tokenize('42!')[0], game()), true);
});

test('hints reveal recurring non-title words, remain distinct, and stop after finishing', () => {
  const initial = game();
  const hinted = applyHint(initial);
  assert.deepEqual(hinted.hints, ['fluss']);
  assert.deepEqual(initial.hints, []);
  assert.equal(submitGuess(hinted, 'Fluss').outcome, 'duplicate');
  let current = hinted;
  for (let i = 0; i < 30 && !isWon(current); i++) current = applyHint(current);
  assert.equal(isWon(current), true);
  assert.equal(new Set(current.hints).size, current.hints.length);
  assert.equal(applyHint(current), current);
  const givenUp = { ...game(), givenUp: true };
  assert.equal(isWon(givenUp), false);
  assert.equal(isRevealed(tokenize('Brücke')[0], givenUp), true);
  assert.equal(applyHint(givenUp), givenUp);
  assert.equal(submitGuess(givenUp, 'Brücke').outcome, 'finished');
});

test('every bundled article can be solved by entering its complete title', () => {
  for (const article of WIKI_ARTICLES) {
    const current = { ...game(), puzzleId: article.id };
    const result = submitGuess(current, article.title);
    assert.equal(result.outcome, 'hit', article.title);
    assert.equal(isWon(result.game), true, article.title);
  }
});

import { countLetters } from '../../src/lib/wikiland-engine';

test('letter counts ignore decomposed accents and punctuation', () => {
  assert.equal(countLetters('A\u0308pfel'), 5);
  assert.equal(countLetters('Straße'), 6);
  assert.equal(countLetters('é-2'), 1);
});


test('full revision drives guesses, repeated words, hints and title matching', () => {
  const full = { ...fixture, title: 'Die blaue Brücke (Bauwerk)', paragraphs: ['Quarz Quarz an einem Fluss.', 'Ein Abschnitt mit Quarz und einer Brücke.'] };
  const result = submitGuess(game(), 'Quarz', full);
  assert.equal(result.hits, 3);
  assert.equal(isRevealed(tokenize('Quarz')[0], result.game, false, full), true);
  const hinted = applyHint(game(), full);
  assert.deepEqual(hinted.hints, ['quarz']);
  assert.equal(hasValidHints(hinted, full), true);
  assert.equal(hasValidHints({ ...hinted, hints: ['fehlt'] }, full), false);
  const solved = submitGuess(game(), 'Die blaue Brücke Bauwerk', full);
  assert.equal(isWon(solved.game, full), true);
});


test('legacy solved games stay solved with a newly restored title suffix', () => {
  const legacy = { ...game(), guesses: ['die blaue bruecke'] };
  const full = { ...fixture, title: 'Die blaue Brücke (Bauwerk)' };
  assert.equal(isWon(legacy, full), false);
  const migrated = upgradeLegacyGame(legacy);
  assert.equal(isWon(migrated, full), true);
  assert.deepEqual(migrated.guesses, legacy.guesses);
  assert.deepEqual(migrated.hints, legacy.hints);
});

test('new games do not acquire legacy win status on reload', () => {
  const current = { ...game(), revisionAware: true, guesses: ['blaue', 'bruecke'] };
  const full = { ...fixture, title: 'Die blaue Brücke (Bauwerk)' };
  assert.equal(isWon(upgradeLegacyGame(current), full), false);
});
