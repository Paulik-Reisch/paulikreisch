import { getWorthaftWordOfTheDay } from './worthaft-daily-word';
import type { WorthaftWordLists } from './worthaft-word-list-shared';

/**
 * The word lists are cached for seven days. The daily word is not cached: it is
 * derived from the cached lists and the Europe/Berlin date on every request,
 * which costs no Firestore read.
 */
export const WORTHAFT_WORD_LISTS_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;
export const WORTHAFT_WORD_LISTS_CACHE_TAG = 'worthaft-word-lists';

export type WorthaftDailyData = WorthaftWordLists & {
  word: string;
  usedBundledFallback: boolean;
};

export type WordSelector = (words: readonly string[], date: string) => string;

export function buildWorthaftDailyData(
  lists: WorthaftWordLists,
  date: string,
  usedBundledFallback = false,
  selectWord: WordSelector = getWorthaftWordOfTheDay,
): WorthaftDailyData {
  return {
    words: lists.words,
    antiWords: lists.antiWords,
    word: selectWord(lists.words, date),
    usedBundledFallback,
  };
}

/**
 * Keeps the word of the current Berlin date fixed in memory once it was chosen,
 * so a refresh of the lists during the day does not change today's word. A new
 * date picks again from the current lists. The pin lives in the running server
 * process only: after a restart or deployment the word is derived again from
 * the lists that are loaded then.
 */
export function createDailyWordPin(select: WordSelector = getWorthaftWordOfTheDay): WordSelector {
  let pinned: { date: string; word: string } | null = null;

  return (words, date) => {
    if (pinned && pinned.date === date) {
      return pinned.word;
    }

    const word = select(words, date);
    pinned = { date, word };
    return word;
  };
}
