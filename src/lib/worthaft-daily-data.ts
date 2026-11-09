import 'server-only';

import { unstable_cache } from 'next/cache';
import { firebaseConfig } from '@/firebase/config';
import { WORTHAFT_ANTI_WORDS } from './worthaft-anti-words';
import { getWorthaftWordOfTheDay } from './worthaft-daily-word';
import { recordFirestoreReads } from './firestore-read-metering';
import { WORDS } from './worthaft-words';
import {
  WORTHAFT_ANTI_WORDS_COLLECTION,
  WORTHAFT_WORD_LIST_DOCUMENT,
  WORTHAFT_WORDS_COLLECTION,
  parseWorthaftWordList,
  type WorthaftWordLists,
} from './worthaft-word-list-shared';

type FirestoreDocument = {
  fields?: {
    words?: {
      arrayValue?: {
        values?: { stringValue?: unknown }[];
      };
    };
  };
};

export type WorthaftDailyData = WorthaftWordLists & {
  word: string;
  usedBundledFallback: boolean;
};

async function fetchWorthaftWordList(collectionName: string, listName: string): Promise<string[]> {
  const documentUrl = new URL(
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}/${WORTHAFT_WORD_LIST_DOCUMENT}`,
  );
  documentUrl.searchParams.set('key', firebaseConfig.apiKey);

  const response = await fetch(documentUrl);
  recordFirestoreReads('fetchWorthaftWordList', 1);
  if (!response.ok) {
    throw new Error(`Firestore returned HTTP ${response.status} for the Worthaft ${listName} list.`);
  }

  const document = (await response.json()) as FirestoreDocument;
  const values = document.fields?.words?.arrayValue?.values?.map(({ stringValue }) => stringValue);
  return parseWorthaftWordList(values, listName);
}

const getCachedDailyData = unstable_cache(
  async (date: string): Promise<WorthaftDailyData> => {
    const [words, antiWords] = await Promise.all([
      fetchWorthaftWordList(WORTHAFT_WORDS_COLLECTION, 'words'),
      fetchWorthaftWordList(WORTHAFT_ANTI_WORDS_COLLECTION, 'anti-words'),
    ]);

    return {
      words,
      antiWords,
      word: getWorthaftWordOfTheDay(words, date),
      usedBundledFallback: false,
    };
  },
  ['worthaft-daily-data-v1'],
  { revalidate: 48 * 60 * 60 },
);

export async function getWorthaftDailyData(date: string): Promise<WorthaftDailyData> {
  try {
    return await getCachedDailyData(date);
  } catch (error) {
    console.error('Failed to load the cached Worthaft word lists from Firestore; using bundled lists.', error);
    return {
      words: [...WORDS],
      antiWords: [...WORTHAFT_ANTI_WORDS],
      word: getWorthaftWordOfTheDay(WORDS, date),
      usedBundledFallback: true,
    };
  }
}
