import { getWorthaftWordOfTheDay } from './worthaft-daily-word';
import { parseWorthaftWordList, type WorthaftWordLists } from './worthaft-word-list-shared';

export type WordListChange = {
  beforeCount: number;
  afterCount: number;
  added: string[];
  removed: string[];
  orderChanged: boolean;
  duplicates: string[];
};

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function compare(before: string[], after: string[]): WordListChange {
  const previous = new Set(before);
  const next = new Set(after);
  const seen = new Set<string>();
  const duplicates = after.filter(word => {
    const duplicate = seen.has(word);
    seen.add(word);
    return duplicate;
  });
  return {
    beforeCount: before.length,
    afterCount: after.length,
    added: unique(after.filter(word => !previous.has(word))),
    removed: unique(before.filter(word => !next.has(word))),
    orderChanged: before.length !== after.length || before.some((word, i) => after[i] !== word),
    duplicates: unique(duplicates),
  };
}

/** Preview only. This module does not read or write Firestore or expire a cache. */
export function previewWorthaftListEdit(before: WorthaftWordLists, candidate: {
  words: unknown;
  antiWords: unknown;
}, date: string) {
  // Reject impossible calendar dates before using the existing selector.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T12:00:00Z`)) ||
      new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) {
    throw new Error('Invalid Berlin calendar date.');
  }
  const previous = {
    words: parseWorthaftWordList(before.words, 'words'),
    antiWords: parseWorthaftWordList(before.antiWords, 'anti-words'),
  };
  const normalized = {
    words: parseWorthaftWordList(candidate.words, 'words'),
    antiWords: parseWorthaftWordList(candidate.antiWords, 'anti-words'),
  };
  const wordChanges = compare(previous.words, normalized.words);
  const blockedChanges = compare(previous.antiWords, normalized.antiWords);
  const blocked = new Set(normalized.antiWords);
  const selectionBeforeRestart = getWorthaftWordOfTheDay(previous.words, date);
  const selectionAfterRestart = getWorthaftWordOfTheDay(normalized.words, date);
  return {
    normalized,
    wordChanges,
    blockedChanges,
    overlap: unique(normalized.words.filter(word => blocked.has(word))),
    // Never label this the actual pinned live answer: it is derived from arrays.
    selectionBeforeRestart,
    selectionAfterRestart,
    derivedAnswerChanges: selectionBeforeRestart !== selectionAfterRestart,
    scheduleMayChange: wordChanges.orderChanged,
    changed: wordChanges.orderChanged || blockedChanges.orderChanged,
  };
}

/** Compare an editor snapshot in the same transaction that eventually writes. */
export function worthaftEditorSnapshotMatches(expected: WorthaftWordLists, actual: WorthaftWordLists): boolean {
  return JSON.stringify(expected.words) === JSON.stringify(actual.words)
    && JSON.stringify(expected.antiWords) === JSON.stringify(actual.antiWords);
}
