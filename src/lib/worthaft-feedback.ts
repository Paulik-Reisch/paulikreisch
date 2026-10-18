export type WorthaftVote = 'up' | 'down';

export const getWorthaftVoteDescription = (vote: WorthaftVote): string =>
  vote === 'up' ? 'gut' : 'nicht gut';

/** A skipped prompt is a local choice, never a submitted vote. */
export const hasWorthaftFeedbackDecision = (
  storage: Pick<Storage, 'getItem'>,
  date: string,
): boolean => {
  try {
    const decision = storage.getItem(`worthaft-feedback-${date}`);
    return decision === 'true' || decision === 'skipped';
  } catch {
    // Storage can be unavailable; feedback stays optional for this visit.
    return false;
  }
};
