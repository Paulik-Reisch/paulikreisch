export const WORTHAFT_WORDS_COLLECTION = 'worthaft-words';
export const WORTHAFT_ANTI_WORDS_COLLECTION = 'worthaft-anti-words';
export const WORTHAFT_WORD_LIST_DOCUMENT = 'current';

export type WorthaftWordLists = {
  words: string[];
  antiWords: string[];
};

export function parseWorthaftWordList(value: unknown, listName: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`The Worthaft ${listName} list must be a non-empty array.`);
  }

  return value.map((entry, index) => {
    if (typeof entry !== 'string') {
      throw new Error(`The Worthaft ${listName} list has an invalid entry at index ${index}.`);
    }

    const word = entry.trim().normalize('NFC').toLocaleLowerCase('de');
    if (!/^[a-zäöüß]{5}$/.test(word)) {
      throw new Error(`The Worthaft ${listName} list has an invalid word at index ${index}.`);
    }

    return word;
  });
}
