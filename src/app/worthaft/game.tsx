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
import { Share2, ArrowRight, Delete, HelpCircle, Volume2, VolumeX, Flame, Settings as Gear, Music, Info, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedbackDrawer from './FeedbackDrawer';
import WordDefinitionDialog from './WordDefinitionDialog';
import { initializeFirebase } from '@/firebase';
import { ensureWorthaftAuth } from '@/firebase/on-demand-auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { getWorthaftKeyDimensions, getWorthaftTileDimensions, getWorthaftStatusClass, normalizeWorthaftSettings, DEFAULT_WORTHAFT_SETTINGS as DEFAULT_SETTINGS, type WorthaftSettings } from '@/lib/worthaft-settings';
import {
  canInteractWithWorthaftGame,
  clearWorthaftRowStart,
  createWorthaftRowTimer,
  getWorthaftRowElapsed,
  pauseWorthaftRowTimer,
  readWorthaftRowTimer,
  resumeWorthaftRowTimer,
  writeWorthaftRowTimer,
  type WorthaftRowTimer,
} from '@/lib/worthaft-game-state';
import { getWorthaftKeyboardLetter } from '@/lib/worthaft-letters';
import { hasWorthaftFeedbackDecision } from '@/lib/worthaft-feedback';
import { isWorthaftAntiWord } from '@/lib/worthaft-anti-words';
import { worthaftStorage, parseWorthaftDailyGame, parseWorthaftStats, type SavedDailyGame } from '@/lib/worthaft-saved-state';
import { getWorthaftDateString, getWorthaftMillisecondsUntilNextDay } from '@/lib/worthaft-daily-word';
import {
  createInvalidWorthaftWord,
  getInvalidWordVoteAction,
  type InvalidWorthaftWord,
} from '@/lib/worthaft-invalid-word';

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

const loadSettings = (): WorthaftSettings => {
  try {
    const raw = worthaftStorage.getItem('worthaft-settings');
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
      try { worthaftStorage.setItem('worthaft-settings', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return [settings, setSettings] as const;
};

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

type HotTip = { letter: string | null; attempt: number | null };

type DailyGameState = SavedDailyGame;

const Keyboard = ({ onChar, onEnter, onDelete, letterStatuses, onHotTip, onOpenSettings, hotTip, gameState, settings, boardWidth }: {
  onChar: (value: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  letterStatuses: { [key: string]: LetterStatus };
  onHotTip: () => void;
  onOpenSettings: () => void;
  hotTip: HotTip | null;
  gameState: 'playing' | 'won' | 'lost';
  settings: WorthaftSettings;
  boardWidth: number;
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['SEND', 'Ü', 'Ö', 'Ä', 'ẞ', 'DELETE'],
  ];

  const getKeyClass = (key: string) => cn(
    'h-auto p-0 font-bold uppercase flex items-center justify-center transition-colors duration-300',
    getWorthaftStatusClass(letterStatuses[key], settings.palette) || 'bg-muted hover:bg-accent',
    gameState === 'playing' && key === hotTip?.letter && (
      settings.animationsEnabled ? 'worthaft-tip-key worthaft-tip-key-animated' : 'worthaft-tip-key'
    ),
  );
  const getKeyDescription = (key: string) => {
    if (gameState === 'playing' && key === hotTip?.letter) return 'Heißer Tipp: Dieser Buchstabe kommt im Lösungswort vor.';
    if (letterStatuses[key] === 'absent') return 'Kommt im Lösungswort nicht vor.';
  };

  const handleKeyClick = (key: string) => {
    if (key === 'SEND') onEnter();
    else if (key === 'DELETE') onDelete();
    else onChar(key);
  };

  const { width: widthPx, height: heightPx } = getWorthaftKeyDimensions(settings.keyWidth, settings.keyHeight);
  const defaultKeyWidth = getWorthaftKeyDimensions(2, settings.keyHeight).width;
  const keyboardWidth = Math.max(boardWidth, Math.round(boardWidth * widthPx / defaultKeyWidth));
  const fontPx = 12 + (settings.keySize / 4) * 10;
  const radiusPx = (settings.keyRadius / 4) * 24;
  const keyGap = 4;

  // Alle Tasten gleich breit: Breite richtet sich nach der laengsten Reihe (10 Tasten),
  // kuerzere Reihen bleiben dadurch schmaler und werden zentriert.
  const uniformKeyWidth = Math.min(widthPx, Math.max((keyboardWidth - 9 * keyGap) / 10, 18));
  // SEND und LOESCHEN sind bewusst breiter (exakt 2 Tastenslots), alle anderen Tasten
  // gleich breit. Dadurch ist die letzte Reihe trotz Heisser-Tipp- und
  // Einstellungs-Taste exakt so lang wie die laengste Reihe (10 Slots) und niemals
  // laenger (Vorgabe von Max, 13.11.2026).
  const keyStyle = (wide = false): React.CSSProperties => ({
    // Auf schmalen Screens gegen die tatsaechliche Container-Breite (100vw - 2rem) kappen,
    // damit Reihe 1 nicht schmaler wird als die kuerzeren Reihen.
    width: wide
      ? `min(${2 * uniformKeyWidth + keyGap}px, calc(2 * (100vw - 2rem - ${9 * keyGap}px) / 10 + ${keyGap}px))`
      : `min(${uniformKeyWidth}px, calc((100vw - 2rem - ${9 * keyGap}px) / 10))`,
    minWidth: 0,
    flexShrink: 1,
    height: `${heightPx}px`,
    fontSize: `${fontPx}px`,
    borderRadius: `${radiusPx}px`,
  });

  const isHotTipActive = !hotTip && gameState === 'playing' && settings.hotTipEnabled;
  const letterRows = rows.slice(0, 3);

  return (
    <div
      data-testid="worthaft-keyboard"
      className="relative left-1/2 flex flex-col items-center gap-1.5 mt-3 -translate-x-1/2"
      style={{ width: `min(calc(100vw - 2rem), ${keyboardWidth}px)` }}
    >
      {letterRows.map((row, i) => (
        <div key={i} className="flex flex-row justify-center gap-1 w-full">
          {row.map(key => {
            return (
              <Button
                key={key}
                onClick={() => handleKeyClick(key)}
                variant="outline"
                style={keyStyle()}
                className={getKeyClass(key)}
                aria-description={getKeyDescription(key)}
              >
                {key === 'DELETE' ? <Delete className="h-5 w-5" /> : key === 'SEND' ? <ArrowRight className="h-5 w-5" /> : <span>{key}</span>}
              </Button>
            );
          })}
        </div>
      ))}

      {/* Letzte Reihe: SEND + Sondertasten + die zwei Icon-Keys (🔥 Heißer Tipp, ⚙️ Einstellungen) */}
      <div className="flex flex-row justify-center gap-1 w-full">
        {['SEND', 'Ü', 'Ö', 'Ä', 'ẞ', 'DELETE'].map(key => {
          const isSend = key === 'SEND';
          return (
            <Button
              key={key}
              onClick={() => handleKeyClick(key)}
              aria-label={isSend ? 'Wort prüfen' : key === 'DELETE' ? 'Rücktaste' : undefined}
              variant="outline"
              style={keyStyle(isSend || key === 'DELETE')}
              className={getKeyClass(key)}
              aria-description={getKeyDescription(key)}
            >
              {key === 'DELETE' ? <Delete className="h-5 w-5" /> : isSend ? <ArrowRight className="h-5 w-5" /> : <span>{key}</span>}
            </Button>
          );
        })}

        {/* 🔥 Heißer Tipp — reine Icon-Taste mit innerem Glow; verschwindet komplett nach einmaliger Nutzung */}
        {settings.hotTipEnabled && !hotTip && (
          <Button
            onClick={onHotTip}
            disabled={gameState !== 'playing'}
            variant="outline"
            aria-label="Heißer Tipp – einen Buchstaben markieren"
            style={keyStyle()}
            className={cn(
              "h-auto p-0 text-orange-500 border-orange-500/60 dark:text-orange-200/70 dark:border-orange-200/25 flex items-center justify-center transition-colors rounded-[5px] md:rounded-[10px] relative overflow-hidden",
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

const Grid = ({ guesses, currentGuess, isShaking, currentRowIndex, activeIndex, onCellClick, gameState, settings }: {
    guesses: { guess: string; statuses: LetterStatus[] }[];
    currentGuess: string[];
    isShaking: boolean;
    currentRowIndex: number;
    activeIndex: number;
    onCellClick: (index: number) => void;
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
    <div data-testid="worthaft-grid" className="grid grid-rows-6 gap-1.5 w-full">
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
            const status: LetterStatus = guessInfo?.statuses[colIndex] || 'empty';
            const isCellEditable = canInteractWithWorthaftGame(gameState) && isCurrentRow;

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
                        isCurrentRow && hasLetter && 'border-muted-foreground',
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
                                {rest.gameState === 'won' ? 'Gratulation!' : rest.gameState === 'lost' ? 'Leider verloren!' : 'Du hast bereits gespielt!'}
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
                            {rest.gameState === 'won' ? 'Gratulation!' : rest.gameState === 'lost' ? 'Leider verloren!' : 'Du hast bereits gespielt!'}
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
                    Der Joker markiert einen Buchstaben auf der Tastatur, der im Lösungswort vorkommt. Finde selbst heraus, an welche Stelle er gehört. Du kannst den Tipp einmal pro Tag nutzen.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex-col-reverse sm:flex-row gap-2">
                <Button onClick={onAccept} className="w-full">Tipp verwenden</Button>
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

const WorthaftSettingsDialog = ({
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
    <div className="min-w-0 w-full">
      <SheetHeader className="border-b px-4 py-4 pr-12 text-left md:pl-6">
        <SheetTitle className="text-2xl font-bold font-headline flex items-center gap-2">
          <Gear className="h-6 w-6" /> Einstellungen
        </SheetTitle>
        <SheetDescription>Änderungen gelten sofort und werden auf diesem Gerät gespeichert.</SheetDescription>
      </SheetHeader>

      <Tabs defaultValue="appearance" orientation={isMobile ? 'horizontal' : 'vertical'} className="grid md:grid-cols-[10rem_minmax(0,1fr)] md:bg-muted">
        <TabsList aria-label="Einstellungskategorien" className="sticky top-0 z-10 flex justify-start gap-1 rounded-none border-b p-2 md:flex-col md:items-stretch md:self-start md:border-b-0 md:p-3">
          <TabsTrigger className="justify-start" value="appearance">Aussehen</TabsTrigger>
          <TabsTrigger className="justify-start" value="game">Spiel</TabsTrigger>
          <TabsTrigger className="justify-start" value="sound">Ton</TabsTrigger>
        </TabsList>
        <TabsContent value="appearance" className="min-w-0 bg-background px-4 py-4 md:border-l md:px-6">
          <section className="space-y-4" aria-label="Aussehen">
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
                  return <span key={letter} className={cn('flex min-w-0 shrink items-center justify-center border-2 text-3xl sm:text-4xl font-bold', getWorthaftStatusClass(['correct', 'present', 'absent'][index % 3], settings.palette))}
                    style={{ width: dimensions.width, aspectRatio: dimensions.width / dimensions.height, borderRadius: settings.tileRadius * 6 }}>{letter}</span>;
                })}
              </div>
              <div className="flex justify-center gap-1.5" aria-hidden="true">
                {['A', 'B', 'C'].map((letter, index) => {
                  const keyDimensions = getWorthaftKeyDimensions(settings.keyWidth, settings.keyHeight);
                  const defaultKeyWidth = getWorthaftKeyDimensions(2, settings.keyHeight).width;
                  const tileWidth = getWorthaftTileDimensions(settings.tileWidth, settings.tileHeight).width;
                  const boardWidth = 5 * tileWidth + 4 * 6;
                  const keyboardWidth = Math.max(boardWidth, Math.round(boardWidth * keyDimensions.width / defaultKeyWidth));
                  const slotWidth = (keyboardWidth - 9 * 4) / 10;
                  const keyWidthPx = Math.min(keyDimensions.width, Math.max(slotWidth, 18));
                  return <span key={letter} className={cn('flex items-center justify-center font-bold', getWorthaftStatusClass(['correct', 'present', 'absent'][index], settings.palette), index === 2 && 'opacity-20')}
                    style={{ width: keyWidthPx, height: keyDimensions.height, borderRadius: settings.keyRadius * 6, fontSize: 12 + settings.keySize * 2.5 }}>{letter}</span>;
                })}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {([
              ['Tastatur', [
                ['keyWidth', 'Tastenbreite', 'Schmal', 'Breit'],
                ['keyHeight', 'Tastenhöhe', 'Flach', 'Hoch'],
                ['keySize', 'Schriftgröße', 'Klein', 'Groß'],
                ['keyRadius', 'Tastenrundung', 'Eckig', 'Rund'],
              ]],
              ['Kacheln', [
                ['tileWidth', 'Kachelbreite', 'Schmal', 'Breit'],
                ['tileHeight', 'Kachelhöhe', 'Flach', 'Hoch'],
                ['tileRadius', 'Kachelrundung', 'Eckig', 'Rund'],
              ]],
            ] as const).map(([title, controls]) => (
              <fieldset key={title} className="min-w-0 space-y-3 rounded-xl border p-4">
                <legend className="px-1 text-sm font-semibold">{title}</legend>
                {controls.map(([key, label, low, high]) => (
                  <div key={key}>
                    <div className="flex justify-between gap-2 text-sm">
                      <span id={`setting-${key}`}>{label}</span><span className="text-muted-foreground tabular-nums">{settings[key]}</span>
                    </div>
                    <input type="range" aria-labelledby={`setting-${key}`} aria-valuetext={`Stufe ${settings[key]}`} value={settings[key]} onChange={event => setSettings({ [key]: Number(event.target.value) })} min={0} max={4} step={1} className="h-6 w-full cursor-pointer accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                    <div className="flex justify-between text-xs text-muted-foreground"><span>{low}</span><span>{high}</span></div>
                  </div>
                ))}
              </fieldset>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Breite Tasten und Kacheln passen sich auf kleinen Bildschirmen automatisch an den verfügbaren Platz an.</p>
            <Button variant="outline" className="w-full" onClick={() => setSettings({
              keyWidth: DEFAULT_SETTINGS.keyWidth, keyHeight: DEFAULT_SETTINGS.keyHeight,
              keySize: DEFAULT_SETTINGS.keySize, keyRadius: DEFAULT_SETTINGS.keyRadius,
              tileWidth: DEFAULT_SETTINGS.tileWidth, tileHeight: DEFAULT_SETTINGS.tileHeight,
              tileRadius: DEFAULT_SETTINGS.tileRadius, palette: DEFAULT_SETTINGS.palette,
            })}>Aussehen zurücksetzen</Button>
          </section>
        </TabsContent>

        <TabsContent value="game" className="space-y-4 bg-background px-4 py-4 md:border-l md:px-6">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <Label htmlFor="worthaft-setting-tip" className="text-sm font-medium">Heißer Tipp aktiv</Label>
            </div>
            <Checkbox
              id="worthaft-setting-tip"
              checked={settings.hotTipEnabled}
              onCheckedChange={(c) => setSettings({ hotTipEnabled: !!c })}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Label htmlFor="worthaft-setting-animations" className="text-sm font-medium">Animationen &amp; Effekte</Label>
            </div>
            <Checkbox
              id="worthaft-setting-animations"
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
        </TabsContent>
        <TabsContent value="sound" className="bg-background px-4 py-4 md:border-l md:px-6">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <div>
                <Label htmlFor="worthaft-setting-music" className="text-sm font-medium">Hintergrundmusik</Label>
                <p className="text-xs text-muted-foreground">{settings.musicEnabled ? 'An' : 'Aus'}{isMuted && settings.musicEnabled ? ' (stumm)' : ''}</p>
              </div>
            </div>
            <Checkbox
              id="worthaft-setting-music"
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
        </TabsContent>
      </Tabs>
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
      <DialogContent className="w-[calc(100%-2rem)] max-w-4xl p-0 rounded-lg max-h-[90dvh] overflow-y-auto">
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
  const [showReviewedMessage, setShowReviewedMessage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (shouldExist: boolean) => {
    if (isKnownInvalid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { auth, firestore } = initializeFirebase();
      await ensureWorthaftAuth(auth);
      await addDoc(collection(firestore, 'worthaft-word-suggestions'), {
        word,
        shouldExist,
        date: getWorthaftDateString(),
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to save word suggestion:', err);
      setSubmitError('Feedback konnte nicht gespeichert werden');
    } finally {
      setIsSubmitting(false);
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

  const dialogDescription = isSubmitted
    ? 'Wir prüfen Dein Feedback.'
    : showReviewedMessage
      ? 'Wir haben das Wort bereits überprüft und erachten es als ungültig.'
      : 'Sollte dieses Wort existieren?';

  const content = isSubmitted ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center py-4 text-center"
    >
      <span className="relative -top-3 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-95 duration-300">
        <Check className="h-8 w-8" />
      </span>
      <h2 className="font-headline relative -top-3 mb-1.5 text-xl font-extrabold">Wir prüfen Dein Feedback.</h2>
      <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-6">
        Schließen
      </Button>
    </motion.div>
  ) : (
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

          {submitError && <p role="alert" className="whitespace-pre-line mb-3 text-center text-sm text-destructive">{submitError}</p>}

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
              <SheetTitle>{isSubmitted ? 'Feedback gesendet' : 'Ungültiges Wort'}</SheetTitle>
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
            <DialogTitle>{isSubmitted ? 'Feedback gesendet' : 'Ungültiges Wort'}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function WorthaftGame({
  dailyDate,
  dailyWord,
  words: initialWords,
  antiWords: initialAntiWords,
  usedBundledFallback,
}: {
  dailyDate: string;
  dailyWord: string;
  words: string[];
  antiWords: string[];
  usedBundledFallback: boolean;
}) {
    const router = useRouter();
    const [settings, setSettings] = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { toast } = useToast();
    const [solution, setSolution] = useState(dailyWord);
    const [words] = useState<readonly string[]>(initialWords);
    const [antiWords] = useState<readonly string[]>(initialAntiWords);
    const [isWordListReady, setIsWordListReady] = useState(false);
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
    const rowTimerRef = useRef<WorthaftRowTimer | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Joker "Hot Tip" state
    const [showHotTipDialog, setShowHotTipDialog] = useState(false);
    const [hotTip, setHotTip] = useState<HotTip | null>(null);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [isHotTipPopupDisabled, setIsHotTipPopupDisabled] = useState(false);
    const getTodayString = () => dailyDate;

    // Format a duration in ms as M:SS (or M:SS for tens of minutes).
    const formatDuration = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const saveState = useCallback((newGuesses: { guess: string; statuses: LetterStatus[] }[], newStatus: 'won' | 'lost' | 'playing', newLetterStatuses: { [key: string]: LetterStatus }, newHotTip: HotTip | null, newRowTimes: number[]) => {
        const dailyState: DailyGameState = {
            date: dailyDate,
            guesses: newGuesses,
            status: newStatus,
            letterStatuses: newLetterStatuses,
            hotTip: newHotTip ?? undefined,
            rowTimes: newRowTimes,
        };
        worthaftStorage.setItem('worthaft-daily-game', JSON.stringify(dailyState));
    }, [dailyDate]);

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
        let completionTimeout: ReturnType<typeof setTimeout> | undefined;
        const initializeGame = () => {
            setIsWordListReady(true);

            const disabled = worthaftStorage.getItem('worthaft-hottip-disabled') === 'true';
            setIsHotTipPopupDisabled(disabled);

            const todayStr = getTodayString();
            const wordOfTheDay = dailyWord;
            setSolution(wordOfTheDay);

            const parsedStats = parseWorthaftStats(worthaftStorage.getItem('worthaft-stats'));
            if (parsedStats) setStats(parsedStats);

            const savedGame = worthaftStorage.getItem('worthaft-daily-game');
            let completedToday = false;
            if (savedGame) {
                try {
                    const dailyState = parseWorthaftDailyGame(savedGame);
                    // Invalid data is ignored, not erased. Valid statistics,
                    // settings, feedback decisions and unrelated keys survive.
                    if (dailyState && dailyState.date === todayStr) {
                        setGuesses(dailyState.guesses);
                        setGameState(dailyState.status);
                        setLetterStatuses(dailyState.letterStatuses || {});
                        const legacyTip = dailyState.jokerPosition;
                        setHotTip(dailyState.hotTip ?? (legacyTip ? {
                            letter: wordOfTheDay[legacyTip.letterIndex] ?? null,
                            attempt: legacyTip.guessIndex + 1,
                        } : dailyState.hotTipUsed ? { letter: null, attempt: null } : null));
                        setRowTimes(dailyState.rowTimes || []);

                        if (dailyState.status === 'won' || dailyState.status === 'lost') {
                            completedToday = true;
                            setIsCompletedToday(true);
                            completionTimeout = setTimeout(() => {
                                if (hasWorthaftFeedbackDecision(worthaftStorage, getTodayString())) {
                                    setIsDialogOpen(true);
                                } else {
                                    setIsFeedbackOpen(true);
                                }
                            }, 2000);
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse saved game state:', e);
                    // Keep the original value available for recovery.
                }
            }

            if (completedToday) {
                rowTimerRef.current = null;
                clearWorthaftRowStart(worthaftStorage);
            } else {
                const persistedElapsed = readWorthaftRowTimer(worthaftStorage, todayStr) ?? 0;
                rowTimerRef.current = createWorthaftRowTimer(Date.now(), persistedElapsed);
                writeWorthaftRowTimer(worthaftStorage, todayStr, persistedElapsed);
            }
        };

        initializeGame();
        return () => clearTimeout(completionTimeout);
    }, [dailyDate, dailyWord]);

    useEffect(() => {
        if (!isWordListReady || gameState !== 'playing') return;
        // Do not submit or edit yesterday's board while fresh server data loads.
        if (getWorthaftDateString() !== dailyDate) { router.refresh(); return; }

        const pauseTimer = () => {
            if (!rowTimerRef.current) return;
            const paused = pauseWorthaftRowTimer(rowTimerRef.current, Date.now());
            rowTimerRef.current = paused;
            writeWorthaftRowTimer(worthaftStorage, dailyDate, paused.elapsedMs);
        };
        const resumeTimer = () => {
            if (document.hidden || !rowTimerRef.current) return;
            rowTimerRef.current = resumeWorthaftRowTimer(rowTimerRef.current, Date.now());
        };
        const handleVisibilityChange = () => {
            if (document.hidden) pauseTimer();
            else resumeTimer();
        };

        handleVisibilityChange();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', pauseTimer);
        window.addEventListener('pageshow', resumeTimer);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', pauseTimer);
            window.removeEventListener('pageshow', resumeTimer);
            pauseTimer();
        };
    }, [dailyDate, gameState, isWordListReady]);

    useEffect(() => {
        if (!usedBundledFallback) return;
        toast({
            variant: 'destructive',
            title: 'Wortliste konnte nicht geladen werden',
            description: 'Worthaft verwendet vorübergehend die gespeicherten Listen.',
            duration: 5000,
        });
    }, [toast, usedBundledFallback]);

    useEffect(() => {
        let lastRefresh = 0;
        const checkDate = () => {
            if (getWorthaftDateString() === dailyDate) return;
            setTimeToNextGame('00:00:00');
            // Failed/offline refreshes can retry, without a rapid request loop.
            if (Date.now() - lastRefresh >= 30_000) {
                lastRefresh = Date.now();
                router.refresh();
            }
        };
        const boundary = window.setTimeout(checkDate, Math.max(0, getWorthaftMillisecondsUntilNextDay()) + 50);
        const retry = window.setInterval(checkDate, 30_000);
        const onVisible = () => { if (!document.hidden) checkDate(); };
        window.addEventListener('focus', checkDate);
        window.addEventListener('pageshow', checkDate);
        document.addEventListener('visibilitychange', onVisible);
        checkDate();
        return () => {
            window.clearTimeout(boundary);
            window.clearInterval(retry);
            window.removeEventListener('focus', checkDate);
            window.removeEventListener('pageshow', checkDate);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [dailyDate, router]);

     useEffect(() => {
        if (!isCompletedToday) return;
        const timer = setInterval(() => {
            const now = new Date();
            const diff = getWorthaftDateString(now) === dailyDate ? getWorthaftMillisecondsUntilNextDay(now) : 0;
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
    }, [isCompletedToday, dailyDate]);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        if (gameState !== 'playing' || hotTip || !settings.hotTipEnabled || isSettingsOpen || isDialogOpen || showHotTipDialog || isHotTipPopupDisabled) {
            return;
        }
        inactivityTimerRef.current = setTimeout(() => {
            setShowHotTipDialog(true);
        }, 180000); // 3 minutes
    }, [gameState, hotTip, settings.hotTipEnabled, isSettingsOpen, isDialogOpen, showHotTipDialog, isHotTipPopupDisabled]);

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


    const handleChar = (key: string) => {
        if (!isWordListReady || gameState !== 'playing') return;
        // Do not submit or edit yesterday's board while fresh server data loads.
        if (getWorthaftDateString() !== dailyDate) { router.refresh(); return; }
        const char = getWorthaftKeyboardLetter(key);
        if (char === null) return;
        const newGuess = [...currentGuess];
        newGuess[activeIndex] = char;
        setCurrentGuess(newGuess);

        // Fallback if initialization has not supplied a timer yet.
        if (currentGuess.every((c) => c === '') && rowTimerRef.current === null) {
            rowTimerRef.current = createWorthaftRowTimer(Date.now());
            writeWorthaftRowTimer(worthaftStorage, getTodayString(), 0);
        }

        setActiveIndex(Math.min(WORD_LENGTH - 1, activeIndex + 1));
    };

    const handleEnter = useCallback(() => {
        if (!isWordListReady || gameState !== 'playing') return;
        // Do not submit or edit yesterday's board while fresh server data loads.
        if (getWorthaftDateString() !== dailyDate) { router.refresh(); return; }

        const guessWord = currentGuess.join('');

        if (currentGuess.includes('')) {
            toast({ variant: 'destructive', title: 'Unvollständiges Wort', duration: 2000 });
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 600);
            return;
        }

        // Measure only active time spent on this guess row.
        const rowElapsed = rowTimerRef.current ? getWorthaftRowElapsed(rowTimerRef.current, Date.now()) : 0;
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
              const raw = worthaftStorage.getItem('worthaft-settings');
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
            worthaftStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            rowTimerRef.current = null;
            clearWorthaftRowStart(worthaftStorage);
            saveState(newGuesses, 'won', newLetterStatuses, hotTip, newRowTimes);
            setIsCompletedToday(true);
            setTimeout(() => {
                if (hasWorthaftFeedbackDecision(worthaftStorage, getTodayString())) {
                    setIsDialogOpen(true);
                } else {
                    setIsFeedbackOpen(true);
                }
            }, 2000);
            return;
        }


        const isKnownAntiWord = isWorthaftAntiWord(guessWord, antiWords);
        if (isKnownAntiWord || !words.includes(guessWord.toLowerCase())) {
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
            setRowTimes(newRowTimes);
            setGameState('lost');
            setCurrentGuess(Array(WORD_LENGTH).fill('')); // Clear current guess
            const newStats = {
                games: (stats.games || 0) + 1,
                wins: stats.wins || 0,
                streak: 0,
                maxStreak: stats.maxStreak || 0
            };
            setStats(newStats);
            worthaftStorage.setItem('worthaft-stats', JSON.stringify(newStats));
            rowTimerRef.current = null;
            clearWorthaftRowStart(worthaftStorage);
            saveState(newGuesses, 'lost', newLetterStatuses, hotTip, newRowTimes);
            setIsCompletedToday(true);
            setTimeout(() => {
                if (hasWorthaftFeedbackDecision(worthaftStorage, getTodayString())) {
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
            // Start the next row now. Visible thinking time counts; hidden
            // and closed-page time is excluded by the lifecycle effect below.
            rowTimerRef.current = createWorthaftRowTimer(Date.now());
            writeWorthaftRowTimer(worthaftStorage, getTodayString(), 0);
            saveState(newGuesses, 'playing', newLetterStatuses, hotTip, newRowTimes);
        }
    }, [currentGuess, dailyDate, gameState, guesses, letterStatuses, solution, stats, toast, saveState, hotTip, rowTimes, isWordListReady, antiWords, words, router]);

    const handleDelete = () => {
        if (gameState !== 'playing') return;
        const newGuess = [...currentGuess];
        const index = newGuess[activeIndex] ? activeIndex : Math.max(0, activeIndex - 1);
        newGuess[index] = '';
        setCurrentGuess(newGuess);
        setActiveIndex(index);
    };


    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const target = event.target;
        // Typing into another control must not edit or submit the game board.
        if (target instanceof HTMLElement && (target.closest('input, textarea, select') || target.isContentEditable)) return;
        if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
        if (!isWordListReady || !canInteractWithWorthaftGame(gameState) || isDialogOpen || isSettingsOpen || showHotTipDialog || isFeedbackOpen || invalidWord !== null) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            handleEnter();
        } else if (event.key === 'Backspace') {
            handleDelete();
        } else if (event.key === 'ArrowLeft') {
            setActiveIndex(Math.max(0, activeIndex - 1));
        } else if (event.key === 'ArrowRight') {
            setActiveIndex(Math.min(WORD_LENGTH - 1, activeIndex + 1));
        } else {
            handleChar(event.key);
        }
    }, [isWordListReady, gameState, isDialogOpen, isSettingsOpen, showHotTipDialog, isFeedbackOpen, invalidWord, handleEnter, handleDelete, handleChar, activeIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const resultGrid = guesses.map(({ statuses }, guessIndex) => {
        const squares = statuses.map(status => {
            if (status === 'correct') return settings.palette === 'classic' ? '🟩' : '🟦';
            if (status === 'present') return '🟨';
            return '⬛';
        }).join('');
        const time = rowTimes[guessIndex];
        return time === undefined ? squares : `${squares} (${formatDuration(time)})`;
    }).join('\n');
    const tipUsedLine = hotTip
        ? (hotTip.attempt ? `\n🔥 Heißer Tipp in Versuch ${hotTip.attempt} verwendet.` : '\n🔥 Heißer Tipp verwendet.')
        : '';
    const totalTime = rowTimes.reduce((sum, time) => sum + time, 0);
    const sharedResult = `Mein Ergebnis: ${gameState === 'won' ? guesses.length : 'X'} / ${MAX_GUESSES} innerhalb von ${formatDuration(totalTime)} Minuten${tipUsedLine}`;

    const shareResults = async () => {
        const text = `${sharedResult}

${resultGrid}

https://paulikreisch.de/worthaft`;

        const shareData = {
            title: 'Worthaft – Das Paulik & Reisch Spiel',
            text: text,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Teilen abgebrochen', error);
            }
        } else {
            navigator.clipboard.writeText(text).then(() => {
                toast({ title: 'Kopiert!', description: 'Ergebnis in die Zwischenablage kopiert.', duration: 2000 });
            });
        }
    };

    const shareSolution = async () => {
        const text = `Worthaft – Das Paulik & Reisch Spiel (LÖSUNG GELEAKT 🤫)

${sharedResult}

Lösung: ${solution.toUpperCase()}

${resultGrid}

Jetzt selber spielen:`;

        const shareData = {
            title: 'Worthaft – Das Paulik & Reisch Spiel (Lösung)',
            text,
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
    };

    const handleAcceptHotTip = () => {
        if (hotTip || !solution || gameState !== 'playing' || !settings.hotTipEnabled) return;

        const letters = [...new Set(solution)];
        const unknown = letters.filter(letter => !letterStatuses[letter] || letterStatuses[letter] === 'absent');
        const candidates = unknown.length ? unknown : letters;
        const letter = candidates[Math.floor(Math.random() * candidates.length)];
        const tip = { letter, attempt: guesses.length + 1 };
        setHotTip(tip);
        saveState(guesses, 'playing', letterStatuses, tip, rowTimes);
        setShowHotTipDialog(false);
        toast({
            title: 'Heißer Tipp!',
            description: `„${letter}“ kommt im Lösungswort vor.`,
            duration: 3000,
        });
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

    const boardWidth = Math.round(getWorthaftTileDimensions(settings.tileWidth, settings.tileHeight).width * 5 + 24);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground touch-manipulation">
             <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <main className="flex-1 py-2 md:py-3">
                <div className="w-full max-w-sm mx-auto px-4 sm:px-0 flex flex-col items-center justify-start">
                    <div className="w-full mx-auto" style={{ maxWidth: `${boardWidth}px` }}>
                        <Grid
                            guesses={guesses}
                            currentGuess={currentGuess}
                            isShaking={isShaking}
                            currentRowIndex={guesses.length}
                            activeIndex={activeIndex}
                            onCellClick={setActiveIndex}
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
                            hotTip={hotTip}
                            gameState={gameState}
                            settings={settings}
                            boardWidth={boardWidth}
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
            <WorthaftSettingsDialog
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
