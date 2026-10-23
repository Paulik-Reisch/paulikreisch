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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { WORDS } from '@/lib/worthaft-words';
import { Share2, ArrowRight, Delete, HelpCircle, Volume2, VolumeX, Flame, Settings as Gear, Music, Info, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import FeedbackDrawer from './FeedbackDrawer';
import WordDefinitionDialog from './WordDefinitionDialog';
import { initializeFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { getWorthaftKeyDimensions, getWorthaftTileDimensions, getWorthaftStatusClass, normalizeWorthaftSettings, DEFAULT_WORTHAFT_SETTINGS as DEFAULT_SETTINGS, type WorthaftSettings } from '@/lib/worthaft-settings';
import { canInteractWithWorthaftGame, readWorthaftRowStart, writeWorthaftRowStart, clearWorthaftRowStart } from '@/lib/worthaft-game-state';
import { hasWorthaftFeedbackDecision } from '@/lib/worthaft-feedback';
import { isWorthaftAntiWord } from '@/lib/worthaft-anti-words';
import {
  createInvalidWorthaftWord,
  getInvalidWordVoteAction,
  type InvalidWorthaftWord,
} from '@/lib/worthaft-invalid-word';

// ---- Fireworks — 5s beidseitig, ohne Button, nur on Win ----
const fireWorthaftFireworks = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults: Parameters<typeof confetti>[0] = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

// ---- Persisted Worthaft settings ----
const loadSettings = (): WorthaftSettings => {
  try {
    const raw = localStorage.getItem('worthaft-settings');
    if (!raw) return DEFAULT_SETTINGS;
    return normalizeWorthaftSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const useSettings = () => {
  const [settings, setSettingsState] = useState<WorthaftSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettingsState(loadSettings());
  }, []);

  const setSettings = useCallback((patch: Partial<WorthaftSettings>) => {
    setSettingsState(prev => {
      const next = normalizeWorthaftSettings({ ...prev, ...patch });
      try { localStorage.setItem('worthaft-settings', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return [settings, setSettings] as const;
};

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
  rowTimes?: number[]; // ms per submitted guess
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

const Keyboard = ({ onChar, onEnter, onDelete, letterStatuses, onHotTip, onOpenSettings, hotTipUsed, gameState, settings }: {
  onChar: (value: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  letterStatuses: { [key: string]: LetterStatus };
  onHotTip: () => void;
  onOpenSettings: () => void;
  hotTipUsed: boolean;
  gameState: 'playing' | 'won' | 'lost';
  settings: WorthaftSettings;
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['SEND', 'Ü', 'Ö', 'Ä', 'ẞ', 'DELETE'],
  ];

  const getStatusClass = (key: string) => getWorthaftStatusClass(letterStatuses[key], settings.palette) || 'bg-muted hover:bg-accent';

  const handleKeyClick = (key: string) => {
    if (key === 'SEND') onEnter();
    else if (key === 'DELETE') onDelete();
    else onChar(key);
  };

    const { width: widthPx, height: heightPx } = getWorthaftKeyDimensions(settings.keyWidth, settings.keyHeight);
    const fontPx = 12 + (settings.keySize / 4) * 10;
    const radiusPx = (settings.keyRadius / 4) * 24;

  const keyStyle = (extra?: string): React.CSSProperties => ({
    width: `${widthPx}px`,
    minWidth: 0,
    flexShrink: 1,
    height: `${heightPx}px`,
    fontSize: `${fontPx}px`,
    borderRadius: `${radiusPx}px`,
    ...(extra ? {} : {}),
  });

  const isHotTipActive = !hotTipUsed && gameState === 'playing' && settings.hotTipEnabled;

  const letterRows = rows.slice(0, 3);

  return (
    <div data-testid="worthaft-keyboard" className="w-full flex flex-col items-center gap-1.5 mt-5">
      {letterRows.map((row, i) => (
        <div key={i} className="flex flex-row justify-center gap-1.5 w-full">
          {row.map(key => {
            return (
              <Button
                key={key}
                onClick={() => handleKeyClick(key)}
                variant="outline"
                style={keyStyle()}
                className={cn(
                  'h-auto p-0 font-bold uppercase flex items-center justify-center transition-colors duration-300 rounded-[5px] md:rounded-[10px]',
                  getStatusClass(key)
                )}
              >
                {key === 'DELETE' ? <Delete className="h-5 w-5" /> : key === 'SEND' ? <ArrowRight className="h-5 w-5" /> : <span>{key}</span>}
              </Button>
            );
          })}
        </div>
      ))}

      {/* Letzte Reihe: SEND + Sondertasten + die zwei Icon-Keys (🔥 Heißer Tipp, ⚙️ Einstellungen) */}
      <div className="flex flex-row justify-center gap-1.5 w-full">
        {['SEND', 'Ü', 'Ö', 'Ä', 'ẞ', 'DELETE'].map(key => {
          const isSend = key === 'SEND';
          const sendStyle: React.CSSProperties = {
            ...keyStyle(),
            width: `${widthPx * 1.55}px`,
          };
          return (
            <Button
              key={key}
              onClick={() => handleKeyClick(key)}
              aria-label={isSend ? 'Wort prüfen' : key === 'DELETE' ? 'Rücktaste' : undefined}
              variant="outline"
              style={isSend ? sendStyle : keyStyle()}
              className={cn(
                'h-auto p-0 font-bold uppercase flex items-center justify-center transition-colors duration-300 rounded-[5px] md:rounded-[10px]',
                getStatusClass(key)
              )}
            >
              {key === 'DELETE' ? <Delete className="h-5 w-5" /> : isSend ? <ArrowRight className="h-5 w-5" /> : <span>{key}</span>}
            </Button>
          );
        })}

        {/* 🔥 Heißer Tipp — reine Icon-Taste mit innerem Glow; verschwindet komplett nach einmaliger Nutzung */}
        {settings.hotTipEnabled && !hotTipUsed && (
          <Button
            onClick={onHotTip}
            disabled={hotTipUsed || gameState !== 'playing'}
            variant="outline"
            aria-label="Heißer Tipp – einen Buchstaben aufdecken"
            style={keyStyle()}
            className={cn(
              "h-auto p-0 text-orange-500 border-orange-500/60 flex items-center justify-center transition-colors rounded-[5px] md:rounded-[10px] relative overflow-hidden",
              isHotTipActive && settings.animationsEnabled && "flame-inner-glow"
            )}
          >
            <Flame className="h-5 w-5" />
          </Button>
        )}

        {/* ⚙️ Einstellungen — reine Icon-Taste */}
        <Button
          onClick={onOpenSettings}
          variant="outline"
          aria-label="Einstellungen öffnen"
          style={keyStyle()}
          className="h-auto p-0 flex items-center justify-center transition-colors rounded-[5px] md:rounded-[10px]"
        >
          <Gear className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const Grid = ({ guesses, currentGuess, isShaking, currentRowIndex, activeIndex, onCellClick, jokerReveal, jokerPosition, gameState, settings }: {
    guesses: { guess: string; statuses: LetterStatus[] }[];
    currentGuess: string[];
    isShaking: boolean;
    currentRowIndex: number;
    activeIndex: number;
    onCellClick: (index: number) => void;
    jokerReveal: { index: number; key: number } | null;
    jokerPosition: { guessIndex: number; letterIndex: number } | null;
    gameState: 'playing' | 'won' | 'lost';
    settings: WorthaftSettings;
}) => {
  const rows = Array.from({ length: MAX_GUESSES });
  const getStatusClass = (status: LetterStatus) => getWorthaftStatusClass(status, settings.palette) || 'border-border bg-background';
  const radiusPx = settings.tileRadius * 6;
  const tileDimensions = getWorthaftTileDimensions(settings.tileWidth, settings.tileHeight);

  // Die gewinnende Reihe ist die letzte eingereichte (bei 'won').
  const winningRowIndex = gameState === 'won' ? guesses.length - 1 : -1;

  return (
    <div data-testid="worthaft-grid" className="grid grid-rows-6 gap-1.5 mx-auto" style={{ width: `min(100%, ${tileDimensions.width * 5 + 24}px)` }}>
      {rows.map((_, rowIndex) => {
        const guessInfo = guesses[rowIndex];
        const isWonRow = rowIndex === winningRowIndex;

        return (
        <div key={rowIndex} className={cn(
          "grid grid-cols-5 gap-1.5 relative",
          isShaking && rowIndex === currentRowIndex && "animate-shake",
          isWonRow && settings.animationsEnabled && "win-shimmer"
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
            const jokerPositionInFile = jokerReveal;
            const isJokerCell = jokerPositionInFile && jokerPositionInFile.index === colIndex && isCurrentRow;
            const status: LetterStatus = guessInfo?.statuses[colIndex] || 'empty';
            const isJokerProtected = isCurrentRow && jokerPosition && jokerPosition.guessIndex === guesses.length && colIndex === jokerPosition.letterIndex;
            const isCellEditable = canInteractWithWorthaftGame(gameState) && isCurrentRow && !isJokerProtected;

            const anims = settings.animationsEnabled;
            const isSubmittedRow = !!guessInfo;

            // Flip nur für bereits eingereichte Reihen (wenn Animationen an).
            const flipDelay = `${colIndex * 0.25}s`;

            // Win-Bounce: nur auf der gewinnenden Reihe, nacheinander.
            const bounceDelay = isWonRow ? `${colIndex * 0.18}s` : undefined;
            const isWonCorrect = isWonRow && status === 'correct';
            // Gelbe Kachel: wie die anderen flippen, danach kurz hüpfen (erst NACH dem Flip ~0.5s).
            const isPresent = status === 'present' && isSubmittedRow;
            const presentBounceDelay = `${(0.25 * colIndex + 0.5).toFixed(2)}s`;

            // Animation-String zusammensetzen (nur wenn Animationen aktiv).
            let cellAnimation: string | undefined;
            if (anims && isSubmittedRow) {
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
                        if (isCellEditable) onCellClick(colIndex);
                    }}
                    className={cn(
                        'min-w-0 border-2 flex items-center justify-center text-3xl sm:text-4xl font-bold',
                        getStatusClass(status),
                        isCellEditable && 'cursor-pointer',
                        isCurrentRow && hasLetter && !isJokerProtected && 'border-muted-foreground',
                        isCellEditable && activeIndex === colIndex && 'border-primary ring-2 ring-primary scale-105',
                        anims && isSubmittedRow && 'flip-in'
                    )}
                    style={{
                      aspectRatio: `${tileDimensions.width} / ${tileDimensions.height}`,
                      borderRadius: `${radiusPx}px`,
                      animationDelay: anims && isSubmittedRow ? flipDelay : undefined,
                      ...(cellAnimation ? { animation: cellAnimation } : {}),
                    }}
                >
                    {isJokerCell ? (
                        <span className="relative flex w-full h-full items-center justify-center">
                            {letter}
                            {anims && (
                                <span
                                    key={jokerPositionInFile.key}
                                    aria-hidden
                                    className="flame-reveal pointer-events-none absolute inset-0 flex items-center justify-center text-4xl leading-none"
                                >
                                    🔥
                                </span>
                            )}
                        </span>
                    ) : (
                        letter
                    )}
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
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return (
    <>
        <div className="text-center">
            <p className="text-sm uppercase font-bold text-muted-foreground">Ergebnis</p>
            <p className="text-4xl font-bold">{gameState === 'won' ? guesses.length : 'X'} / {MAX_GUESSES}</p>
            <p className="text-sm text-muted-foreground mt-1">in {formatDurationLocal(totalTime)} Minuten</p>
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


        <div className="flex items-center gap-2">
            {gameState === 'won' && <WordDefinitionDialog word={solution} />}
            <Button size="lg" onClick={shareResults} className="min-w-0 flex-1 gap-2 px-3">
                <Share2 className="h-5 w-5 shrink-0" aria-hidden="true" />
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
    shareSolution: () => void;
    rowTimes: number[];
}) => {
    const isMobile = useIsMobile();
    const { isOpen, onOpenChange, ...rest } = props;

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent
                    side="bottom"
                    className="p-0 pt-0 max-h-[90vh] overflow-y-auto rounded-xl"
                    style={{
                        left: '1rem',
                        right: '1rem',
                        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
                    }}
                >
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


const HotTipDisplay = ({ isOpen, onOpenChange, onAccept }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: () => void;
}) => {
    const isMobile = useIsMobile();
    
    const content = (
        <div className="p-6">
            <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold font-headline">
                    Heißer Tipp! 🔥
                </DialogTitle>
                <DialogDescription className="pt-2 text-balance">
                    Du kannst diesen Joker einmal pro Tag nutzen. Wähle den Zeitpunkt weise.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex-col-reverse sm:flex-row gap-2">
                <Button onClick={onAccept} className="w-full">Verstanden!</Button>
            </DialogFooter>
        </div>
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

const WorthaftSettingsDrawer = ({
  isOpen,
  onOpenChange,
  settings,
  setSettings,
  onToggleMute,
  isMuted,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  settings: WorthaftSettings;
  setSettings: (patch: Partial<WorthaftSettings>) => void;
  onToggleMute: () => void;
  isMuted: boolean;
}) => {
  const isMobile = useIsMobile();

  const content = (
    <div className="min-w-0 w-full p-6 pt-4">
      <SheetHeader className="text-left mb-5">
        <SheetTitle className="text-2xl font-bold font-headline flex items-center gap-2">
          <Gear className="h-6 w-6" /> Einstellungen
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6">
        <section className="space-y-4" aria-label="Aussehen">
          <div>
            <h3 className="font-semibold">Dein Worthaft, dein Stil</h3>
            <p className="text-sm text-muted-foreground mt-1">Alles wird direkt übernommen und auf diesem Gerät gespeichert.</p>
          </div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Farbschema">
            {(['original', 'classic'] as const).map(palette => (
              <Button key={palette} variant="outline" aria-pressed={settings.palette === palette}
                onClick={() => setSettings({ palette })}
                className={cn('h-auto min-w-0 flex-col gap-2 py-3', settings.palette === palette && 'border-primary ring-1 ring-primary')}>
                <span className="flex gap-1" aria-hidden="true">
                  {['correct', 'present', 'absent'].map(status => <span key={status} className={cn('h-4 w-4 rounded-sm', getWorthaftStatusClass(status, palette))} />)}
                </span>
                <span>{palette === 'original' ? 'Worthaft' : 'Klassisch'}</span>
                <span className="text-[11px] font-normal text-muted-foreground">{palette === 'original' ? 'Blau · Gelb · Grau' : 'Grün · Gelb · Grau'}</span>
              </Button>
            ))}
          </div>
          <div data-testid="appearance-preview" className="rounded-xl border bg-muted/30 p-4 space-y-3 overflow-hidden">
            <p className="text-xs text-muted-foreground">Live-Vorschau · Richtig / enthalten / fehlt</p>
            <div className="flex justify-center gap-1.5">
              {['W', 'O', 'R', 'T', 'E'].map((letter, index) => {
                const dimensions = getWorthaftTileDimensions(settings.tileWidth, settings.tileHeight);
                return <span key={letter} className={cn('flex min-w-0 shrink items-center justify-center border-2 font-bold', getWorthaftStatusClass(['correct', 'present', 'absent'][index % 3], settings.palette))}
                  style={{ width: dimensions.width, aspectRatio: dimensions.width / dimensions.height, borderRadius: settings.tileRadius * 6 }}>{letter}</span>;
              })}
            </div>
            <div className="flex justify-center gap-1.5" aria-hidden="true">
              {['A', 'B', 'C'].map((letter, index) => <span key={letter} className={cn('flex items-center justify-center font-bold', getWorthaftStatusClass(['correct', 'present', 'absent'][index], settings.palette))}
                style={{ ...getWorthaftKeyDimensions(settings.keyWidth, settings.keyHeight), borderRadius: settings.keyRadius * 6, fontSize: 12 + settings.keySize * 2.5 }}>{letter}</span>)}
            </div>
          </div>
          {([
            ['Tastatur', [
              ['keyWidth', 'Tastenbreite', 26 + settings.keyWidth * 6, 'Schmal', 'Breit'],
              ['keyHeight', 'Tastenhöhe', 26 + settings.keyHeight * 6, 'Flach', 'Hoch'],
              ['keySize', 'Schriftgröße', 12 + settings.keySize * 2.5, 'Klein', 'Groß'],
              ['keyRadius', 'Tastenrundung', settings.keyRadius * 6, 'Eckig', 'Rund'],
            ]],
            ['Kacheln', [
              ['tileWidth', 'Kachelbreite', 40 + settings.tileWidth * 8, 'Schmal', 'Breit'],
              ['tileHeight', 'Kachelhöhe', 40 + settings.tileHeight * 8, 'Flach', 'Hoch'],
              ['tileRadius', 'Kachelrundung', settings.tileRadius * 6, 'Eckig', 'Rund'],
            ]],
          ] as const).map(([title, controls]) => (
            <fieldset key={title} className="min-w-0 space-y-4 rounded-xl border p-4">
              <legend className="px-1 text-sm font-semibold">{title}</legend>
              {controls.map(([key, label, pixels, low, high]) => (
                <div key={key}>
                  <div className="flex justify-between gap-2 mb-3 text-sm">
                    <span id={`setting-${key}`}>{label}</span><span className="text-muted-foreground tabular-nums">{pixels} px</span>
                  </div>
                  <input type="range" aria-labelledby={`setting-${key}`} value={settings[key]} onChange={event => setSettings({ [key]: Number(event.target.value) })} min={0} max={4} step={1} className="h-6 w-full cursor-pointer accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground"><span>{low}</span><span>{high}</span></div>
                </div>
              ))}
            </fieldset>
          ))}
          <p className="text-xs text-muted-foreground">Breite Tasten und Kacheln passen sich auf kleinen Bildschirmen automatisch an den verfügbaren Platz an.</p>
          <Button variant="outline" className="w-full" onClick={() => setSettings({
            keyWidth: 2, keyHeight: 2, keySize: 2, keyRadius: 2,
            tileWidth: 2, tileHeight: 2, tileRadius: 0, palette: 'original',
          })}>Aussehen zurücksetzen</Button>
        </section>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <Label className="text-sm font-medium">Heißer Tipp aktiv</Label>
          </div>
          <Checkbox
            checked={settings.hotTipEnabled}
            onCheckedChange={(c) => setSettings({ hotTipEnabled: !!c })}
          />
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            <div>
              <Label className="text-sm font-medium">Hintergrundmusik</Label>
              <p className="text-xs text-muted-foreground">{settings.musicEnabled ? 'An' : 'Aus'}{isMuted && settings.musicEnabled ? ' (stumm)' : ''}</p>
            </div>
          </div>
          <Checkbox
            checked={settings.musicEnabled}
            onCheckedChange={(c) => {
              const next = !!c;
              setSettings({ musicEnabled: next });
              // Musik = nicht stumm. Wenn an -> entstummen, wenn aus -> stummschalten.
              if (next && isMuted) onToggleMute();
              if (!next && !isMuted) onToggleMute();
            }}
          />
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Label className="text-sm font-medium">Animationen &amp; Effekte</Label>
          </div>
          <Checkbox
            checked={settings.animationsEnabled}
            onCheckedChange={(c) => setSettings({ animationsEnabled: !!c })}
          />
        </div>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => {
            onOpenChange(false);
            if (typeof window !== 'undefined') window.location.href = '/worthaft/ueber';
          }}
        >
          <Info className="h-4 w-4" />
          Anleitung
        </Button>
      </div>
    </div>
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
      <DialogContent className="p-0 max-w-sm rounded-lg max-h-[90dvh] overflow-y-auto">
        {content}
      </DialogContent>
    </Dialog>
  );
};

const InvalidWordModal = ({
  onOpenChange,
  submission,
}: {
  onOpenChange: (open: boolean) => void;
  submission: InvalidWorthaftWord;
}) => {
  const { word, isKnownInvalid } = submission;
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fb, setFb] = useState<{ firestore: any } | null>(null);
  const [showReviewedMessage, setShowReviewedMessage] = useState(false);

  useEffect(() => {
    if (isKnownInvalid) return;
    const app = initializeFirebase();
    setFb(app);
  }, [isKnownInvalid]);

  const handleSubmit = async (shouldExist: boolean) => {
    if (!fb || isKnownInvalid) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(fb.firestore, 'worthaft-word-suggestions'), {
        word,
        shouldExist,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to save word suggestion:', err);
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  const handleVote = (shouldExist: boolean) => {
    const action = getInvalidWordVoteAction(isKnownInvalid, shouldExist);
    if (action === 'show-reviewed-message') {
      setShowReviewedMessage(true);
    } else if (action === 'dismiss') {
      onOpenChange(false);
    } else {
      void handleSubmit(shouldExist);
    }
  };

  const dialogDescription = showReviewedMessage
    ? 'Wir haben das Wort bereits überprüft und erachten es als ungültig.'
    : 'Sollte dieses Wort existieren?';

  const content = (
    <>
      <div className="mb-2 flex items-center gap-2 pr-6">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <HelpCircle className="h-4 w-4" />
        </span>
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Worthaft Wörter
        </p>
      </div>

      <h2 className="font-headline mb-1.5 text-lg font-extrabold leading-snug sm:text-xl">
        „{word}“ ist ein ungültiges Wort
      </h2>
      {showReviewedMessage ? (
        <p className="text-sm text-muted-foreground">
          Wir haben das Wort bereits überprüft und erachten es als ungültig.
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-muted-foreground">
            Sollte dieses Wort existieren?
          </p>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleVote(true)}
              disabled={isSubmitting}
              className="w-full rounded-full"
            >
              Ja
            </Button>
            <Button
              onClick={() => handleVote(false)}
              disabled={isSubmitting}
              variant="outline"
              className="w-full rounded-full border-foreground text-foreground hover:bg-muted"
            >
              Nein
            </Button>
          </div>
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="p-0 pt-0 max-h-[90vh] overflow-y-auto rounded-t-lg">
          <div className="p-6">
            <SheetHeader className="text-left sr-only">
              <SheetTitle>Ungültiges Wort</SheetTitle>
              <SheetDescription>{dialogDescription}</SheetDescription>
            </SheetHeader>
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-sm rounded-t-lg overflow-hidden">
        <div className="p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Ungültiges Wort</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function WorthaftPage() {
    const router = useRouter();
    const [settings, setSettings] = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [invalidWord, setInvalidWord] = useState<InvalidWorthaftWord | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [rowTimes, setRowTimes] = useState<number[]>([]); // ms per submitted guess
    const [gameStartTime, setGameStartTime] = useState<number>(0);
    const rowStartTimeRef = useRef<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Joker "Hot Tip" state
    const [showHotTipDialog, setShowHotTipDialog] = useState(false);
    const [hotTipUsed, setHotTipUsed] = useState(false);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
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

    // Format a duration in ms as M:SS (or M:SS for tens of minutes).
    const formatDuration = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const saveState = useCallback((newGuesses: { guess: string; statuses: LetterStatus[] }[], newStatus: 'won' | 'lost' | 'playing', newLetterStatuses: { [key: string]: LetterStatus }, newHotTipUsed: boolean, newJokerPosition: { guessIndex: number; letterIndex: number } | null, newRowTimes: number[]) => {
        const dailyState: DailyGameState = {
            date: getTodayString(),
            guesses: newGuesses,
            status: newStatus,
            letterStatuses: newLetterStatuses,
            hotTipUsed: newHotTipUsed,
            jokerPosition: newJokerPosition || undefined,
            rowTimes: newRowTimes,
        };
        localStorage.setItem('worthaft-daily-game', JSON.stringify(dailyState));
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

    // Hintergrundmusik folgt der Settings-Option "musicEnabled" (nur wenn nicht stumm).
    useEffect(() => {
        if (!audioRef.current) return;
        if (settings.musicEnabled && !isMuted) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [settings.musicEnabled, isMuted]);

    useEffect(() => {
        const disabled = localStorage.getItem('worthaft-hottip-disabled') === 'true';
        setIsHotTipPopupDisabled(disabled);

        const todayStr = getTodayString();
        setSolution(getWordOfTheDay());
        setGameStartTime(Date.now());

        const savedStats = localStorage.getItem('worthaft-stats');
        if (savedStats) {
            const parsedStats = JSON.parse(savedStats);
            setStats({ games: 0, wins: 0, streak: 0, maxStreak: 0, ...parsedStats });
        }

        const savedGame = localStorage.getItem('worthaft-daily-game');
        let completedToday = false;
        if (savedGame) {
            try {
                const dailyState: DailyGameState = JSON.parse(savedGame);
                if (dailyState.date === todayStr) {
                    setGuesses(dailyState.guesses);
                    setGameState(dailyState.status);
                    setLetterStatuses(dailyState.letterStatuses || {});
                    setHotTipUsed(dailyState.hotTipUsed || false);
                    setRowTimes(dailyState.rowTimes || []);
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
                        completedToday = true;
                        setIsCompletedToday(true);
                        setTimeout(() => {
                            if (hasWorthaftFeedbackDecision(localStorage, getTodayString())) {
                                setIsDialogOpen(true);
                            } else {
                                setIsFeedbackOpen(true);
                            }
                        }, 2000);
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved game state:", e);
                localStorage.removeItem('worthaft-daily-game');
            }
        }

        // Row timer: resume the persisted row start so a reload keeps the clock
        // running; otherwise the current row starts now. Thinking time counts.
        if (completedToday) {
            rowStartTimeRef.current = 0;
            clearWorthaftRowStart(localStorage);
        } else {
            const persistedRowStart = readWorthaftRowStart(localStorage, todayStr);
            if (persistedRowStart !== null) {
                rowStartTimeRef.current = persistedRowStart;
            } else {
                const now = Date.now();
                rowStartTimeRef.current = now;
                writeWorthaftRowStart(localStorage, todayStr, now);
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
        const handleActivity = () => {
          resetInactivityTimer();
        };

        resetInactivityTimer();

        const activityEvents: (keyof WindowEventMap)[] = ['keydown', 'mousemove', 'click', 'touchstart'];
        
        activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));

        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
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

        // Fallback only: the row timer normally starts when the row becomes
        // active (see mount effect and handleEnter). If it is not running yet
        // (e.g. cleared storage), start it on the first letter of a fresh row.
        if (currentGuess.every((c) => c === '') && rowStartTimeRef.current === 0) {
            const now = Date.now();
            rowStartTimeRef.current = now;
            writeWorthaftRowStart(localStorage, getTodayString(), now);
        }

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

        // Measure the time spent on this guess row.
        const rowElapsed = rowStartTimeRef.current > 0 ? Date.now() - rowStartTimeRef.current : 0;
        const newRowTimes = [...rowTimes, rowElapsed];
        
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
            // 🎆 Fireworks — respektiert Animationen-Einstellung
            try {
              const raw = localStorage.getItem('worthaft-settings');
              const parsed = raw ? JSON.parse(raw) : {};
              const animOn = parsed.animationsEnabled !== false;
              if (animOn) fireWorthaftFireworks();
            } catch { fireWorthaftFireworks(); }
            setRowTimes(newRowTimes);
            setCurrentGuess(Array(WORD_LENGTH).fill('')); // Clear current guess
            
            const newStreak = (stats.streak || 0) + 1;
            const newStats = { 
                games: (stats.games || 0) + 1, 
                wins: (stats.wins || 0) + 1, 
                streak: newStreak, 
                maxStreak: Math.max(stats.maxStreak || 0, newStreak) 
            };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            rowStartTimeRef.current = 0;
            clearWorthaftRowStart(localStorage);
            saveState(newGuesses, 'won', newLetterStatuses, hotTipUsed, jokerPosition, newRowTimes);
            setIsCompletedToday(true);
            setTimeout(() => {
                if (hasWorthaftFeedbackDecision(localStorage, getTodayString())) {
                    setIsDialogOpen(true);
                } else {
                    setIsFeedbackOpen(true);
                }
            }, 2000);
            return;
        }


        const isKnownAntiWord = isWorthaftAntiWord(guessWord);
        if (isKnownAntiWord || !WORDS.includes(guessWord.toLowerCase())) {
            setInvalidWord(createInvalidWorthaftWord(guessWord, isKnownAntiWord));
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
            setCurrentGuess(Array(WORD_LENGTH).fill('')); // Clear current guess
            const newStats = { 
                games: (stats.games || 0) + 1,
                wins: stats.wins || 0,
                streak: 0,
                maxStreak: stats.maxStreak || 0
            };
            setStats(newStats);
            localStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            rowStartTimeRef.current = 0;
            clearWorthaftRowStart(localStorage);
            saveState(newGuesses, 'lost', newLetterStatuses, hotTipUsed, jokerPosition, newRowTimes);
            setIsCompletedToday(true);
            setTimeout(() => {
                if (hasWorthaftFeedbackDecision(localStorage, getTodayString())) {
                    setIsDialogOpen(true);
                } else {
                    setIsFeedbackOpen(true);
                }
            }, 1200);
        } else {
            // Game is still playing, prepare the next row
            setCurrentGuess(Array(WORD_LENGTH).fill(''));
            setActiveIndex(0);
            setRowTimes(newRowTimes);
            // Start the timer for the next row now - thinking time counts.
            // Persisted so a reload keeps the clock running.
            const nextRowStart = Date.now();
            rowStartTimeRef.current = nextRowStart;
            writeWorthaftRowStart(localStorage, getTodayString(), nextRowStart);
            saveState(newGuesses, 'playing', newLetterStatuses, hotTipUsed, jokerPosition, newRowTimes);
        }
    }, [currentGuess, gameState, guesses, letterStatuses, solution, stats, toast, saveState, hotTipUsed, jokerPosition, rowTimes]);

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
        if (!canInteractWithWorthaftGame(gameState) || isDialogOpen || isSettingsOpen || showHotTipDialog || isFeedbackOpen || invalidWord !== null) return;

        if (event.key === 'Enter') {
            event.preventDefault();
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
    }, [gameState, isDialogOpen, isSettingsOpen, showHotTipDialog, isFeedbackOpen, invalidWord, handleEnter, handleDelete, handleChar, activeIndex, jokerPosition, guesses.length]);
    
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
                if (s === 'correct') return settings.palette === 'classic' ? '🟩' : '🟦';
                if (s === 'present') return '🟨';
                return '⬛';
            }).join('') +
            (rowTimes[guessIndex] !== undefined ? ` (${formatDuration(rowTimes[guessIndex])})` : '')
        ).join('\n');

        const totalTime = rowTimes.reduce((sum, t) => sum + t, 0);
        const tipUsedLine = hotTipUsed ? `(1 Heißer Tipp verwendet 🔥)` : "";

        const text = `Worthaft

Mein Ergebnis: ${gameState === 'won' ? guesses.length : 'X'} / ${MAX_GUESSES} innerhalb von ${formatDuration(totalTime)} Minuten ${tipUsedLine}

${resultGrid}

Jetzt spielen:`;
        
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

            const shareSolution = async () => {
                // Same grid but with solution revealed - all green since we know the answer
                const resultGrid = guesses.map((g, guessIndex) =>
                    g.statuses.map((s, letterIndex) => {
                        if (jokerPosition && jokerPosition.guessIndex === guessIndex && jokerPosition.letterIndex === letterIndex) {
                            return '🔥';
                        }
                        if (s === 'correct') return settings.palette === 'classic' ? '🟩' : '🟦';
                        if (s === 'present') return '🟨';
                        return '⬛';
                    }).join('') +
                    (rowTimes[guessIndex] !== undefined ? ` (${formatDuration(rowTimes[guessIndex])})` : '')
                ).join('\n');

                const totalTime = rowTimes.reduce((sum, t) => sum + t, 0);

                const text = `Worthaft – Das Paulik & Reisch Spiel (LÖSUNG GELEAKT 🤫)

        Mein Ergebnis: ${gameState === 'won' ? guesses.length : 'X'} / ${MAX_GUESSES} innerhalb von ${formatDuration(totalTime)} Minuten

        Lösung: ${solution.toUpperCase()}

        ${resultGrid}

        Jetzt selber spielen:`;

                const shareData = {
                    title: 'Worthaft – Das Paulik & Reisch Spiel (Lösung)',
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
                        toast({ title: 'Kopiert!', description: 'Lösung in die Zwischenablage kopiert.', duration: 2000 });
                    });
                }
            }

            const handleAcceptHotTip = () => {
        if (hotTipUsed || gameState !== 'playing' || !settings.hotTipEnabled) return;

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
            saveState(guesses, 'playing', letterStatuses, true, newJokerPosition, rowTimes);
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
            <main className="flex-1 py-2 md:py-3">
                <div className="w-full max-w-sm mx-auto px-4 sm:px-0 flex flex-col items-center justify-start">
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
                            settings={settings}
                        />
                        <Keyboard
                            onChar={handleChar}
                            onEnter={handleEnter}
                            onDelete={handleDelete}
                            letterStatuses={letterStatuses}
                            onHotTip={() => setShowHotTipDialog(true)}
                            onOpenSettings={() => setIsSettingsOpen(true)}
                            hotTipUsed={hotTipUsed}
                            gameState={gameState}
                            settings={settings}
                        />
                    </div>
                    {/* Sonnenschein-Halbkreis-Glow hinter der Tastatur (laufende Motion) */}
                    <div
                        aria-hidden
                        className="pointer-events-none relative -mt-10 flex justify-center overflow-visible"
                    >
                        <div
                            className="h-20 w-[140%] max-w-3xl animate-sun-glow rounded-[50%]"
                            style={{
                                background: 'radial-gradient(ellipse at 50% 100%, rgba(255,210,61,0.85) 0%, rgba(255,236,138,0.6) 25%, rgba(255,140,25,0.35) 50%, rgba(58,96,255,0.18) 72%, transparent 100%)',
                                filter: 'blur(45px)',
                                transform: 'translateY(35%)',
                            }}
                        />
                    </div>
                </div>
            </main>
            {/* Sonnenschein-Glow am unteren Rand über dem Footer */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-64 overflow-hidden"
                style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, transparent 100%)' }}
            >
                <Image
                    src="/worthaft-sunshine.png"
                    alt=""
                    fill
                    className="object-cover object-bottom opacity-70 animate-warm-glow"
                    priority={false}
                />
            </div>
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
             <HotTipDisplay
                 isOpen={showHotTipDialog}
                 onOpenChange={setShowHotTipDialog}
                 onAccept={handleAcceptHotTip}
             />
             <FeedbackDrawer
                 isOpen={isFeedbackOpen}
                 onOpenChange={(open) => {
                     setIsFeedbackOpen(open);
                     if (!open) {
                         // Feedback abgeschlossen -> Statistik-Popup/drawer zeigen (unabhängig davon,
                         // ob heute schon Feedback gegeben wurde).
                         setIsDialogOpen(true);
                     }
                 }}
                 onClose={() => {
                     // „Danke"-Screen geschlossen -> Feedback zu & Ergebnis-Modal auf.
                     setIsFeedbackOpen(false);
                     setIsDialogOpen(true);
                 }}
                solution={solution}
            />
            <WorthaftSettingsDrawer
                isOpen={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                settings={settings}
                setSettings={setSettings}
                onToggleMute={toggleMute}
                isMuted={isMuted}
            />
            {invalidWord && (
                <InvalidWordModal
                    onOpenChange={(open) => { if (!open) setInvalidWord(null); }}
                    submission={invalidWord}
                />
            )}
        </div>
    );
}