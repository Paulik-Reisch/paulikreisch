import { doc, type Firestore } from 'firebase/firestore';
import { getDocMetered } from './firestore-read-metering';
import {
  WORTHAFT_ANTI_WORDS_COLLECTION,
  WORTHAFT_WORD_LIST_DOCUMENT,
  WORTHAFT_WORDS_COLLECTION,
  parseWorthaftWordList,
  type WorthaftWordLists,
} from './worthaft-word-list-shared';

export {
  WORTHAFT_ANTI_WORDS_COLLECTION,
  WORTHAFT_WORD_LIST_DOCUMENT,
  WORTHAFT_WORDS_COLLECTION,
  parseWorthaftWordList,
  type WorthaftWordLists,
} from './worthaft-word-list-shared';

export async function loadWorthaftWordLists(firestore: Firestore): Promise<WorthaftWordLists> {
  const [wordsDocument, antiWordsDocument] = await Promise.all([
    getDocMetered('loadWorthaftWordLists', doc(firestore, WORTHAFT_WORDS_COLLECTION, WORTHAFT_WORD_LIST_DOCUMENT)),
    getDocMetered('loadWorthaftWordLists', doc(firestore, WORTHAFT_ANTI_WORDS_COLLECTION, WORTHAFT_WORD_LIST_DOCUMENT)),
  ]);

  if (!wordsDocument.exists() || !antiWordsDocument.exists()) {
    throw new Error('The Worthaft word-list documents are missing from Firestore.');
  }

  return {
    words: parseWorthaftWordList(wordsDocument.data().words, 'words'),
    antiWords: parseWorthaftWordList(antiWordsDocument.data().words, 'anti-words'),
  };
}
