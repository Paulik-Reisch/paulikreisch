'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletterAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Check, BookOpen, Gift, ShieldCheck, Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { logEventAction } from '@/app/actions';
import { useUser } from '@/firebase/provider';
import { usePathname } from 'next/navigation';
import { FUNNEL, setUnlocked } from '@/lib/funnel';

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} className="w-full text-base font-bold py-6">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Artikel + Gratis-Kapitel freischalten →'}
    </Button>
  );
}

export function LeadWall({ onUnlock }: { onUnlock: () => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    // track wall view once
    if (user) logEventAction(FUNNEL.events.wallView, user.uid, pathname, { wall: 'leadwall-v2' });
    else logEventAction(FUNNEL.events.wallView, 'anon', pathname, { wall: 'leadwall-v2' });
  }, []);

  useEffect(() => {
    if (state.success) {
      toast({ title: 'Freigeschaltet! 🎉', description: 'Check deine Mails — das Gratis-Kapitel ist unterwegs.' });
      if (user) logEventAction(FUNNEL.events.wallConvert, user.uid, pathname, { wall: 'leadwall-v2' });
      setUnlocked();
      // download checklist automatically as bonus
      window.open('/checkliste-lernvollzugsanstalt.pdf', '_blank');
      onUnlock();
    }
    if (state.error) {
      toast({ variant: 'destructive', title: 'Fehler', description: state.error });
    }
  }, [state, toast, onUnlock, user, pathname]);

  const handleDismiss = () => {
    if (user) logEventAction(FUNNEL.events.wallDismiss, user.uid, pathname, { wall: 'leadwall-v2' });
    // soft snooze 7 days
    try { localStorage.setItem(FUNNEL.storageKeys.wallDismissed, String(Date.now())); } catch {}
    onUnlock();
  };

  return (
    <div className="bg-gradient-to-b from-muted to-background border border-border rounded-2xl shadow-xl py-8 px-6 md:px-10 mt-8 relative overflow-hidden">
      {/* subtle glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-2xl mx-auto text-center relative">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="h-7 w-7 text-primary" />
        </div>
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Premium-Inhalt</p>
        <h2 className="font-headline text-2xl md:text-3xl font-extrabold leading-tight text-balance">
          Der beste Teil kommt jetzt —<br />
          <span className="text-primary">der Dialog aus Hallo Welt, S. 42</span>
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          Hol dir den Rest des Artikels + <strong className="text-foreground">1 Gratis-Kapitel als PDF</strong>. Bereits <strong className="text-foreground">3.412 Leser</strong> haben freigeschaltet.
        </p>

        {/* Preview teaser */}
        <div className="mt-6 text-left bg-background border rounded-xl p-4 relative overflow-hidden">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Vorschau</p>
          <p className="text-sm text-muted-foreground blur-[3px] select-none leading-relaxed">
            »Und dann sagte Pfeffer mit diesem Blick, der selbst den Hausmeister erstarren ließ: ‚Wer hier nicht spurt, schreibt die Klausur eben im Stehen…‘«
          </p>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="mt-6">
          <form ref={formRef} action={formAction} className="space-y-3 text-left">
            <Input name="email" type="email" placeholder="deine@email.de" required className="h-12 text-base" />
            <input type="hidden" name="source" value="funnel-leadwall-v2" />
            <input type="hidden" name="consent" value={isConsentGiven ? 'true' : ''} />
            <div className="flex items-start gap-2 py-1">
              <Checkbox id="funnel-consent" checked={isConsentGiven} onCheckedChange={(c) => setIsConsentGiven(c as boolean)} />
              <Label htmlFor="funnel-consent" className="text-xs leading-snug text-muted-foreground cursor-pointer">
                Ich habe die <Link href="/datenschutz" className="underline hover:text-foreground" target="_blank">Datenschutzerklärung</Link> gelesen und stimme zu. Abmeldung jederzeit möglich.
              </Label>
            </div>
            <SubmitButton disabled={!isConsentGiven} />
          </form>
          <button onClick={handleDismiss} className="mt-3 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
            Weiter ohne Bonus →
          </button>
          <p className="text-[11px] text-muted-foreground/70 mt-2">Kein Spam. 1× pro Woche Satire. Kein Tracking-Wahnsinn.</p>
        </div>

        {/* 3 bullets */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="flex gap-2 items-start bg-muted/50 rounded-lg p-3">
            <Gift className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Gratis-Kapitel</p>
              <p className="text-xs text-muted-foreground">PDF sofort per Mail + Download</p>
            </div>
          </div>
          <div className="flex gap-2 items-start bg-muted/50 rounded-lg p-3">
            <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Weiterlesen</p>
              <p className="text-xs text-muted-foreground">Voller Artikel + Bonus-Exzerpt</p>
            </div>
          </div>
          <div className="flex gap-2 items-start bg-muted/50 rounded-lg p-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Werbefrei</p>
              <p className="text-xs text-muted-foreground">Unabhängig, ohne Paywall-Stress</p>
            </div>
          </div>
        </div>

        {/* Book mini upsell */}
        <div className="mt-8 flex items-center gap-4 text-left bg-background border rounded-xl p-4">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484"
            alt="Hallo Welt Cover"
            className="w-16 h-20 object-cover rounded-md shadow-sm shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Buch Tipp</p>
            <p className="font-bold leading-tight">Hallo Welt — 106 Seiten Abrechnung</p>
            <p className="text-xs text-muted-foreground">4.8★ bei echten Lesern · 10,99 €</p>
          </div>
          <Link
            href="/shop"
            onClick={() => {
              if (user) logEventAction(FUNNEL.events.bookClick, user.uid, pathname, { from: 'leadwall' });
            }}
            className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          >
            Zum Shop <Sparkles className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-[11px] text-muted-foreground/60 mt-4">Schon freigeschaltet? Einfach neu laden — wir merken es uns 7 Tage.</p>
      </div>
    </div>
  );
}
