export const WORTHAFT_ANTI_WORDS: readonly string[] = [
  'putos',
  'putot',
  'miose',
  'lochs',
  'putor',
  'rinse',
  'pinse',
  'risse',
  'fiess',
  'maise',
  'queen',
  'lenke',
  'kenne',
];

export const isWorthaftAntiWord = (
  word: string,
  antiWords: readonly string[] = WORTHAFT_ANTI_WORDS,
): boolean => {
  const normalizedWord = word.trim().toLocaleLowerCase('de');
  return antiWords.some((antiWord) => antiWord.trim().toLocaleLowerCase('de') === normalizedWord);
};
