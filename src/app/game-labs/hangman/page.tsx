"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ArrowLeft, RotateCcw, Trophy, Heart, X } from 'lucide-react';

const HANGMAN_WORDS = [
  'HAUS', 'BAUM', 'SCHUH', 'TISCH', 'STUHL', 'FENSTER', 'TÜR', 'DACH',
  'WOLKE', 'SONNE', 'REGEN', 'SCHNEE', 'WIND', 'STERN', 'MOND', 'HIMMEL',
  'BERG', 'TAL', 'FLUSS', 'SEE', 'MEER', 'INSEL', 'STRAND', 'WELLE',
  'BLUME', 'GRAS', 'BLATT', 'WURZEL', 'AST', 'STAMM', 'SAMEN', 'FRUCHT',
  'VOGEL', 'FISCH', 'HUND', 'KATZE', 'PFERD', 'KUH', 'SCHAF', 'SCHWEIN',
  'AUTO', 'ZUG', 'BUS', 'SCHIFF', 'FLUG', 'RAD', 'STRASSE', 'BRÜCKE',
  'BROT', 'KAES', 'APFEL', 'BIRNE', 'TRAUBE', 'KIRSCH', 'PFIRSICH', 'MELONE',
  'BUCH', 'STIFT', 'PAPIER', 'SCHULE', 'LEHRER', 'SCHÜLER', 'KLASSE', 'PAUSE',
  'MUSIK', 'LIED', 'TON', 'RHYTHMUS', 'TANZ', 'BÜHNE', 'VORHANG', 'BEIFALL',
  'FREUND', 'FAMILIE', 'MUTTER', 'VATER', 'BRUDER', 'SCHWESTER', 'ONKEL', 'TANTE',
  'ARBEIT', 'BERUF', 'CHEFS', 'KOLLEGE', 'BÜRO', 'MEETING', 'PROJEKT', 'ZIEL',
  'ZEIT', 'UHR', 'MINUTE', 'STUNDE', 'TAG', 'WOCHE', 'MONAT', 'JAHR',
  'GELD', 'EURO', 'CENT', 'BANK', 'KONTO', 'SPAREN', 'AUSGEBEN', 'PREIS',
  'ESSEN', 'TRINKEN', 'KOCHEN', 'REZEPT', 'ZUTAT', 'GEWÜRZ', 'SALZ', 'PFEFFER',
  'SCHLAF', 'BETT', 'KISSEN', 'DECKE', 'TRÄUME', 'WACHEN', 'MÜDE', 'FRISCH',
  'SPORT', 'LAUFEN', 'SPRINGEN', 'WERFEN', 'FANGEN', 'TREFFEN', 'SIEGEN', 'VERLIEREN',
  'REISEN', 'KOFFER', 'TICKET', 'HOTEL', 'STRAND', 'MUSEUM', 'STADT', 'DORF',
  'WETTER', 'KALT', 'WARM', 'HEISS', 'KUEHL', 'NEBEL', 'REIF', 'TAU',
  'FARBE', 'ROT', 'BLAU', 'GRÜN', 'GELB', 'SCHWARZ', 'WEISS', 'BRAUN',
  'ZAHLEN', 'EINS', 'ZWEI', 'DREI', 'VIER', 'FÜNF', 'SECHS', 'SIEBEN',
  'BUCHSTABE', 'WORT', 'SATZ', 'TEXT', 'LESUNG', 'SCHREIBEN', 'DENKEN', 'VERSTEHEN'
];

