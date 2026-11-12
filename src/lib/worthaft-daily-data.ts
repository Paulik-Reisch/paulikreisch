import 'server-only';
import {createHash} from 'node:crypto';
import {getAdminDb} from './firebase-admin';
import {createPersistentDailyResolver,preserveDailyAnswer,persistentDailyEnabled} from './worthaft-persistent-daily';
import {persistentDailyWordStore} from './worthaft-persistent-daily-store';

import { unstable_cache } from 'next/cache';
import { firebaseConfig } from '@/firebase/config';
import { WORTHAFT_ANTI_WORDS } from './worthaft-anti-words';
import {
  WORTHAFT_WORD_LISTS_CACHE_TAG,
  WORTHAFT_WORD_LISTS_REVALIDATE_SECONDS,
  buildWorthaftDailyData,
  createDailyWordPin,
  type WorthaftDailyData,
} from './worthaft-cache-policy';
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

export type { WorthaftDailyData };

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

// The lists are cached for seven days, independent of the date. The word of the
// day is derived from them on each request, so the date is not part of the cache key.
const getCachedWordLists = unstable_cache(
  async (): Promise<WorthaftWordLists> => {
    const [words, antiWords] = await Promise.all([
      fetchWorthaftWordList(WORTHAFT_WORDS_COLLECTION, 'words'),
      fetchWorthaftWordList(WORTHAFT_ANTI_WORDS_COLLECTION, 'anti-words'),
    ]);

    return { words, antiWords };
  },
  ['worthaft-word-lists-v2'],
  { revalidate: WORTHAFT_WORD_LISTS_REVALIDATE_SECONDS, tags: [WORTHAFT_WORD_LISTS_CACHE_TAG] },
);

// Today's word stays fixed in this process even if the lists are refreshed during the day.
const pinDailyWord = createDailyWordPin();

let persistentResolver:ReturnType<typeof createPersistentDailyResolver>|undefined;
export async function getWorthaftDailyData(date: string): Promise<WorthaftDailyData> {
  if(persistentDailyEnabled()){
    // Never silently select a different bundled answer while durable state is required.
    const lists=await getCachedWordLists();
    persistentResolver??=createPersistentDailyResolver(persistentDailyWordStore(getAdminDb()));
    const sourceRevision=createHash('sha256').update(JSON.stringify(lists.words)).digest('hex');
    const word=await persistentResolver(date,lists.words,sourceRevision);
    return {...preserveDailyAnswer(lists,word),usedBundledFallback:false};
  }
  try {
    return buildWorthaftDailyData(await getCachedWordLists(), date, false, pinDailyWord);
  } catch (error) {
    console.error('Failed to load the cached Worthaft word lists from Firestore; using bundled lists.', error);
    return buildWorthaftDailyData({ words: [...WORDS], antiWords: [...WORTHAFT_ANTI_WORDS] }, date, true, pinDailyWord);
  }
}
