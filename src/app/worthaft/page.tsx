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
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { WORDS } from '@/lib/worthaft-words';
import { Share2, HelpCircle, Book, Newspaper, X } from 'lucide-react';
import Link from 'next/link';
import { WorthaftIcon } from '@/components/ui/icons/worthaft-icon';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

type DailyGameState = {
  date: string;
  guesses: { guess: string; statuses: LetterStatus[] }[];
  status: 'won' | 'lost' | 'playing';
  letterStatuses: { [key: string]: LetterStatus };
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


const ResultsContent = ({ solution, guesses, gameState, stats, timeToNextGame, shareResults }: {
    solution: string;
    guesses: { guess: string; statuses: LetterStatus[] }[];
    gameState: 'playing' | 'won' | 'lost';
    stats: { games: number; wins: number; streak: number; maxStreak: number; };
    timeToNextGame: string;
    shareResults: () => void;
}) => {
    const winRate = stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0;
    
    return (
    <>
        <div className="text-center">
            <p className="text-sm uppercase font-bold text-muted-foreground">Ihr Ergebnis</p>
            <p className="text-4xl font-bold">{gameState === 'won' ? guesses.length : 'X'} / {MAX_GUESSES}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-6">
            <div className="p-2 bg-muted rounded-lg">
                <p className="text-xl font-bold">{stats.games}</p>
                <p className="text-xs text-muted-foreground">Gespielt</p>
            </div>
            <div className="p-2 bg-muted rounded-lg">
                <p className="text-xl font-bold">{winRate}%</p>
                <p className="text-xs text-muted-foreground">Gewonnen</p>
            </div>
             <div className="p-2 bg-muted rounded-lg">
                <p className="text-xl font-bold">{stats.streak}</p>
                <p className="text-xs text-muted-foreground">Gewinn-Serie</p>
            </div>
             <div className="p-2 bg-muted rounded-lg">
                <p className="text-xl font-bold">{stats.maxStreak}</p>
                <p className="text-xs text-muted-foreground">Beste Serie</p>
            </div>
        </div>

        <div className="text-center mb-6">
            <p className="font-semibold">Nächstes Spiel in:</p>
            <p className="font-mono text-2xl font-bold">{timeToNextGame || '...'}</p>
        </div>


        <div className="sm:justify-center flex flex-col gap-2">
            <Button size="lg" onClick={shareResults}>
                <Share2 className="mr-3 h-5 w-5"/>
                Teilen
            </Button>
            <Link href="/a" className="w-full">
                <Button className="w-full" variant="ghost">
                    <Newspaper className="mr-2 h-4 w-4"/>
                    Lustige Artikel lesen
                </Button>
            </Link>
        </div>
    </>
    )
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
}) => {
    const isMobile = useIsMobile();
    const { isOpen, onOpenChange, ...rest } = props;

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="p-0 pt-0 rounded-t-lg max-h-[90vh] overflow-y-auto">
                     <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulikreisch.firebasestorage.app/o/logos%2Fafterplay-image.png?alt=media&token=f16a9800-cb1e-425b-88c3-0227e3ef58a0" 
                        alt="Spielergebnis Grafik"
                        width={400}
                        height={200}
                        className="w-full h-auto rounded-t-lg"
                     />
                    <div className="p-6">
                        <SheetHeader className="text-center">
                            <SheetTitle className="text-2xl font-bold font-headline">
                                {rest.gameState === 'won' ? 'Gratulation!' : rest.gameState === 'lost' ? 'Leider verloren!' : 'Sie haben bereits gespielt!'}
                            </SheetTitle>
                            <SheetDescription className="text-muted-foreground pt-1">
                                Das Wort von Heute: <span className="font-bold text-primary">{rest.solution}</span>
                            </SheetDescription>
                        </SheetHeader>
                        <ResultsContent {...rest} />
                    </div>
                    <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="p-0 sm:rounded-lg">
                <Image 
                    src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulikreisch.firebasestorage.app/o/logos%2Fafterplay-image.png?alt=media&token=f16a9800-cb1e-425b-88c3-0227e3ef58a0" 
                    alt="Spielergebnis Grafik"
                    width={400}
                    height={200}
                    className="w-full h-auto rounded-t-lg"
                 />
                <div className="p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold font-headline text-center">
                            {rest.gameState === 'won' ? 'Gratulation!' : rest.gameState === 'lost' ? 'Leider verloren!' : 'Sie haben bereits gespielt!'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground pt-1 text-center">
                            Das Wort von Heute: <span className="font-bold text-primary">{rest.solution}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <ResultsContent {...rest} />
                </div>
            </AlertDialogContent>
        </AlertDialog>
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
    const [stats, setStats] = useState({ games: 0, wins: 0, streak: 0, maxStreak: 0 });
    const [isCompletedToday, setIsCompletedToday] = useState(false);
    const [timeToNextGame, setTimeToNextGame] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const saveState = useCallback((newGuesses: { guess: string; statuses: LetterStatus[] }[], newStatus: 'won' | 'lost' | 'playing', newLetterStatuses: { [key: string]: LetterStatus }) => {
        const dailyState: DailyGameState = {
            date: getTodayString(),
            guesses: newGuesses,
            status: newStatus,
            letterStatuses: newLetterStatuses
        };
        localStorage.setItem('worthaft-daily-game', JSON.stringify(dailyState));
    }, []);

    useEffect(() => {
        const todayStr = getTodayString();
        setSolution(getWordOfTheDay());

        const savedStats = localStorage.getItem('worthaft-stats');
        if (savedStats) {
            const parsedStats = JSON.parse(savedStats);
            setStats({ games: 0, wins: 0, streak: 0, maxStreak: 0, ...parsedStats });
        }

        const savedGame = localStorage.getItem('worthaft-daily-game');
        if (savedGame) {
            try {
                const dailyState: DailyGameState = JSON.parse(savedGame);
                if (dailyState.date === todayStr) {
                    setGuesses(dailyState.guesses);
                    setGameState(dailyState.status);
                    setLetterStatuses(dailyState.letterStatuses || {});

                    if (dailyState.status === 'won' || dailyState.status === 'lost') {
                        setIsCompletedToday(true);
                        setIsDialogOpen(true);
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved game state:", e);
                localStorage.removeItem('worthaft-daily-game');
            }
        }
    }, []);
    
     useEffect(() => {
        if (!isCompletedToday) return;
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
    }, [isCompletedToday]);

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

        // Check game state
        if (guessWord === solution) {
            setGameState('won');
            const newStreak = (stats.streak || 0) + 1;
            const newStats = { 
                games: (stats.games || 0) + 1, 
                wins: (stats.wins || 0) + 1, 
                streak: newStreak, 
                maxStreak: Math.max(stats.maxStreak || 0, newStreak) 
            };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            saveState(newGuesses, 'won', newLetterStatuses);
            setIsCompletedToday(true);
            setTimeout(() => setIsDialogOpen(true), 1000);
        } else if (newGuesses.length === MAX_GUESSES) {
            setGameState('lost');
            const newStats = { 
                games: (stats.games || 0) + 1,
                wins: stats.wins || 0,
                streak: 0,
                maxStreak: stats.maxStreak || 0
            };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            saveState(newGuesses, 'lost', newLetterStatuses);
            setIsCompletedToday(true);
            setTimeout(() => setIsDialogOpen(true), 1000);
        } else {
             saveState(newGuesses, 'playing', newLetterStatuses);
        }
    }, [currentGuess, gameState, guesses, letterStatuses, solution, stats, toast, saveState]);

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
    
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (isDialogOpen) return;

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
    }, [isDialogOpen, handleEnter, handleDelete, handleChar]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const shareResults = async () => {
        const resultGrid = guesses.map(g => 
            g.statuses.map(s => {
                if (s === 'correct') return '🟦';
                if (s === 'present') return '🟨';
                return '⬛';
            }).join('')
        ).join('\n');
        
        const text = `WORTHAFT - Das Paulik & Reisch Spiel

Ich habe das tägliche WORTHAFT gespielt. Mein Ergebnis:
${gameState === 'won' ? guesses.length : 'X'} / ${MAX_GUESSES} Versuchen

${resultGrid}

Jetzt fordere ich DICH heraus! DU BIST JETZT DRAN!`;
        
        const shareData = {
            title: 'Worthaft - Das Paulik & Reisch Spiel',
            text: text,
            url: 'https://paulikreisch.de/worthaft',
        };
        
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Teilen abgebrochen', error);
            }
        } else {
            navigator.clipboard.writeText(`${text}\n\nhttps://paulikreisch.de/worthaft`).then(() => {
                toast({ title: 'Kopiert!', description: 'Ergebnis in die Zwischenablage kopiert. Teile es mit der Welt!' });
            });
        }
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Worthaft',
        description: 'Ein tägliches Worträtselspiel im Stil von Wordle, präsentiert von den Satire-Autoren Paulik & Reisch.',
        url: 'https://paulikreisch.de/worthaft',
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Paulik & Reisch',
          url: 'https://paulikreisch.de'
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
                        <WorthaftIcon className="mx-auto h-16 w-16 mb-4 text-primary" />
                        <h1 className="text-4xl font-bold font-headline">Worthaft</h1>
                        <p className="text-muted-foreground">Eine Hommage von <Link href="/ueber/autoren" className="underline">Paulik & Reisch</Link>.</p>
                        <Link href="/worthaft/ueber" className="text-sm inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors mt-2">
                            <HelpCircle className="h-4 w-4" />
                            <span>Wie funktioniert's?</span>
                        </Link>
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
            <GameEndDisplay 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                solution={solution}
                guesses={guesses}
                gameState={gameState}
                stats={stats}
                timeToNextGame={timeToNextGame}
                shareResults={shareResults}
            />
        </div>
    );
}
