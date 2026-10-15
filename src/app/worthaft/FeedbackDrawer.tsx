'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { initializeFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ThumbsUp, ThumbsDown, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { getWorthaftVoteDescription, type WorthaftVote } from '@/lib/worthaft-feedback';

type Vote = WorthaftVote | null;
type Step = 'ask' | 'details' | 'thanks';

const REASONS = [
  'ist kein (deutsches) Wort.',
  'ist zu schwer.',
  'ist zu leicht.',
  'ist ein Eigenname.',
  'ist veraltet.',
  'ist vulgär oder unangemessen.',
  'ist zu speziell / ein Fachbegriff.',
  'hat eine uneindeutige Schreibweise.',
  'steht im Plural.',
];

function getTodayString() {
  const today = new Date();
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, '0');
  const d = today.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function FeedbackDrawer({
  isOpen,
  onOpenChange,
  solution,
  onSubmitted,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  solution: string;
  onSubmitted?: () => void;
  onClose?: () => void;
}) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>('ask');
  const [vote, setVote] = useState<Vote>(null);
  const [reasons, setReasons] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('ask');
      setVote(null);
      setReasons(new Set());
      setIsSending(false);
    }
  }, [isOpen]);

  const handleVote = (v: Vote) => {
    setVote(v);
    setStep('details');
  };

  const toggleReason = (reason: string) => {
    setReasons((prev) => {
      const next = new Set(prev);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      return next;
    });
  };

  const canSubmit = vote === 'up' || (vote === 'down' && reasons.size > 0);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSending(true);
    const payload = {
      word: solution,
      vote,
      reasons: vote === 'down' ? Array.from(reasons) : [],
      date: getTodayString(),
      createdAt: serverTimestamp(),
    };
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'worthaft-feedback'), payload);
      localStorage.setItem(`worthaft-feedback-${payload.date}`, 'true');
    } catch (err) {
      // Still show the thanks screen even if the write fails — don't punish the user.
      console.error('Feedback could not be saved:', err);
      localStorage.setItem(`worthaft-feedback-${payload.date}`, 'true');
    } finally {
      setIsSending(false);
      setStep('thanks');
      onSubmitted?.();
    }
  };

  const content = (
    <>
      {step !== 'thanks' && (
        <div className="mb-2 flex items-center gap-2 pr-6">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Feedback
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'ask' && (
          <motion.div
            key="ask"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mb-6 rounded-md bg-muted p-4 text-center">
              <p className="mb-3 text-sm text-foreground/80">Wie war das heutige Wort?</p>
              <div className="flex items-center justify-center gap-1.5">
                {solution.split('').map((letter, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center border-2 border-primary bg-primary text-base font-bold uppercase text-primary-foreground sm:h-10 sm:w-10 sm:text-lg"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => handleVote('up')}
                aria-label="Ja, das Wort war gut"
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:border-primary group-hover:text-primary group-hover:shadow-md">
                  <ThumbsUp className="h-7 w-7" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">
                  Gut
                </span>
              </button>
              <button
                onClick={() => handleVote('down')}
                aria-label="Nein, das Wort war nicht gut"
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:border-destructive group-hover:text-destructive group-hover:shadow-md">
                  <ThumbsDown className="h-7 w-7" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-destructive">
                  Nicht gut
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mb-4 flex items-center gap-3 rounded-md bg-muted p-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  vote === 'up'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-destructive text-destructive-foreground'
                }`}
              >
                {vote === 'up' ? <ThumbsUp className="h-5 w-5" /> : <ThumbsDown className="h-5 w-5" />}
              </span>
              <p className="text-sm">
                Du findest <span className="font-bold uppercase tracking-wide">{solution}</span> {vote && getWorthaftVoteDescription(vote)}.
              </p>
              <button
                onClick={() => setStep('ask')}
                className="ml-auto text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Ändern
              </button>
            </div>

            {vote === 'down' && (
              <div className="mb-4">
                <h3 className="mb-0.5 text-base font-bold font-headline">Das Wort ...</h3>
                <p className="mb-3 text-xs text-muted-foreground">(Mehrfachauswahl möglich)</p>
                <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {REASONS.map((reason) => {
                    const selected = reasons.has(reason);
                    return (
                      <button
                        key={reason}
                        onClick={() => toggleReason(reason)}
                        aria-pressed={selected}
                        className={`flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition ${
                          selected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input bg-background text-foreground hover:border-primary/60'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                            selected ? 'border-primary-foreground bg-primary-foreground text-primary' : 'border-muted-foreground'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" />}
                        </span>
                        {reason}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSending}
              className="w-full rounded-full"
            >
              {isSending ? 'Wird gesendet ...' : 'Feedback senden'}
            </Button>
          </motion.div>
        )}

        {step === 'thanks' && (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center py-4 text-center"
          >
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-95 duration-300">
              <Check className="h-8 w-8" />
            </span>
            <h2 className="font-headline mb-1.5 text-xl font-extrabold">Danke für dein Feedback!</h2>
            <Button variant="outline" onClick={() => (onClose ? onClose() : onOpenChange(false))} className="rounded-full px-6">
              Schließen
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="p-0 pt-0 max-h-[90vh] overflow-y-auto rounded-t-lg">
          <div className="p-6">
            <SheetHeader className="text-left sr-only">
              <SheetTitle>Feedback</SheetTitle>
              <SheetDescription>Bewerte das heutige Wort</SheetDescription>
            </SheetHeader>
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-sm rounded-t-lg overflow-hidden">
        <div className="p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>Bewerte das heutige Wort</DialogDescription>
          </DialogHeader>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
