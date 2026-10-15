export type InvalidWorthaftWord = {
  word: string;
  isKnownInvalid: boolean;
};

export type InvalidWordVoteAction = 'show-reviewed-message' | 'dismiss' | 'submit';

export const createInvalidWorthaftWord = (
  word: string,
  isKnownInvalid: boolean,
): InvalidWorthaftWord | null => {
  const trimmedWord = word.trim();
  return trimmedWord ? { word: trimmedWord, isKnownInvalid } : null;
};

export const getInvalidWordVoteAction = (
  isKnownInvalid: boolean,
  shouldExist: boolean,
): InvalidWordVoteAction => {
  if (!isKnownInvalid) return 'submit';
  return shouldExist ? 'show-reviewed-message' : 'dismiss';
};
