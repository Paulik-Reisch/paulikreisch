'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WORDS } from '@/lib/worthaft-words';
import { Share2, Book, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { WorthaftIcon } from '@/components/ui/icons/worthaft-icon';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

type DailyGameState = {
  date: string;
  guesses: { guess: string; statuses: LetterStatus[] }[];
  status: 'won' | 'lost';
};


// Select a word for the day
const getWordOfTheDay = () => {
  const startDate = new Date('2024-01-01');
  const today = new Date();
  today.setHours(0,0,0,0); // Normalize to start of day
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
    <div className="space-y-1.5 mt-8">
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
                'h-12 font-bold text-sm sm:text-base transition-colors duration-300 flex-1 p-0',
                key.length > 1 ? 'px-2' : 'sm:flex-none sm:w-10',
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

const Grid = ({ guesses, currentGuess, isShaking, currentRowIndex, activeIndex, onCellClick }: { 
    guesses: { guess: string; statuses: LetterStatus[] }[]; 
    currentGuess: string[]; 
    isShaking: boolean; 
    currentRowIndex: number;
    activeIndex: number;
    onCellClick: (index: number) => void;
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

  return (
    <div className="grid grid-rows-6 gap-1.5">
      {rows.map((_, rowIndex) => (
        <div key={rowIndex} className={cn(
          "grid grid-cols-5 gap-1.5",
          isShaking && rowIndex === currentRowIndex && "animate-shake"
        )}>
          {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
            const guessInfo = guesses[rowIndex];
            const isCurrentRow = rowIndex === guesses.length;
            const letter = isCurrentRow ? currentGuess[colIndex] : guessInfo?.guess[colIndex];
            const status = guessInfo?.statuses[colIndex] || 'empty';
            const hasLetter = !!letter;

            return (
                <div
                    key={colIndex}
                    onClick={() => isCurrentRow && onCellClick(colIndex)}
                    className={cn(
                        'aspect-square border-2 flex items-center justify-center text-3xl sm:text-4xl font-bold rounded-md transition-all duration-300',
                        getStatusClass(status),
                        isCurrentRow && 'cursor-pointer',
                        isCurrentRow && hasLetter && 'border-muted-foreground',
                        isCurrentRow && activeIndex === colIndex && 'border-primary ring-2 ring-primary scale-105',
                        status !== 'empty' && 'animate-in fade-in zoom-in-50'
                    )}
                    style={{ animationDelay: `'''${colIndex * 100}ms'''` }}
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
    const [currentGuess, setCurrentGuess] = useState<string[]>(Array(WORD_LENGTH).fill(''));
    const [activeIndex, setActiveIndex] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [letterStatuses, setLetterStatuses] = useState<{ [key: string]: LetterStatus }>({});
    const [stats, setStats] = useState({ games: 0, wins: 0, streak: 0 });
    const [isCompletedToday, setIsCompletedToday] = useState(false);
    const [timeToNextGame, setTimeToNextGame] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    const prevGameStateRef = useRef(gameState);
    const prevGuessesLengthRef = useRef(guesses.length);
    const originalFaviconRef = useRef<string | null>(null);
    const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getTodayString = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const todayStr = getTodayString();
        setSolution(getWordOfTheDay());

        const savedStats = localStorage.getItem('worthaft-stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }

        const savedGame = localStorage.getItem('worthaft-daily-game');
        if (savedGame) {
            const dailyState: DailyGameState = JSON.parse(savedGame);
            if (dailyState.date === todayStr && (dailyState.status === 'won' || dailyState.status === 'lost')) {
                setGuesses(dailyState.guesses);
                setGameState(dailyState.status);
                setIsCompletedToday(true);

                const newLetterStatuses: { [key: string]: LetterStatus } = {};
                dailyState.guesses.forEach(({ guess, statuses }) => {
                    for (let i = 0; i < WORD_LENGTH; i++) {
                        const letter = guess[i];
                        const currentStatus = newLetterStatuses[letter];
                        const newStatus = statuses[i];
                        if (currentStatus !== 'correct') {
                            newLetterStatuses[letter] = newStatus;
                        }
                    }
                });
                setLetterStatuses(newLetterStatuses);
            }
        }
    }, []);

    useEffect(() => {
        if (gameState !== 'won' && gameState !== 'lost' && !isCompletedToday) return;

        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeToNextGame('00:00:00');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeToNextGame(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, isCompletedToday]);


    const handleChar = (char: string) => {
        if (gameState !== 'playing') return;
        const newGuess = [...currentGuess];
        newGuess[activeIndex] = char;
        setCurrentGuess(newGuess);
        setActiveIndex((prev) => (prev + 1) % WORD_LENGTH);
    };

    const handleEnter = useCallback(() => {
        if (gameState !== 'playing') return;

        if (currentGuess.includes('')) {
            toast({ variant: 'destructive', title: 'Unvollständiges Wort', description: 'Bitte füllen Sie alle Felder aus.' });
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 600);
            return;
        }

        const guessWord = currentGuess.join('');

        if (!WORDS.includes(guessWord.toLowerCase())) {
            toast({ variant: 'destructive', title: 'Ungültiges Wort', description: 'Dieses Wort steht nicht in unserem Duden.' });
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 600);
            return;
        }

        const newStatuses: LetterStatus[] = Array(WORD_LENGTH).fill('absent');
        const solutionLetters = solution.split('');

        // First pass for correct letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guessWord[i] === solution[i]) {
                newStatuses[i] = 'correct';
                solutionLetters[i] = '_';
            }
        }

        // Second pass for present letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (newStatuses[i] !== 'correct' && solutionLetters.includes(guessWord[i])) {
                newStatuses[i] = 'present';
                solutionLetters[solutionLetters.indexOf(guessWord[i])] = '_';
            }
        }
        
        const newGuess = { guess: guessWord, statuses: newStatuses };
        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);

        // Update keyboard statuses
        const newLetterStatuses = { ...letterStatuses };
        for (let i = 0; i < WORD_LENGTH; i++) {
            const letter = guessWord[i];
            const currentStatus = newLetterStatuses[letter];
            const newStatus = newStatuses[i];
            if (currentStatus !== 'correct') {
                newLetterStatuses[letter] = newStatus;
            }
        }
        setLetterStatuses(newLetterStatuses);
        
        setCurrentGuess(Array(WORD_LENGTH).fill(''));
        setActiveIndex(0);

        const todayStr = getTodayString();
        // Check game state
        if (guessWord === solution) {
            setGameState('won');
            const newStats = { games: stats.games + 1, wins: stats.wins + 1, streak: stats.streak + 1 };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            const dailyState: DailyGameState = { date: todayStr, guesses: newGuesses, status: 'won' };
            localStorage.setItem('worthaft-daily-game', JSON.stringify(dailyState));
            setIsCompletedToday(true);
        } else if (newGuesses.length === MAX_GUESSES) {
            setGameState('lost');
            const newStats = { games: stats.games + 1, wins: stats.wins, streak: 0 };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            const dailyState: DailyGameState = { date: todayStr, guesses: newGuesses, status: 'lost' };
            localStorage.setItem('worthaft-daily-game', JSON.stringify(dailyState));
            setIsCompletedToday(true);
        }
    }, [currentGuess, gameState, guesses, letterStatuses, solution, stats, toast]);

    const handleDelete = () => {
        if (gameState !== 'playing') return;
        const newGuess = [...currentGuess];
        // If current cell has a letter, delete it and stay.
        if (newGuess[activeIndex]) {
            newGuess[activeIndex] = '';
            setCurrentGuess(newGuess);
        } else if (activeIndex > 0) {
            // If current cell is empty, move to previous and delete that one.
            const prevIndex = activeIndex - 1;
            newGuess[prevIndex] = '';
            setCurrentGuess(newGuess);
            setActiveIndex(prevIndex);
        }
    };
    
    const isDialogOpen = gameState === 'won' || gameState === 'lost';

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (isDialogOpen || isCompletedToday) return;

        if (event.key === 'Enter') {
            handleEnter();
        } else if (event.key === 'Backspace') {
            handleDelete();
        } else if (event.key === 'ArrowLeft') {
            setActiveIndex(prev => (prev - 1 + WORD_LENGTH) % WORD_LENGTH);
        } else if (event.key === 'ArrowRight') {
            setActiveIndex(prev => (prev + 1) % WORD_LENGTH);
        } else if (/^[a-zA-ZäöüÄÖÜ]$/.test(event.key)) {
            handleChar(event.key.toUpperCase());
        }
    }, [isDialogOpen, isCompletedToday, handleEnter, handleDelete, handleChar]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Effect for dynamic favicon
    useEffect(() => {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
        if (!link) return;

        // Store original favicon on first mount if not already set
        if (originalFaviconRef.current === null) {
            originalFaviconRef.current = link.href;
        }
        const originalFavicon = originalFaviconRef.current;

        const drawFavicon = (text: string, textColor: string, bgColor: string): string => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (!ctx) return originalFavicon;

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, 32, 32);

            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = textColor;
            ctx.fillText(text, 16, 18);

            return canvas.toDataURL('image/png');
        };
        
        const blinkFavicon = (text: string, textColor: string, bgColor: string) => {
            if (blinkTimeoutRef.current) {
                clearTimeout(blinkTimeoutRef.current);
            }

            const newFavicon = drawFavicon(text, textColor, bgColor);
            link.href = newFavicon;

            blinkTimeoutRef.current = setTimeout(() => {
                if (link.href === newFavicon) {
                    link.href = originalFavicon;
                }
            }, 2000);
        };
        
        const justGuessed = guesses.length > prevGuessesLengthRef.current;
        const justFinished = gameState !== 'playing' && prevGameStateRef.current === 'playing';

        if (justFinished) {
            if (gameState === 'won') {
                blinkFavicon('✅', '#FFFFFF', '#22c55e'); // green
            } else { // lost
                blinkFavicon('❌', '#FFFFFF', '#ef4444'); // red
            }
        } else if (justGuessed) {
            blinkFavicon(`${guesses.length}`, 'hsl(220 85% 55%)', 'hsl(240 5% 96%)');
        }

        prevGameStateRef.current = gameState;
        prevGuessesLengthRef.current = guesses.length;

        return () => {
            if (link && originalFavicon) {
                link.href = originalFavicon;
            }
            if (blinkTimeoutRef.current) {
                clearTimeout(blinkTimeoutRef.current);
            }
        };
    }, [guesses.length, gameState]);

    const shareResults = () => {
        const title = 'Worthaft - Das Paulik & Reisch Wortspiel';
        const resultGrid = guesses.map(g => 
            g.statuses.map(s => {
                if (s === 'correct') return '🟦';
                if (s === 'present') return '🟨';
                return '⬛';
            }).join('')
        ).join('\n');
        
        const text = `'''${title}\n${gameState === 'won' ? guesses.length : 'X'}/${MAX_GUESSES}\n\n${resultGrid}\n\nhttps://paulik-reisch.de/worthaft'''`;
        
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
                        <WorthaftIcon className="mx-auto h-12 w-12 mb-4 text-primary" />
                        <h1 className="text-4xl font-bold font-headline">Worthaft</h1>
                        <p className="text-muted-foreground">Eine Hommage von <Link href="/ueber/autoren" className="underline">Paulik & Reisch</Link>. <Link href="/worthaft/ueber" className="underline">Wie funktioniert's?</Link></p>
                    </div>
                    <div className="w-full max-w-xs sm:max-w-sm">
                        <Grid 
                            guesses={guesses} 
                            currentGuess={currentGuess} 
                            isShaking={isShaking} 
                            currentRowIndex={guesses.length}
                            activeIndex={activeIndex}
                            onCellClick={setActiveIndex}
                        />
                        <Keyboard onChar={handleChar} onEnter={handleEnter} onDelete={handleDelete} letterStatuses={letterStatuses} />
                    </div>
                </div>
            </main>
            <Footer />
            <AlertDialog open={isDialogOpen || isCompletedToday}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl font-headline">
                        {isCompletedToday ? 'Sie haben bereits gespielt' : (gameState === 'won' ? 'Gratulation!' : 'Schade!')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {gameState === 'won' 
                            ? `Sie haben das Wort in ${guesses.length} Versuchen erraten.`
                            : `Das richtige Wort war: `}
                        <span className="font-bold text-lg text-primary">{solution}</span>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="text-center space-y-4">
                        <h4 className="font-bold">Ihre Statistik</h4>
                        <div className="flex justify-around">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{stats.games}</div>
                                <div className="text-xs">Spiele</div>
                            </div>
                             <div className="text-center">
                                <div className="text-3xl font-bold">{stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0}%</div>
                                <div className="text-xs">Gewonnen</div>
                            </div>
                             <div className="text-center">
                                <div className="text-3xl font-bold">{stats.streak}</div>
                                <div className="text-xs">Siegesserie</div>
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter className="mt-4 sm:justify-center flex-col sm:flex-col sm:space-x-0 gap-2">
                        <div className="flex w-full justify-center items-center gap-2">
                             <div className="text-center flex-grow">
                                <p className="text-sm font-semibold">Nächstes Spiel in:</p>
                                <p className="font-mono text-lg font-bold text-primary">{timeToNextGame}</p>
                            </div>
                            <Button variant="outline" size="icon" onClick={shareResults}>
                                <Share2 className="h-4 w-4" />
                                <span className="sr-only">Ergebnis teilen</span>
                            </Button>
                        </div>
                        <Link href="/a" className="w-full">
                            <Button className="w-full" variant="outline">
                                <Newspaper className="mr-2 h-4 w-4"/>
                                Derweil einen lustigen Artikel lesen
                            </Button>
                        </Link>
                        <Link href="/shop" className="w-full">
                            <Button className="w-full">
                                <Book className="mr-2 h-4 w-4"/>
                                Derweil das Buch Hallo Welt bestellen
                            </Button>
                        </Link>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
