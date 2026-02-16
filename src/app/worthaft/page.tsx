'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WORDS } from '@/lib/worthaft-words';
import { Share2 } from 'lucide-react';
import Link from 'next/link';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

// Select a word for the day
const getWordOfTheDay = () => {
  const startDate = new Date('2024-01-01');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return WORDS[diffDays % WORDS.length].toUpperCase();
};

const Keyboard = ({ onChar, onEnter, onDelete, letterStatuses }: { onChar: (value: string) => void; onEnter: () => void; onDelete: () => void; letterStatuses: { [key: string]: LetterStatus } }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
    ['ENTER', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
  ];

  const getStatusClass = (key: string) => {
    const status = letterStatuses[key];
    switch (status) {
      case 'correct': return 'bg-primary text-primary-foreground';
      case 'present': return 'bg-secondary text-secondary-foreground';
      case 'absent': return 'bg-muted text-muted-foreground opacity-60';
      default: return 'bg-muted hover:bg-accent';
    }
  };

  return (
    <div className="space-y-2 mt-8">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((key) => (
            <Button
              key={key}
              variant="outline"
              onClick={() => {
                if (key === 'ENTER') onEnter();
                else if (key === 'DELETE') onDelete();
                else onChar(key);
              }}
              className={cn(
                'h-12 font-bold text-sm sm:text-base transition-colors duration-300 flex-1',
                key.length > 1 ? 'px-2' : 'sm:flex-none sm:w-10 px-0',
                getStatusClass(key)
              )}
            >
              {key === 'DELETE' ? '⌫' : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

const Grid = ({ guesses, currentGuess }: { guesses: { guess: string; statuses: LetterStatus[] }[]; currentGuess: string }) => {
  const rows = Array.from({ length: MAX_GUESSES });
  const getStatusClass = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'bg-primary text-primary-foreground border-primary';
      case 'present': return 'bg-secondary text-secondary-foreground border-secondary';
      case 'absent': return 'bg-muted text-muted-foreground border-muted';
      default: return 'border-border bg-background';
    }
  };

  return (
    <div className="grid grid-rows-6 gap-2">
      {rows.map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
            const guessInfo = guesses[rowIndex];
            const isCurrentRow = rowIndex === guesses.length;
            const letter = isCurrentRow ? currentGuess[colIndex] : guessInfo?.guess[colIndex];
            const status = guessInfo?.statuses[colIndex] || 'empty';
            const hasLetter = !!letter;

            return (
                <div
                    key={colIndex}
                    className={cn(
                        'w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-3xl font-bold rounded-md transition-all duration-500',
                        getStatusClass(status),
                        isCurrentRow && hasLetter && 'border-muted-foreground',
                        status !== 'empty' && 'animate-in fade-in zoom-in-50'
                    )}
                    style={{ animationDelay: `${'\'\'\''}${colIndex * 100}ms'\'\'\''` }}
                >
                    {letter}
                </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};


export default function WorthaftPage() {
    const { toast } = useToast();
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState<{ guess: string; statuses: LetterStatus[] }[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [letterStatuses, setLetterStatuses] = useState<{ [key: string]: LetterStatus }>({});
    const [stats, setStats] = useState({ games: 0, wins: 0, streak: 0 });
    
    useEffect(() => {
        setSolution(getWordOfTheDay());
        const savedStats = localStorage.getItem('worthaft-stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    const handleChar = (char: string) => {
        if (gameState !== 'playing' || currentGuess.length >= WORD_LENGTH) return;
        setCurrentGuess(currentGuess + char);
    };

    const handleEnter = useCallback(() => {
        if (gameState !== 'playing' || currentGuess.length !== WORD_LENGTH) return;

        if (!WORDS.includes(currentGuess.toLowerCase())) {
            toast({ variant: 'destructive', title: 'Ungültiges Wort', description: 'Dieses Wort steht nicht in unserem Duden.' });
            return;
        }

        const newStatuses: LetterStatus[] = Array(WORD_LENGTH).fill('absent');
        const solutionLetters = solution.split('');

        // First pass for correct letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (currentGuess[i] === solution[i]) {
                newStatuses[i] = 'correct';
                solutionLetters[i] = '_';
            }
        }

        // Second pass for present letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (newStatuses[i] !== 'correct' && solutionLetters.includes(currentGuess[i])) {
                newStatuses[i] = 'present';
                solutionLetters[solutionLetters.indexOf(currentGuess[i])] = '_';
            }
        }
        
        const newGuess = { guess: currentGuess, statuses: newStatuses };
        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);

        // Update keyboard statuses
        const newLetterStatuses = { ...letterStatuses };
        for (let i = 0; i < WORD_LENGTH; i++) {
            const letter = currentGuess[i];
            const currentStatus = newLetterStatuses[letter];
            const newStatus = newStatuses[i];
            if (currentStatus !== 'correct') {
                newLetterStatuses[letter] = newStatus;
            }
        }
        setLetterStatuses(newLetterStatuses);
        
        setCurrentGuess('');

        // Check game state
        if (currentGuess === solution) {
            setGameState('won');
            const newStats = { games: stats.games + 1, wins: stats.wins + 1, streak: stats.streak + 1 };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
        } else if (newGuesses.length === MAX_GUESSES) {
            setGameState('lost');
            const newStats = { games: stats.games + 1, wins: stats.wins, streak: 0 };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
        }
    }, [currentGuess, gameState, guesses, letterStatuses, solution, stats.games, stats.streak, stats.wins, toast]);

    const handleDelete = () => {
        if (gameState !== 'playing') return;
        setCurrentGuess(currentGuess.slice(0, -1));
    };
    
    const isDialogOpen = gameState === 'won' || gameState === 'lost';

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (gameState !== 'playing' || isDialogOpen) return;

        if (event.key === 'Enter') {
            handleEnter();
        } else if (event.key === 'Backspace') {
            handleDelete();
        } else if (/^[a-zA-ZäöüÄÖÜ]$/.test(event.key)) {
            handleChar(event.key.toUpperCase());
        }
    }, [gameState, isDialogOpen, handleEnter, handleDelete, handleChar]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const shareResults = () => {
        const title = 'Worthaft - Das Paulik & Reisch Wortspiel';
        const resultGrid = guesses.map(g => 
            g.statuses.map(s => {
                if (s === 'correct') return '🟦';
                if (s === 'present') return '🟨';
                return '⬛';
            }).join('')
        ).join('\n');
        
        const text = `${'\'\'\''}${title}\n${gameState === 'won' ? guesses.length : 'X'}/${MAX_GUESSES}\n\n${resultGrid}\n\nhttps://paulik-reisch.de/worthaft'\'\'\''}`;
        
        navigator.clipboard.writeText(text).then(() => {
            toast({ title: 'Kopiert!', description: 'Ergebnis in die Zwischenablage kopiert. Teile es mit der Welt!' });
        });
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Worthaft',
        description: 'Ein tägliches Worträtselspiel im Stil von Wordle, präsentiert von den Satire-Autoren Paulik & Reisch.',
        url: 'https://paulik-reisch.de/worthaft',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Paulik & Reisch',
          url: 'https://paulik-reisch.de'
        },
        keywords: 'Wordle, Wortspiel, Rätsel, Deutsch, Worthaft'
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
             <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <main className="flex-1 py-8 md:py-12">
                <div className="container max-w-md mx-auto flex flex-col items-center justify-center">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold font-headline">Worthaft</h1>
                        <p className="text-muted-foreground">Eine Hommage von <Link href="/ueber/autoren" className="underline">Paulik & Reisch</Link>. <Link href="/worthaft/ueber" className="underline">Wie funktioniert's?</Link></p>
                    </div>
                    <Grid guesses={guesses} currentGuess={currentGuess} />
                    <Keyboard onChar={handleChar} onEnter={handleEnter} onDelete={handleDelete} letterStatuses={letterStatuses} />
                </div>
            </main>
            <Footer />
            <AlertDialog open={isDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl font-headline">
                        {gameState === 'won' ? 'Gratulation!' : 'Schade!'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {gameState === 'won' 
                            ? `Sie haben das Wort in ${guesses.length} Versuchen erraten.`
                            : `Das richtige Wort war: `}
                        <span className="font-bold text-lg text-primary">{solution}</span>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="text-center space-y-4">
                        <h4 className="font-bold">Statistik</h4>
                        <div className="flex justify-around">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{stats.games}</div>
                                <div className="text-xs">Spiele</div>
                            </div>
                             <div className="text-center">
                                <div className="text-3xl font-bold">{stats.wins > 0 ? Math.round((stats.wins / stats.games) * 100) : 0}%</div>
                                <div className="text-xs">Gewonnen</div>
                            </div>
                             <div className="text-center">
                                <div className="text-3xl font-bold">{stats.streak}</div>
                                <div className="text-xs">Siegesserie</div>
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter className="mt-4">
                        <Button variant="outline" onClick={shareResults}>
                            <Share2 className="mr-2 h-4 w-4" /> Teilen
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
