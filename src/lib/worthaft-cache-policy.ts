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

export function buildWorthaftDailyData(
  lists: WorthaftWordLists,
  date: string,
  usedBundledFallback = false,
): WorthaftDailyData {
  return {
    words: lists.words,
    antiWords: lists.antiWords,
    word: getWorthaftWordOfTheDay(lists.words, date),
    usedBundledFallback,
  };
}
