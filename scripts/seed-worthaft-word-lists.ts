import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config';
import { WORTHAFT_ANTI_WORDS } from '../src/lib/worthaft-anti-words';
import {
  WORTHAFT_ANTI_WORDS_COLLECTION,
  WORTHAFT_WORDS_COLLECTION,
  WORTHAFT_WORD_LIST_DOCUMENT,
  parseWorthaftWordList,
} from '../src/lib/worthaft-word-lists';
import { WORDS } from '../src/lib/worthaft-words';

async function seedWordLists() {
  const words = parseWorthaftWordList(WORDS, 'words');
  const antiWords = parseWorthaftWordList(WORTHAFT_ANTI_WORDS, 'anti-words');
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const wordsRef = doc(firestore, WORTHAFT_WORDS_COLLECTION, WORTHAFT_WORD_LIST_DOCUMENT);
  const antiWordsRef = doc(firestore, WORTHAFT_ANTI_WORDS_COLLECTION, WORTHAFT_WORD_LIST_DOCUMENT);
  const [wordsDocument, antiWordsDocument] = await Promise.all([
    getDoc(wordsRef),
    getDoc(antiWordsRef),
  ]);

  if (wordsDocument.exists() || antiWordsDocument.exists()) {
    throw new Error('Worthaft word-list documents already exist; refusing to overwrite Firestore data.');
  }

  const batch = writeBatch(firestore);
  batch.set(wordsRef, { words });
  batch.set(antiWordsRef, { words: antiWords });
  await batch.commit();

  console.log(`Seeded ${words.length} words and ${antiWords.length} anti-words in Firestore (default).`);
}

seedWordLists().catch((error: unknown) => {
  console.error('Failed to seed Worthaft word lists.', error);
  process.exitCode = 1;
});
