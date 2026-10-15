export type WorthaftVote = 'up' | 'down';

export const getWorthaftVoteDescription = (vote: WorthaftVote): string =>
  vote === 'up' ? 'gut' : 'nicht gut';
