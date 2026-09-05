"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ArrowLeft, RotateCcw, Trophy, Share2, Sparkles, Info, Settings as Gear } from 'lucide-react';
import Link from 'next/link';
import { WORDS } from '@/lib/worthaft-words';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

type DailyGameState = {
  date: string;
  guesses: { guess: string; statuses: LetterStatus[] }[];
  status: 'won' | 'lost' | 'playing';
  letterStatuses: { [key: string]: LetterStatus };
  rowTimes?: number[];
};

const getWordOfTheDay = () => {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const startDate = new Date('2024-01-01');
  const localToday = new Date(todayString);
  const diffTime = Math.abs(localToday.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return WORDS[diffDays % WORDS.length].toUpperCase();
};

const Keyboard = ({ onChar, onEnter, onDelete, letterStatuses, gameState }: {
  onChar: (value: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  letterStatuses: { [key: string]: LetterStatus };
  gameState: 'playing' | 'won' | 'lost';
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['SEND', 'Ü', 'Ö', 'Ä', 'ẞ', 'DELETE'],
  ];

  const getStatusClass = (key: string) => {
    const status = letterStatuses[key];
    switch (status) {
      case 'correct': return 'bg-primary text-primary-foreground';
      case 'present': return 'bg-secondary text-secondary-foreground';
      case 'absent': return 'bg-neutral-600 text-neutral-100 border-neutral-600 opacity-80';
      default: return 'bg-muted hover:bg-accent';
    }
  };

  const handleKeyClick = (key: string) => {
    if (key === 'SEND') onEnter();
    else if (key === 'DELETE') onDelete();
    else onChar(key);
  };

  return (
    <div className="w-full flex flex-col items-center gap-1.5 mt-8">
      {rows.slice(0, 3).map((row, i) => (
        <div key={i} className="flex flex-row justify-center gap-1.5 w-full">
          {row.map(key => (
            <Button
              key={key}
              onClick={() => handleKeyClick(key)}
              variant="outline"
              className={cn(
                'h-10 w-10 min-w-0 font-bold uppercase flex items-center justify-center transition-colors duration-300 rounded-lg',
                getStatusClass(key)
              )}
              disabled={gameState !== 'playing'}
            >
              {key === 'DELETE' ? <ArrowLeft className="h-5 w-5" /> : <span>{key}</span>}
            </Button>
          ))}
        </div>
      ))}

      {/* Bottom row: SEND + Special chars + DELETE */}
      <div className="flex flex-row justify-center gap-1.5 w-full">
        {['SEND', 'Ü', 'Ö', 'Ä', 'ẞ', 'DELETE'].map(key => {
          const isSend = key === 'SEND';
          const isDelete = key === 'DELETE';
          return (
            <Button
              key={key}
              onClick={() => handleKeyClick(key)}
              variant="outline"
              className={cn(
                'h-10 min-w-0 font-bold uppercase flex items-center justify-center transition-colors duration-300 rounded-lg px-3',
                isSend && 'w-[60px]',
                getStatusClass(key)
              )}
              disabled={gameState !== 'playing'}
            >
              {key === 'DELETE' ? <ArrowLeft className="h-5 w-5" /> : <span>{key}</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

const Grid = ({ guesses, currentGuess, isShaking, currentRowIndex, activeIndex, gameState }: {
  guesses: { guess: string; statuses: LetterStatus[] }[];
  currentGuess: string[];
  isShaking: boolean;
  currentRowIndex: number;
  activeIndex: number;
  gameState: 'playing' | 'won' | 'lost';
}) => {
  const rows = Array.from({ length: MAX_GUESSES });
  const getStatusClass = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'bg-primary text-primary-foreground border-primary';
      case 'present': return 'bg-secondary text-secondary-foreground border-secondary';
      case 'absent': return 'bg-muted text-muted-foreground border-muted';
      default: return 'border-border bg-background';
    }
  };

  const winningRowIndex = gameState === 'won' ? guesses.length - 1 : -1;

  return (
    <div className="grid grid-rows-6 gap-1.5">
      {rows.map((_, rowIndex) => {
        const guessInfo = guesses[rowIndex];
        const isWonRow = rowIndex === winningRowIndex;

        return (
        <div key={rowIndex} className={cn(
          "grid grid-cols-5 gap-1.5 relative",
          isShaking && rowIndex === currentRowIndex && "animate-shake",
          isWonRow && "win-shimmer"
        )}>
          {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
            const isCurrentRow = rowIndex === guesses.length;

            let letter;
            if (isCurrentRow && gameState === 'playing') {
                letter = currentGuess[colIndex];
            } else if (guessInfo) {
                letter = guessInfo.guess[colIndex];
            }

            const hasLetter = !!letter;
            const status: LetterStatus = guessInfo?.statuses[colIndex] || 'empty';
            const isSubmittedRow = !!guessInfo;
            const flipDelay = `${colIndex * 0.25}s`;
            const bounceDelay = isWonRow ? `${colIndex * 0.18}s` : undefined;
            const isWonCorrect = isWonRow && status === 'correct';
            const isPresent = status === 'present' && isSubmittedRow;
            const presentBounceDelay = `${(0.25 * colIndex + 0.5).toFixed(2)}s`;

            let cellAnimation: string | undefined;
            if (isSubmittedRow) {
              if (isWonCorrect) {
                cellAnimation = `flip-in 0.5s ease ${flipDelay} both, bounce-up 0.6s ease ${bounceDelay} both, bounce-up-glow 0.6s ease ${bounceDelay} both`;
              } else if (isPresent) {
                cellAnimation = `flip-in 0.5s ease ${flipDelay} both, bounce-up 0.4s ease ${presentBounceDelay} both`;
              } else {
                cellAnimation = `flip-in 0.5s ease ${flipDelay} both`;
              }
            }

            return (
                <motion.div
                    key={colIndex}
                    onClick={() => {
                        if (isCurrentRow) {
                           // No-op for classic - no cell click to edit
                       }
                   }}
                    className={cn(
                        'aspect-square border-2 flex items-center justify-center text-3xl sm:text-4xl font-bold',
                        getStatusClass(status),
                    )}
                    style={{
                      animationDelay: isSubmittedRow ? flipDelay : undefined,
                      ...(cellAnimation ? { animation: cellAnimation } : {}),
                    }}
                >
                    {letter}
                </motion.div>
            );
          })}
        </div>
        );
      })}
    </div>
  );
};

const ResultsContent = ({ solution, guesses, gameState, stats, timeToNextGame, shareResults, shareSolution, rowTimes }: {
    solution: string;
    guesses: { guess: string; statuses: LetterStatus[] }[];
    gameState: 'playing' | 'won' | 'lost';
    stats: { games: number; wins: number; streak: number; maxStreak: number; };
    timeToNextGame: string;
    shareResults: () => void;
    shareSolution: () => void;
    rowTimes: number[];
}) => {
    const winRate = stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0;
    const totalTime = rowTimes.reduce((sum, t) => sum + t, 0);
    const formatDurationLocal = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
    };

    return (
        <div className="space-y-6 w-full max-w-md">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                    <Trophy className="h-5 w-5" />
                    <span className="font-bold">Worthaft Classic</span>
                </div>
                <p className="mt-2 text-muted-foreground">
                    {gameState === 'won' ? 'Gewonnen!' : gameState === 'lost' ? `Lösung: ${solution}` : 'Spiel beendet'}
                </p>
            </div>

            {/* Grid replay */}
            <div className="flex justify-center">
                <Grid
                    guesses={guesses}
                    currentGuess={[]}
                    isShaking={false}
                    currentRowIndex={-1}
                    activeIndex={-1}
                    gameState={gameState}
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold font-headline">{stats.games}</p>
                    <p className="text-xs text-muted-foreground">Gespielt</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold font-headline text-green-600">{stats.wins}</p>
                    <p className="text-xs text-muted-foreground">Gewonnen</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold font-headline">{winRate}%</p>
                    <p className="text-xs text-muted-foreground">Quote</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold font-headline text-amber-600">{stats.maxStreak}</p>
                    <p className="text-xs text-muted-foreground">Best-Serie</p>
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                Serie: <span className="font-bold">{stats.streak}</span> | Zeit: {formatDurationLocal(totalTime)}
            </div>

            {/* Share buttons */}
            <div className="flex flex-col gap-2">
                <Button size="lg" onClick={shareResults} className="gap-2">
                    <Share2 className="h-5 w-5" />
                    Jetzt einen Freund herausfordern!
                </Button>
                <Button size="lg" variant="outline" onClick={shareSolution} className="gap-2">
                    <Share2 className="h-5 w-5" />
                    Jetzt Lösung teilen
                </Button>
            </div>

            {/* Next game countdown */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                Nächstes Wort in: <span className="font-mono font-bold">{timeToNextGame}</span>
            </div>
        </div>
    );
};

const GameEndDisplay = (props: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    solution: string;
    guesses: { guess: string; statuses: LetterStatus[] }[];
    gameState: 'playing' | 'won' | 'lost';
    stats: { games: number; wins: number; streak: number; maxStreak: number; };
    timeToNextGame: string;
    shareResults: () => void;
    shareSolution: () => void;
    rowTimes: number[];
}) => {
    return (
        <AnimatePresence>
            {props.isOpen && (
                <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader className="text-center">
                            <DialogTitle className="font-headline">Spiel beendet</DialogTitle>
                            <DialogDescription>Deine Statistiken & Teilen</DialogDescription>
                        </DialogHeader>
                        <ResultsContent
                            solution={props.solution}
                            guesses={props.guesses}
                            gameState={props.gameState}
                            stats={props.stats}
                            timeToNextGame={props.timeToNextGame}
                            shareResults={props.shareResults}
                            shareSolution={props.shareSolution}
                            rowTimes={props.rowTimes}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
};

export default function WorthaftClassicPage() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<{ guess: string; statuses: LetterStatus[] }[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(WORD_LENGTH).fill(''));
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [letterStatuses, setLetterStatuses] = useState<{ [key: string]: LetterStatus }>({});
  const [stats, setStats] = useState({ games: 0, wins: 0, streak: 0, maxStreak: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowTimes, setRowTimes] = useState<number[]>([]);
  const [rowStartTime, setRowStartTime] = useState<number>(Date.now());
  const [isShaking, setIsShaking] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNewGame, setIsNewGame] = useState(true);

  const loadStats = useCallback(() => {
    try {
      const saved = localStorage.getItem('worthaft-classic-stats');
      if (saved) setStats(JSON.parse(saved));
    } catch {}
  }, []);

  const saveStats = useCallback((newStats: typeof stats) => {
    setStats(newStats);
    try { localStorage.setItem('worthaft-classic-stats', JSON.stringify(newStats)); } catch {}
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const pickWord = useCallback(() => {
    const word = getWordOfTheDay();
    setSolution(word);
    setGuesses([]);
    setCurrentGuess(Array(WORD_LENGTH).fill(''));
    setLetterStatuses({});
    setGameState('playing');
    setRowTimes([]);
    setRowStartTime(Date.now());
    setActiveIndex(0);
    setIsNewGame(false);
  }, []);

  useEffect(() => {
    if (isNewGame) pickWord();
  }, [isNewGame, pickWord]);

  const handleChar = useCallback((char: string) => {
    if (gameState !== 'playing') return;
    if (activeIndex < WORD_LENGTH) {
      const newGuess = [...currentGuess];
      newGuess[activeIndex] = char;
      setCurrentGuess(newGuess);
      setActiveIndex(prev => Math.min(prev + 1, WORD_LENGTH));
    }
  }, [currentGuess, activeIndex, gameState]);

  const handleDelete = useCallback(() => {
    if (gameState !== 'playing') return;
    if (activeIndex > 0) {
      const newGuess = [...currentGuess];
      setActiveIndex(prev => prev - 1);
      newGuess[activeIndex - 1] = '';
      setCurrentGuess(newGuess);
    }
  }, [currentGuess, activeIndex, gameState]);

  const handleEnter = useCallback(() => {
    if (gameState !== 'playing') return;
    if (activeIndex !== WORD_LENGTH) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const guess = currentGuess.join('');
    if (!WORDS.some(w => w.toUpperCase() === guess)) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const now = Date.now();
    const rowTime = now - rowStartTime;
    const statuses: LetterStatus[] = [];
    const solutionChars = solution.split('');

    const solutionCharCounts: { [key: string]: number } = {};
    for (const c of solutionChars) {
      solutionCharCounts[c] = (solutionCharCounts[c] || 0) + 1;
    }

    const guessChars = guess.split('');

    // First pass: correct
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessChars[i] === solutionChars[i]) {
        statuses[i] = 'correct';
        solutionCharCounts[guessChars[i]]--;
      }
    }

    // Second pass: present / absent
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (statuses[i] === 'correct') continue;
      if (solutionCharCounts[guessChars[i]] && solutionCharCounts[guessChars[i]] > 0) {
        statuses[i] = 'present';
        solutionCharCounts[guessChars[i]]--;
      } else {
        statuses[i] = 'absent';
      }
    }

    const newGuesses = [...guesses, { guess, statuses }];
    const newLetterStatuses = { ...letterStatuses };
    for (let i = 0; i < WORD_LENGTH; i++) {
      const key = guessChars[i];
      const status = statuses[i];
      const current = newLetterStatuses[key];
      if (!current || current === 'absent' || (current === 'present' && status === 'correct')) {
        newLetterStatuses[key] = status;
      }
    }

    setGuesses(newGuesses);
    setLetterStatuses(newLetterStatuses);
    setRowTimes(prev => [...prev, rowTime]);
    setRowStartTime(now);
    setCurrentGuess(Array(WORD_LENGTH).fill(''));
    setActiveIndex(0);

    const won = statuses.every(s => s === 'correct');
    if (won) {
      setGameState('won');
      setStats(prev => {
        const newStreak = prev.streak + 1;
        return { games: prev.games + 1, wins: prev.wins + 1, streak: newStreak, maxStreak: Math.max(prev.maxStreak, newStreak) };
      });
      setTimeout(() => setIsDialogOpen(true), 1200);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState('lost');
      setStats(prev => ({ ...prev, games: prev.games + 1, streak: 0 }));
      setTimeout(() => setIsDialogOpen(true), 800);
    }
  }, [currentGuess, activeIndex, gameState, guesses, solution, letterStatuses, rowStartTime]);

  const shareResults = useCallback(async () => {
    const resultGrid = guesses.map((g) =>
      g.statuses.map(s =>
        s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬜'
      ).join('')
    ).join('\n');

    const text = `Worthaft Classic ${guesses.length}/${MAX_GUESSES}\n\n${resultGrid}\n\npaulikreisch.de/worthaft`;
    try { await navigator.share({ title: 'Worthaft Classic', text }); } catch { await navigator.clipboard.writeText(text); }
  }, [guesses]);

  const shareSolution = useCallback(async () => {
    const resultGrid = guesses.map((g) =>
      g.statuses.map(s =>
        s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬜'
      ).join('')
    ).join('\n');

    const text = `Worthaft Classic ${guesses.length}/${MAX_GUESSES} (Lösung: ${solution})\n\n${resultGrid}\n\npaulikreisch.de/worthaft`;
    try { await navigator.share({ title: 'Worthaft Classic', text }); } catch { await navigator.clipboard.writeText(text); }
  }, [guesses, solution]);

  const newGame = useCallback(() => {
    setIsNewGame(true);
    setIsDialogOpen(false);
    saveStats(stats);
  }, [saveStats, stats]);

  const timeToNextGame = (() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-headline font-bold text-4xl md:text-5xl mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Worthaft Classic
          </h1>
          <p className="text-muted-foreground">Puristisches Wordle — ohne Joker, ohne Settings, ohne Animationen-Konfiguration</p>
        </div>

        <div className="mb-8">
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            isShaking={isShaking}
            currentRowIndex={guesses.length}
            activeIndex={activeIndex}
            gameState={gameState}
          />
        </div>

        <div className="w-full max-w-md mb-8">
          <Keyboard
            onChar={handleChar}
            onEnter={handleEnter}
            onDelete={handleDelete}
            letterStatuses={letterStatuses}
            gameState={gameState}
          />
        </div>

        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="gap-1">
            <Trophy className="h-4 w-4" />
            Statistiken
          </Button>
          <Button variant="outline" size="sm" onClick={newGame} className="gap-1" disabled={gameState === 'playing' && guesses.length === 0}>
            <RotateCcw className="h-4 w-4" />
            Neues Wort (Morgen)
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mb-8">
          {stats.games > 0 && (
            <>
              Gespielt: {stats.games} | Gewonnen: {stats.wins} ({winRate}%) | Serie: {stats.streak} | Best: {stats.maxStreak}
            </>
          )}
        </div>
      </main>
      <Footer />

      <GameEndDisplay
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        solution={solution}
        guesses={guesses}
        gameState={gameState}
        stats={stats}
        timeToNextGame={timeToNextGame}
        shareResults={shareResults}
        shareSolution={shareSolution}
        rowTimes={rowTimes}
      />
    </div>
  );
}