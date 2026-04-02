'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { WORDS } from '@/lib/worthaft-words';
import { Share2, HelpCircle, Book, Newspaper, X, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { WorthaftIcon } from '@/components/ui/icons/worthaft-icon';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

type DailyGameState = {
  date: string;
  guesses: { guess: string; statuses: LetterStatus[] }[];
  status: 'won' | 'lost' | 'playing';
  letterStatuses: { [key: string]: LetterStatus };
  hotTipUsed?: boolean;
  jokerPosition?: { guessIndex: number; letterIndex: number };
};


// Select a word for the day
const getWordOfTheDay = () => {
    const today = new Date();
    // Use local date parts to create a date string, avoiding timezone conversions.
    const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const startDate = new Date('2024-01-01');
    const localToday = new Date(todayString); // This will be in the client's local timezone at 00:00:00

    const diffTime = Math.abs(localToday.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return WORDS[diffDays % WORDS.length].toUpperCase();
};

const Keyboard = ({ onChar, onEnter, onDelete, letterStatuses }: { onChar: (value: string) => void; onEnter: () => void; onDelete: () => void; letterStatuses: { [key: string]: LetterStatus } }) => {
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
      case 'absent': return 'bg-muted text-muted-foreground opacity-60';
      default: return 'bg-muted hover:bg-accent';
    }
  };

  const handleKeyClick = (key: string) => {
    if (key === 'SEND') onEnter();
    else if (key === 'DELETE') onDelete();
    else onChar(key);
  };

  return (
    <div className="w-full flex flex-col items-center gap-1.5 mt-8 px-1">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-row justify-center gap-1.5 w-full">
          {i === 1 && <div className="w-[5%]" />}
          
          {row.map(key => {
            const isSpecialKey = key === 'SEND' || key === 'DELETE';
            
            return (
              <Button
                key={key}
                onClick={() => handleKeyClick(key)}
                variant="outline"
                className={cn(
                  'p-0 font-bold uppercase rounded-sm flex items-center justify-center transition-colors duration-300 aspect-square',
                  isSpecialKey ? 'w-[12%]' : 'w-[8.5%]',
                  getStatusClass(key)
                )}
              >
                {key === 'DELETE' ? <ArrowLeft className="h-5 w-5" /> : <span className="text-xs sm:text-base">{key}</span>}
              </Button>
            );
          })}

          {i === 1 && <div className="w-[5%]" />}
        </div>
      ))}
    </div>
  );
};

