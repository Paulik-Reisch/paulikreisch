'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Download, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletterAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FUNNEL, isSnoozed, setSnoozed } from '@/lib/funnel';
import { logEventAction } from '@/app/actions';
import { useUser } from '@/firebase/provider';
import { usePathname } from 'next/navigation';

const initialState = { success: undefined, error: undefined, message: undefined };

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} className="w-full font-bold">
      {pending ? '…' : 'Checkliste + Bonus sichern →'}
    </Button>
  );
}

export function ExitPopup() {
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);
  const { toast } = useToast();
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialState);
  const [consent, setConsent] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSnoozed(FUNNEL.storageKeys.exitPopupDismissed)) return;
    if (shownRef.current) return;
    // only on /a pages
    if (!pathname.startsWith('/a')) return;

    const show = () => {
      if (shownRef.current) return;
      if (isSnoozed(FUNNEL.storageKeys.exitPopupDismissed)) return;
      shownRef.current = true;
      setOpen(true);
      const uid = user?.uid ?? 'anon';
      logEventAction(FUNNEL.events.exitPopupView, uid, pathname, {});
    };

    // Desktop: exit intent (mouse leaves top)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    // Mobile: back/visibility + scroll up + time
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      // if user scrolls up quickly after 50% scroll, show
      if (cur < lastScrollY - 80 && cur > 300) show();
      lastScrollY = cur;
    };
    const timer = setTimeout(show, 45000); // fallback 45s

    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname, user]);

  useEffect(() => {
    if (state.success) {
      toast({ title: 'Geschafft! 🎉', description: 'Checkliste + Bonus-Kapitel sind unterwegs zu deiner Mail.' });
      const uid = user?.uid ?? 'anon';
      logEventAction(FUNNEL.events.exitPopupConvert, uid, pathname, {});
      setSnoozed(FUNNEL.storageKeys.exitPopupDismissed);
      window.open('/checkliste-lernvollzugsanstalt.pdf', '_blank');
      setOpen(false);
    }
    if (state.error) {
      toast({ variant: 'destructive', title: 'Fehler', description: state.error });
    }
  }, [state, toast, user, pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
        setSnoozed(FUNNEL.storageKeys.exitPopupDismissed);
        const uid = user?.uid ?? 'anon';
        logEventAction(FUNNEL.events.exitPopupDismiss, uid, pathname, {});
        setOpen(false);
      }} />
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4">
        <button
          onClick={() => {
            setSnoozed(FUNNEL.storageKeys.exitPopupDismissed);
            logEventAction(FUNNEL.events.exitPopupDismiss, user?.uid ?? 'anon', pathname, {});
            setOpen(false);
          }}
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-muted"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">Warte kurz!</p>
            <h3 className="font-headline font-bold text-lg leading-tight mt-1">Bevor du gehst: 10 Anzeichen Lernvollzugsanstalt</h3>
            <p className="text-sm text-muted-foreground mt-1">Hol dir die humorvolle Checkliste + 1 Gratis-Kapitel aus Hallo Welt. 1 Mail, sofort da.</p>
          </div>
        </div>

        <form ref={formRef} action={formAction} className="mt-5 space-y-3">
          <Input name="email" type="email" placeholder="deine@email.de" required className="h-11" />
          <input type="hidden" name="source" value="funnel-exit-popup" />
          <input type="hidden" name="consent" value={consent ? 'true' : ''} />
          <div className="flex items-start gap-2">
            <Checkbox id="exit-consent" checked={consent} onCheckedChange={(c) => setConsent(c as boolean)} />
            <Label htmlFor="exit-consent" className="text-xs leading-snug text-muted-foreground cursor-pointer">
              Ich habe die <Link href="/datenschutz" className="underline" target="_blank">Datenschutz</Link> gelesen.
            </Label>
          </div>
          <SubmitButton disabled={!consent} />
        </form>

        <div className="mt-4 flex items-center justify-between">
          <Link href="/checkliste" className="text-xs underline text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Erst ansehen <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => {
              setSnoozed(FUNNEL.storageKeys.exitPopupDismissed);
              logEventAction(FUNNEL.events.exitPopupDismiss, user?.uid ?? 'anon', pathname, {});
              setOpen(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Nein danke
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground/60 text-center mt-3">1× pro Woche, Abmeldung jederzeit. Wir merken uns deine Wahl 7 Tage.</p>
      </div>
    </div>
  );
}
