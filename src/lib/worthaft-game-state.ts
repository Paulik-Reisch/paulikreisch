export type WorthaftGameStatus = 'playing' | 'won' | 'lost';

export const canInteractWithWorthaftGame = (gameState: WorthaftGameStatus): boolean =>
  gameState === 'playing';