const Grid = ({ guesses, currentGuess, isShaking, currentRowIndex, activeIndex, onCellClick, jokerReveal, jokerPosition, gameState }: {
    guesses: { guess: string; statuses: LetterStatus[] }[];
    currentGuess: string[];
    isShaking: boolean;
    currentRowIndex: number;
    activeIndex: number;
    onCellClick: (index: number) => void;
    jokerReveal: { index: number; key: number } | null;
    jokerPosition: { guessIndex: number; letterIndex: number } | null;
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
            
            let letter;
            if (isCurrentRow && gameState === 'playing') {
                letter = currentGuess[colIndex];
            } else if (guessInfo) {
                letter = guessInfo.guess[colIndex];
            }
            
            const hasLetter = !!letter;
            const jokerPositionInFile = jokerReveal;
            const isJokerCell = jokerPositionInFile && jokerPositionInFile.index === colIndex && isCurrentRow;
            const status: LetterStatus = guessInfo?.statuses[colIndex] || 'empty';
            const isJokerProtected = isCurrentRow && jokerPosition && jokerPosition.guessIndex === guesses.length && colIndex === jokerPosition.letterIndex;

            return (
                <div
                    key={colIndex}
                    onClick={() => {
                        if (isCurrentRow && !isJokerProtected) {
                           onCellClick(colIndex);
                       }
                   }}
                    className={cn(
                        'aspect-square border-2 flex items-center justify-center text-3xl sm:text-4xl font-bold rounded-sm',
                        getStatusClass(status),
                        isCurrentRow && !isJokerProtected && 'cursor-pointer',
                        isCurrentRow && hasLetter && !isJokerProtected && 'border-muted-foreground',
                        isCurrentRow && activeIndex === colIndex && !isJokerProtected && 'border-primary ring-2 ring-primary scale-105',
                        status !== 'empty' && 'animate-in fade-in zoom-in-50'
                    )}
                    style={{ animationDelay: `${colIndex * 100}ms` }}
                >
                    {isJokerCell ? (
                        <motion.div
                            key={jokerPositionInFile.key}
                            className="w-full h-full"
                            style={{ transformStyle: 'preserve-3d' }}
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: 180 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                        >
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                🔥
                            </motion.div>
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                {letter}
                            </motion.div>
                        </motion.div>
                    ) : (
                        letter
                    )}
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
            <p className="text-sm uppercase font-bold text-muted-foreground">Ergebnis</p>
            <p className="text-4xl font-bold">{gameState === 'won' ? guesses.length : 'X'} / {MAX_GUESSES}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-6">
            <div className="p-2 bg-muted rounded-lg">
                <p className="text-xl font-bold">{stats.games}</p>
                <p className="text-xs text-muted-foreground">Gespielt</p>
            </div>
            <div className="p-2 bg-muted rounded-lg">
                <p className="text-xl font-bold">{winRate}%</p>
                <p className="text-xs text-muted-foreground">Gewinnrate</p>
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
                <SheetContent side="bottom" className="p-0 pt-0 max-h-[90vh] overflow-y-auto rounded-t-lg">
                     <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/logos%2Fafterplay-image.png?alt=media&token=25d1d2cf-b09c-4eaf-95f1-bf3cbae2e648"
                        alt="Spielergebnis Grafik"
                        width={400}
                        height={200}
                        className="w-full h-auto"
                     />
                    <div className="p-6">
                        <SheetHeader className="text-center">
                            <SheetTitle className="text-2xl font-bold font-headline">
                                {rest.gameState === 'won' ? 'Gratulation!' : rest.gameState === 'lost' ? 'Leider verloren!' : 'Sie haben bereits gespielt!'}
                            </SheetTitle>
                            <SheetDescription className="text-muted-foreground pt-1">
                                Das heutige Wort: <span className="font-bold text-primary">{rest.solution}</span>
                            </SheetDescription>
                        </SheetHeader>
                        <ResultsContent {...rest} />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 max-w-sm rounded-t-lg overflow-hidden">
                <Image 
                    src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/logos%2Fafterplay-image.png?alt=media&token=25d1d2cf-b09c-4eaf-95f1-bf3cbae2e648"
                    alt="Spielergebnis Grafik"
                    width={400}
                    height={200}
                    className="w-full h-auto"
                 />
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-headline text-center">
                            {rest.gameState === 'won' ? 'Gratulation!' : rest.gameState === 'lost' ? 'Leider verloren!' : 'Sie haben bereits gespielt!'}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground pt-1 text-center">
                            Das heutige Wort: <span className="font-bold text-primary">{rest.solution}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <ResultsContent {...rest} />
                </div>
            </DialogContent>
        </Dialog>
    );
};


const HotTipDisplay = ({ isOpen, onOpenChange, onAccept, onDecline, onDisablePermanentlyChange, isPermanentlyDisabled }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: () => void;
    onDecline: () => void;
    onDisablePermanentlyChange: (checked: boolean) => void;
    isPermanentlyDisabled: boolean;
}) => {
    const isMobile = useIsMobile();
    
    const content = (
        <>
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/logos%2Ftippbyplay-image.png?alt=media&token=38df2b8b-1917-4af2-9ed3-c370e27fbb12"
                alt="Heißer Tipp Grafik"
                width={400}
                height={200}
                className="w-full h-auto rounded-t-lg"
            />
            <div className="p-6 pt-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-bold font-headline">
                        Heißer Tipp! 🔥
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-balance">
                        Du kannst diesen Joker einmal pro Tag nutzen. Wähle den Zeitpunkt weise.
                    </DialogDescription>
                </DialogHeader>
                 <div className="flex items-center space-x-2 mt-4 text-left">
                    <Checkbox id="disable-hot-tip" checked={isPermanentlyDisabled} onCheckedChange={onDisablePermanentlyChange} />
                    <Label htmlFor="disable-hot-tip" className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">Nicht mehr anzeigen</Label>
                </div>
                <DialogFooter className="mt-6 flex-col-reverse sm:flex-row gap-2">
                    <Button onClick={onAccept} className="w-full">Verstanden!</Button>
                </DialogFooter>
            </div>
        </>
    );

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="p-0 pt-0 max-h-[90vh] overflow-y-auto rounded-t-lg">
                    {content}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 max-w-sm">
                {content}
            </DialogContent>
        </Dialog>
    );
}

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
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Joker "Hot Tip" state
    const [showHotTipDialog, setShowHotTipDialog] = useState(false);
    const [hotTipUsed, setHotTipUsed] = useState(false);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [dontShowHotTipAgain, setDontShowHotTipAgain] = useState(false);
    const [isHotTipPopupDisabled, setIsHotTipPopupDisabled] = useState(false);
    const [jokerReveal, setJokerReveal] = useState<{ index: number; key: number } | null>(null);
    const [jokerPosition, setJokerPosition] = useState<{ guessIndex: number; letterIndex: number } | null>(null);


    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const saveState = useCallback((newGuesses: { guess: string; statuses: LetterStatus[] }[], newStatus: 'won' | 'lost' | 'playing', newLetterStatuses: { [key: string]: LetterStatus }, newHotTipUsed: boolean, newJokerPosition: { guessIndex: number; letterIndex: number } | null) => {
        if (newStatus === 'won' || newStatus === 'lost') {
             const dailyState: DailyGameState = {
                date: getTodayString(),
                guesses: newGuesses,
                status: newStatus,
                letterStatuses: newLetterStatuses,
                hotTipUsed: newHotTipUsed,
                jokerPosition: newJokerPosition || undefined
            };
            localStorage.setItem('worthaft-daily-game', JSON.stringify(dailyState));
        } else {
            // Only save playing state if there's something to save
             const dailyState: DailyGameState = {
                date: getTodayString(),
                guesses: newGuesses,
                status: 'playing',
                letterStatuses: newLetterStatuses,
                hotTipUsed: newHotTipUsed,
                jokerPosition: newJokerPosition || undefined,
            };
            localStorage.setItem('worthaft-daily-game', JSON.stringify(dailyState));
        }
    }, []);

    useEffect(() => {
        // Initialize audio element on client
        if (!audioRef.current) {
            audioRef.current = new Audio("https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/logos%2Fworthaft.mp3?alt=media&token=50d6e7f0-001e-42d1-ab2a-7b5ac24b5b29");
            audioRef.current.loop = true;
        }
    }, []);

    const toggleMute = () => {
        if (!audioRef.current) return;
        setIsMuted(prev => {
            const shouldBeMuted = !prev;
            if (shouldBeMuted) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play().catch(error => {
                    console.error("Audio autoplay was prevented. User interaction is required.", error);
                });
            }
            return shouldBeMuted;
        });
    };

    useEffect(() => {
        const disabled = localStorage.getItem('worthaft-hottip-disabled') === 'true';
        setIsHotTipPopupDisabled(disabled);

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
                    setHotTipUsed(dailyState.hotTipUsed || false);
                    if (dailyState.jokerPosition) {
                        setJokerPosition(dailyState.jokerPosition);
                        const newCurrentGuess = Array(WORD_LENGTH).fill('');
                        if (dailyState.guesses.length === dailyState.jokerPosition.guessIndex) {
                            newCurrentGuess[dailyState.jokerPosition.letterIndex] = getWordOfTheDay()[dailyState.jokerPosition.letterIndex];
                        }
                        setCurrentGuess(newCurrentGuess);

                        const firstEmptyIndex = newCurrentGuess.findIndex(l => l === '');
                        setActiveIndex(firstEmptyIndex !== -1 ? firstEmptyIndex : 0);
                    }


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

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        if (gameState !== 'playing' || hotTipUsed || isDialogOpen || showHotTipDialog || isHotTipPopupDisabled) {
            return;
        }
        inactivityTimerRef.current = setTimeout(() => {
            setShowHotTipDialog(true);
        }, 180000); // 3 minutes
    }, [gameState, hotTipUsed, isDialogOpen, showHotTipDialog, isHotTipPopupDisabled]);

    // Inactivity timer for "Hot Tip"
    useEffect(() => {
        resetInactivityTimer();

        const activityEvents: (keyof WindowEventMap)[] = ['keydown', 'mousemove', 'click', 'touchstart'];
        const handleActivity = () => {
          resetInactivityTimer();
        };

        activityEvents.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            activityEvents.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [resetInactivityTimer]);
    

    const handleChar = (char: string) => {
        if (gameState !== 'playing') return;
        const newGuess = [...currentGuess];
        const isJokerHere = jokerPosition && jokerPosition.guessIndex === guesses.length;

        // Do not allow overwriting the joker letter
        if (isJokerHere && activeIndex === jokerPosition.letterIndex) {
            return;
        }
        
        newGuess[activeIndex] = char;
        setCurrentGuess(newGuess);

        // Advance cursor, skipping joker if necessary
        let nextIndex = activeIndex + 1;
        if (nextIndex < WORD_LENGTH) {
             if (isJokerHere && nextIndex === jokerPosition.letterIndex) {
                nextIndex++;
            }
            if (nextIndex < WORD_LENGTH) {
                setActiveIndex(nextIndex);
            }
        }
    };

    const handleEnter = useCallback(() => {
        if (gameState !== 'playing') return;

        const guessWord = currentGuess.join('');

        if (currentGuess.includes('')) {
            toast({ variant: 'destructive', title: 'Unvollständiges Wort', duration: 2000 });
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 600);
            return;
        }
        
        // This must be checked before word validity.
        if (guessWord === solution) {
            const newStatuses: LetterStatus[] = Array(WORD_LENGTH).fill('correct');
            const newGuess = { guess: guessWord, statuses: newStatuses };
            const newGuesses = [...guesses, newGuess];
            const newLetterStatuses = { ...letterStatuses };
             for (let i = 0; i < WORD_LENGTH; i++) {
                newLetterStatuses[guessWord[i]] = 'correct';
            }
            
            setGuesses(newGuesses);
            setLetterStatuses(newLetterStatuses);
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
            saveState(newGuesses, 'won', newLetterStatuses, hotTipUsed, jokerPosition);
            setIsCompletedToday(true);
            setTimeout(() => {
                setIsDialogOpen(true);
            }, 1200);
            return;
        }


        if (!WORDS.includes(guessWord.toLowerCase())) {
            toast({ variant: 'destructive', title: 'Ungültiges Wort', duration: 2000 });
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
            // Only upgrade status: absent -> present -> correct
            if (newStatus === 'correct') {
                newLetterStatuses[letter] = 'correct';
            } else if (newStatus === 'present' && currentStatus !== 'correct') {
                newLetterStatuses[letter] = 'present';
            } else if (newStatus === 'absent' && !currentStatus) {
                newLetterStatuses[letter] = 'absent';
            }
        }
        setLetterStatuses(newLetterStatuses);

        if (newGuesses.length === MAX_GUESSES) {
            setGameState('lost');
            const newStats = { 
                games: (stats.games || 0) + 1,
                wins: stats.wins || 0,
                streak: 0,
                maxStreak: stats.maxStreak || 0
            };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            saveState(newGuesses, 'lost', newLetterStatuses, hotTipUsed, jokerPosition);
            setIsCompletedToday(true);
            setTimeout(() => setIsDialogOpen(true), 1200);
        } else {
            // Game is still playing, prepare the next row
            setCurrentGuess(Array(WORD_LENGTH).fill(''));
            setActiveIndex(0);
            saveState(newGuesses, 'playing', newLetterStatuses, hotTipUsed, jokerPosition);
        }
    }, [currentGuess, gameState, guesses, letterStatuses, solution, stats, toast, saveState, hotTipUsed, jokerPosition]);

    const handleDelete = () => {
        if (gameState !== 'playing') return;
        const newGuess = [...currentGuess];
        const isJokerHere = jokerPosition && jokerPosition.guessIndex === guesses.length;

        // If the current cell has a letter (and is not a joker), clear it.
        if (newGuess[activeIndex] !== '' && !(isJokerHere && activeIndex === jokerPosition.letterIndex)) {
            newGuess[activeIndex] = '';
            setCurrentGuess(newGuess);
            return;
        }

        // If the current cell is empty or a joker, move to the previous settable cell and clear it.
        let prevIndex = activeIndex - 1;
        while (prevIndex >= 0) {
            if (!(isJokerHere && prevIndex === jokerPosition.letterIndex)) {
                newGuess[prevIndex] = '';
                setCurrentGuess(newGuess);
                setActiveIndex(prevIndex);
                return;
            }
            prevIndex--;
        }
    };
    
    
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (isDialogOpen || showHotTipDialog) return;

        if (event.key === 'Enter') {
            handleEnter();
        } else if (event.key === 'Backspace') {
            handleDelete();
        } else if (event.key === 'ArrowLeft') {
            let nextIndex = activeIndex - 1;
             if (jokerPosition && jokerPosition.guessIndex === guesses.length && nextIndex === jokerPosition.letterIndex) {
                nextIndex--;
            }
            setActiveIndex(Math.max(0, nextIndex));
        } else if (event.key === 'ArrowRight') {
            let nextIndex = activeIndex + 1;
            if (jokerPosition && jokerPosition.guessIndex === guesses.length && nextIndex === jokerPosition.letterIndex) {
                nextIndex++;
            }
            setActiveIndex(Math.min(WORD_LENGTH - 1, nextIndex));
        } else if (/^[a-zA-ZäöüÄÖÜß]$/.test(event.key)) {
            handleChar(event.key.toUpperCase());
        }
    }, [isDialogOpen, showHotTipDialog, handleEnter, handleDelete, handleChar, activeIndex, jokerPosition, guesses.length]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const shareResults = async () => {
        const resultGrid = guesses.map((g, guessIndex) => 
            g.statuses.map((s, letterIndex) => {
                if (jokerPosition && jokerPosition.guessIndex === guessIndex && jokerPosition.letterIndex === letterIndex) {
                    return '🔥';
                }
                if (s === 'correct') return '🟦';
                if (s === 'present') return '🟨';
                return '⬛';
            }).join('')
        ).join('\n');
        
        const tipUsedLine = hotTipUsed ? `(1 Heißer Tipp verwendet 🔥)` : "";

        const text = `Worthaft – Das Paulik & Reisch Spiel

Ich habe das tägliche Worthaft gespielt. Mein Ergebnis: ${gameState === 'won' ? guesses.length : 'X'} / ${MAX_GUESSES} Versuchen ${tipUsedLine}

${resultGrid}

Jetzt fordere ich Dich heraus!`;
        
        const shareData = {
            title: 'Worthaft – Das Paulik & Reisch Spiel',
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
                toast({ title: 'Kopiert!', description: 'Ergebnis in die Zwischenablage kopiert.', duration: 2000 });
            });
        }
    }

    const handleAcceptHotTip = () => {
        if (hotTipUsed || gameState !== 'playing') return;

        const correctlyGuessedIndices = new Set<number>();
        guesses.forEach(g => {
            g.statuses.forEach((status, index) => {
                if (status === 'correct') {
                    correctlyGuessedIndices.add(index);
                }
            });
        });
        
        currentGuess.forEach((letter, index) => {
            if (letter === solution[index]) {
                correctlyGuessedIndices.add(index);
            }
        });


        const revealableIndices = [];
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (!correctlyGuessedIndices.has(i)) {
                revealableIndices.push(i);
            }
        }

        if (revealableIndices.length > 0) {
            const jokerIndex = revealableIndices[Math.floor(Math.random() * revealableIndices.length)];
            const jokerLetter = solution[jokerIndex];
            
            const newGuess = [...currentGuess];
            newGuess[jokerIndex] = jokerLetter;
            setCurrentGuess(newGuess);

            setJokerReveal({ index: jokerIndex, key: Date.now() });

            const newJokerPosition = { guessIndex: guesses.length, letterIndex: jokerIndex };
            setJokerPosition(newJokerPosition);

            setHotTipUsed(true);
            saveState(guesses, 'playing', letterStatuses, true, newJokerPosition);
            toast({
                title: 'Heißer Tipp!',
                description: `Ein Buchstabe wurde für dich aufgedeckt.`,
                duration: 3000
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Kein Tipp verfügbar',
                description: 'Du hast bereits alle Buchstaben korrekt erraten!',
                duration: 3000
            });
        }
        
        if (dontShowHotTipAgain) {
            localStorage.setItem('worthaft-hottip-disabled', 'true');
            setIsHotTipPopupDisabled(true);
        }
        setShowHotTipDialog(false);
    };

    const handleDeclineHotTip = () => {
        if (dontShowHotTipAgain) {
            localStorage.setItem('worthaft-hottip-disabled', 'true');
            setIsHotTipPopupDisabled(true);
        }
        setShowHotTipDialog(false);
    };

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
                <div className="w-full max-w-sm mx-auto px-1 sm:px-0 flex flex-col items-center justify-start">
                    <div className="text-center mb-8">
                        <WorthaftIcon className="mx-auto h-16 w-16 mb-4 text-primary" />
                        <h1 className="text-4xl font-bold font-headline">Worthaft</h1>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Link href="/worthaft/ueber" className="text-sm inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                                <HelpCircle className="h-4 w-4" />
                                <span>Spielanleitung</span>
                            </Link>
                             <button
                                className="text-sm p-0 h-auto font-semibold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                                onClick={() => setShowHotTipDialog(true)}
                                disabled={hotTipUsed || gameState !== 'playing'}
                              >
                                <span className="feuer-button !p-0 !h-auto !shadow-none !bg-transparent before:!hidden after:!hidden">
                                  <span className="btn-text !text-sm">🔥</span>
                                </span>
                                Heißer Tipp
                              </button>
                            <Button onClick={toggleMute} variant="ghost" size="icon" className="text-muted-foreground">
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                <span className="sr-only">Ton an/aus</span>
                            </Button>
                        </div>
                    </div>
                    <div className="w-full">
                        <Grid
                            guesses={guesses}
                            currentGuess={currentGuess}
                            isShaking={isShaking}
                            currentRowIndex={guesses.length}
                            activeIndex={activeIndex}
                            onCellClick={setActiveIndex}
                            jokerReveal={jokerReveal}
                            jokerPosition={jokerPosition}
                            gameState={gameState}
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
             <HotTipDisplay
                isOpen={showHotTipDialog}
                onOpenChange={setShowHotTipDialog}
                onAccept={handleAcceptHotTip}
                onDecline={handleDeclineHotTip}
                isPermanentlyDisabled={dontShowHotTipAgain}
                onDisablePermanentlyChange={setDontShowHotTipAgain}
            />
        </div>
    );
}