const HANGMAN_STAGES = [
  // 0 wrong - empty gallows
  `  +---+
  |   |
      |
      |
      |
      |
=========`,
  // 1 wrong - head
  `  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  // 2 wrong - body
  `  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  // 3 wrong - left arm
  `  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
  // 4 wrong - right arm
  `  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  // 5 wrong - left leg
  `  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
  // 6 wrong - right leg (dead)
  `  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`,
];

const MAX_WRONG = 6;

export default function HangmanPage() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [stats, setStats] = useState({ games: 0, wins: 0, streak: 0, maxStreak: 0 });
  const [showStats, setShowStats] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);

  // Load stats from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hangman-stats');
      if (saved) setStats(JSON.parse(saved));
    } catch {}
  }, []);

  const saveStats = useCallback((newStats: typeof stats) => {
    setStats(newStats);
    try { localStorage.setItem('hangman-stats', JSON.stringify(newStats)); } catch {}
  }, []);

  // Pick a random word
  const pickWord = useCallback(() => {
    const randomWord = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    setWord(randomWord);
  }, []);

  // Initialize new game
  const newGame = useCallback(() => {
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameState('playing');
    setIsNewGame(false);
    pickWord();
  }, [pickWord]);

  // Start first game
  useEffect(() => {
    if (isNewGame) {
      newGame();
    }
  }, [isNewGame, newGame]);

  // Handle letter guess
  const handleGuess = useCallback((letter: string) => {
    if (gameState !== 'playing') return;
    if (guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }

    // Check win/lose
    const allGuessed = word.split('').every(l => newGuessed.has(l));
    if (allGuessed) {
      setGameState('won');
      setStats(prev => {
        const newStreak = prev.streak + 1;
        return {
          games: prev.games + 1,
          wins: prev.wins + 1,
          streak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
        };
      });
    } else if (wrongGuesses + 1 >= MAX_WRONG) {
      setGameState('lost');
      setStats(prev => ({
        ...prev,
        games: prev.games + 1,
        streak: 0,
      }));
    }
  }, [word, guessedLetters, gameState, wrongGuesses]);

  // Keyboard rows for German QWERTZ
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
    ['Y', 'X', 'C', 'V', 'B', 'N', 'M', 'Ü', 'ß'],
  ];

  const getKeyStatus = (letter: string) => {
    if (!guessedLetters.has(letter)) return 'default';
    return word.includes(letter) ? 'correct' : 'wrong';
  };

  const displayWord = word.split('').map(l => guessedLetters.has(l) ? l : '_').join(' ');

  const winRate = stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="font-headline font-bold text-4xl md:text-5xl mb-2">Hangman</h1>
          <p className="text-muted-foreground">Galgenmännchen — Alpha Version</p>
        </div>

        {/* Hangman Drawing */}
        <div className="mb-8 flex items-center justify-center">
          <pre className="font-mono text-lg whitespace-pre text-foreground/80 select-none animate-in fade-in duration-300">
            {HANGMAN_STAGES[wrongGuesses]}
          </pre>
        </div>

        {/* Word Display */}
        <div className="mb-8">
          <motion.div
            key={word}
            className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold letter-spacing-[0.3em] text-center"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0, y: 20 }}
          >
            {displayWord}
          </motion.div>
        </div>

        {/* Game Status */}
        <AnimatePresence mode="wait">
          {gameState === 'won' && (
            <motion.div
              key="won"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-8 text-center"
            >
              <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full">
                <Trophy className="h-6 w-6" />
                <span className="font-headline font-bold text-xl">Gewonnen! 🎉</span>
              </div>
              <p className="mt-2 text-muted-foreground">Das Wort war: <span className="font-bold text-foreground">{word}</span></p>
            </motion.div>
          )}
          {gameState === 'lost' && (
            <motion.div
              key="lost"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-8 text-center"
            >
              <div className="inline-flex items-center gap-3 bg-red-100 text-red-800 px-6 py-3 rounded-full">
                <X className="h-6 w-6" />
                <span className="font-headline font-bold text-xl">Verloren! 💀</span>
              </div>
              <p className="mt-2 text-muted-foreground">Das Wort war: <span className="font-bold text-foreground">{word}</span></p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard */}
        <div className="w-full max-w-md mb-8">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1.5 mb-1.5">
              {row.map(letter => {
                const status = getKeyStatus(letter);
                return (
                  <Button
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    disabled={gameState !== 'playing' || guessedLetters.has(letter)}
                    variant={status === 'correct' ? 'default' : status === 'wrong' ? 'destructive' : 'outline'}
                    size="sm"
                    className="h-10 w-10 min-w-0 font-bold transition-all"
                  >
                    {letter}
                  </Button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowStats(true)} className="gap-1">
            <Trophy className="h-4 w-4" />
            Statistiken
          </Button>
          <Button variant="outline" size="sm" onClick={newGame} className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Neues Spiel
          </Button>
        </div>

        {/* Win rate display */}
        <div className="text-center text-sm text-muted-foreground mb-8">
          {stats.games > 0 && (
            <>
              Gespielt: {stats.games} | Gewonnen: {stats.wins} ({winRate}%) | Serie: {stats.streak} | Best: {stats.maxStreak}
            </>
          )}
        </div>
      </main>
      <Footer />

      {/* Stats Dialog */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center">
            <DialogTitle className="font-headline">Deine Hangman Stats</DialogTitle>
            <DialogDescription>Gesamtübersicht aller Spiele</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold font-headline">{stats.games}</p>
              <p className="text-xs text-muted-foreground">Gespielt</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold font-headline text-green-600">{stats.wins}</p>
              <p className="text-xs text-muted-foreground">Gewonnen</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold font-headline">{winRate}%</p>
              <p className="text-xs text-muted-foreground">Quote</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold font-headline text-amber-600">{stats.maxStreak}</p>
              <p className="text-xs text-muted-foreground">Best-Serie</p>
            </div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              Aktuelle Serie: <span className="font-bold">{stats.streak}</span> 🔥
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}