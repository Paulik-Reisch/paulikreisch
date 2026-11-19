/** German capital sharp s occupies one tile, unlike Unicode's default SS expansion. */
export function uppercaseWorthaftWord(word: string): string {
  return word.normalize('NFC').replace(/ß/g, 'ẞ').toUpperCase();
}

/** Ignore control keys and multi-letter values instead of putting them in one tile. */
export function getWorthaftKeyboardLetter(key: string): string | null {
  const letter = uppercaseWorthaftWord(key);
  return /^[A-ZÄÖÜẞ]$/.test(letter) ? letter : null;
}
