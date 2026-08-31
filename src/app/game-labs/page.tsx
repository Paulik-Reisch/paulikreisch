"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FlaskConical, Lock, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const games = [
  {
    id: 'worthaft',
    title: 'Worthaft',
    description: 'Das tägliche Worträtsel — errate das Wort in 6 Versuchen.',
    status: 'live' as const,
    href: '/worthaft',
    icon: '🎯',
  },
  {
    id: 'worthaft-classic',
    title: 'Worthaft Classic',
    description: 'Original-Version ohne Joker, Animationen & Settings.',
    status: 'alpha' as const,
    href: '/game-labs/worthaft-classic',
    icon: '📜',
  },
  {
    id: 'word-mixer',
    title: 'Word Mixer',
    description: 'Buchstaben mischen, Wörter finden — Zeitlimit inklusive.',
    status: 'planned' as const,
    href: '#',
    icon: '🔀',
  },
  {
    id: 'riddle-daily',
    title: 'Tägliches Rätsel',
    description: 'Ein neues Rätsel jeden Tag — lateral thinking gefragt.',
    status: 'planned' as const,
    href: '#',
    icon: '🧩',
  },
  {
    id: 'satire-quiz',
    title: 'Satire-Quiz',
    description: 'Echt oder Satire? Errate die Quelle der Schlagzeile.',
    status: 'idea' as const,
    href: '#',
    icon: '📰',
  },
  {
    id: 'emoji-decoder',
    title: 'Emoji Decoder',
    description: 'Emoji-Sequenzen zu Filmen, Büchern, Redewendungen.',
    status: 'idea' as const,
    href: '#',
    icon: '😎',
  },
];

type GameStatus = 'live' | 'alpha' | 'planned' | 'idea';

const statusConfig: Record<GameStatus, { label: string; color: string; bg: string }> = {
  live: { label: 'Live', color: 'text-green-700', bg: 'bg-green-100' },
  alpha: { label: 'Alpha', color: 'text-amber-700', bg: 'bg-amber-100' },
  planned: { label: 'Geplant', color: 'text-blue-700', bg: 'bg-blue-100' },
  idea: { label: 'Idee', color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function GameLabsPage() {
  const [view, setView] = useState<'grid' | 'detail'>('grid');
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);

  const handleGameClick = (game: typeof games[0]) => {
    if (game.status === 'live' || game.status === 'alpha') {
      setSelectedGame(game);
      setView('detail');
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-muted/50 border">
            <FlaskConical className="h-5 w-5 text-primary" />
            <span className="font-mono text-sm font-medium text-primary">ALPHA — Game Labs</span>
          </div>
          <h1 className="font-headline font-bold text-4xl md:text-5xl mb-4">
            Game Labs
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experimentelle Mini-Games, Rätsel & Prototypen von Paulik & Reisch.
            <br />
            <span className="font-medium">Nicht in der Navigation verlinkt — Alpha-Stage.</span>
          </p>
        </header>

        {/* Back button when in detail view */}
        {view === 'detail' && selectedGame && (
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-1"
            onClick={() => setView('grid')}
          >
            <ChevronLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Button>
        )}

        {/* Grid View */}
        {view === 'grid' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => {
              const config = statusConfig[game.status];
              const isPlayable = game.status === 'live' || game.status === 'alpha';
              
              return (
                <Card
                  key={game.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
                    !isPlayable && 'opacity-60 cursor-not-allowed'
                  )}
                  onClick={() => handleGameClick(game)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl">{game.icon}</span>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.color)}>
                        {config.label}
                      </span>
                    </div>
                    <CardTitle className="font-headline text-xl">{game.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                    <div className="flex items-center justify-between">
                      {isPlayable ? (
                        <Button size="sm" className="gap-1" asChild>
                          <Link href={game.href}>
                            Spielen
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled className="gap-1">
                          <Lock className="h-3 w-3" />
                          {game.status === 'planned' ? 'In Planung' : 'Idee'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detail View - Game Info/Launch */}
        {view === 'detail' && selectedGame && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <span className="text-5xl">{selectedGame.icon}</span>
                </div>
                <CardTitle className="font-headline text-3xl">{selectedGame.title}</CardTitle>
                <div className="inline-flex items-center gap-1 mt-2">
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusConfig[selectedGame.status].bg, statusConfig[selectedGame.status].color)}>
                    {statusConfig[selectedGame.status].label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground text-center">{selectedGame.description}</p>
                
                {selectedGame.status === 'alpha' && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>⚠️ Alpha-Version:</strong> Dieses Game befindet sich in aktiver Entwicklung.
                      Features können fehlen, Bugs auftreten oder sich Breaking Changes ergeben.
                      Feedback willkommen!
                    </p>
                  </div>
                )}

                <div className="flex gap-4 justify-center pt-4">
                  {selectedGame.status === 'live' || selectedGame.status === 'alpha' ? (
                        <Button size="lg" className="gap-2 w-full sm:w-auto" asChild>
                          <Link href={selectedGame.href}>
                            <FlaskConical className="h-5 w-5" />
                            Game starten
                          </Link>
                        </Button>
                      ) : null}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => setView('grid')}
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Zurück
                  </Button>
                </div>

                <hr className="my-6" />
                
                <section>
                  <h3 className="font-semibold mb-3">Über Game Labs</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">1</span>
                      Alle Games hier sind <strong>Experimente</strong> — kein Qualitätsversprechen.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">2</span>
                      <strong>Keine Nav-Integration</strong> — nur über Direkt-Link erreichbar.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">3</span>
                      <strong>Daten & Fortschritt</strong> können bei Updates verloren gehen.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">4</span>
                      <strong>Feedback?</strong> Einfach Bescheid sagen — wir bauen, was Spaß macht.
                    </li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Hint */}
        {view === 'grid' && (
          <div className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
            <p>Game Labs ist nicht in der Haupt-Navigation verlinkt.</p>
            <p className="mt-1">Lesezeichen setzen: <code className="bg-muted px-2 py-0.5 rounded font-mono">/game-labs</code></p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}