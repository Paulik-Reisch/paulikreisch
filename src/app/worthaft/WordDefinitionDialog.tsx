'use client';

import { useEffect, useState } from 'react';
import { BookOpen, HelpCircle, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export default function WordDefinitionDialog({ word }: { word: string }) {
  const [open, setOpen] = useState(false);
  const [definition, setDefinition] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    setDefinition(null);
    setError(null);
  }, [word]);

  useEffect(() => {
    if (!open || definition) return;
    const controller = new AbortController();
    setError(null);

    async function loadDefinition() {
      try {
        const response = await fetch('/api/worthaft/definition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word }),
          signal: controller.signal,
        });
        const data: unknown = await response.json();
        if (!response.ok || !data || typeof data !== 'object' || !('definition' in data)
          || typeof data.definition !== 'string' || !data.definition.trim()) {
          throw new Error('Definition unavailable');
        }
        if (!controller.signal.aborted) setDefinition(data.definition.trim());
      } catch {
        if (!controller.signal.aborted) {
          setError('Die Erklärung ist gerade nicht verfügbar. Versuche es gleich noch einmal.');
        }
      }
    }

    void loadDefinition();
    return () => controller.abort();
  }, [open, word, attempt, definition]);

  const Root = isMobile ? Sheet : Dialog;
  const Trigger = isMobile ? SheetTrigger : DialogTrigger;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Description = isMobile ? SheetDescription : DialogDescription;
  const content = (
    <>
      <Header className="text-left space-y-3">
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <Title className="font-headline text-2xl">Was bedeutet {word}?</Title>
          <Description className="mt-1">Dein Wort des Tages, kurz erklärt.</Description>
        </div>
      </Header>
      <div className="mt-5 rounded-2xl border bg-muted/40 p-4 sm:p-5" aria-live="polite" aria-busy={!definition && !error}>
        {definition ? (
          <p className="whitespace-pre-line break-words text-base leading-relaxed">{definition}</p>
        ) : error ? (
          <div className="space-y-4">
            <p role="alert" className="text-sm leading-relaxed text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => setAttempt(value => value + 1)} className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Erneut versuchen
            </Button>
          </div>
        ) : (
          <div role="status" className="flex items-center gap-3 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 shrink-0 animate-spin motion-reduce:animate-none text-primary" aria-hidden="true" />
            Die Worterklärung wird geladen …
          </div>
        )}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Mit KI erklärt · Die Erklärung kann Fehler enthalten.</p>
      <Button variant="secondary" className="mt-5 w-full" onClick={() => setOpen(false)}>Zurück zum Ergebnis</Button>
    </>
  );

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="outline" size="lg" className="min-w-0 flex-1 gap-1.5 whitespace-nowrap px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm">
          <HelpCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Was ist das?</span>
        </Button>
      </Trigger>
      {isMobile ? (
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-3xl px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {content}
        </SheetContent>
      ) : (
        <DialogContent className="max-h-[85dvh] max-w-md overflow-y-auto rounded-2xl p-6">
          {content}
        </DialogContent>
      )}
    </Root>
  );
}
