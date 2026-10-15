'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, MessageCircle, Link2, Check, Gift, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Article } from '@/lib/firestore';
import { createTrackedUrl } from '@/lib/utils';
import { logEventAction } from '@/app/actions';
import { useUser } from '@/firebase/provider';
import { FUNNEL, setUnlocked } from '@/lib/funnel';
import Link from 'next/link';

export function ShareWall({ article, onUnlock }: { article: Article; onUnlock: () => void }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const { user } = useUser();
  const url = createTrackedUrl(`https://paulikreisch.de${pathname}`, 'share-wall-v2', 'social-share', article.slug);
  const text = `Satire-Alarm: "${article.title}" von Paulik & Reisch — der Dialog auf S.42 ist der Wahnsinn`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  };

  const track = (channel: string) => {
    const uid = user?.uid ?? 'anon';
    logEventAction(FUNNEL.events.wallConvert, uid, pathname, { wall: 'sharewall-v2', channel });
    setUnlocked();
  };

  const handleShare = (shareUrl: string, channel: string) => {
    track(channel);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onUnlock();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link kopiert!', description: 'Füg ihn ein wo du willst — Artikel ist frei.' });
      track('copy');
      setUnlocked();
      onUnlock();
    } catch {
      toast({ variant: 'destructive', title: 'Kopieren fehlgeschlagen', description: url });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text, url });
        track('native');
        setUnlocked();
        onUnlock();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDismiss = () => {
    const uid = user?.uid ?? 'anon';
    logEventAction(FUNNEL.events.wallDismiss, uid, pathname, { wall: 'sharewall-v2' });
    try { localStorage.setItem(FUNNEL.storageKeys.wallDismissed, String(Date.now())); } catch {}
    onUnlock();
  };

  return (
    <div className="bg-gradient-to-b from-muted to-background border border-border rounded-2xl shadow-xl py-8 px-6 md:px-10 mt-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-2xl mx-auto text-center relative">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Teilen &amp; Weiterlesen</p>
        <h2 className="font-headline text-2xl md:text-3xl font-extrabold">Unterstütze uns mit 1 Klick</h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Teile den Artikel — du schaltest den Rest + <strong className="text-foreground">Gratis-Kapitel PDF</strong> frei. So wächst Satire ohne Paywall.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => handleShare(shareLinks.whatsapp, 'whatsapp')} className="rounded-full gap-2">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="outline" onClick={() => handleShare(shareLinks.twitter, 'twitter')} className="rounded-full gap-2">
            <Twitter className="h-4 w-4" /> X / Twitter
          </Button>
          <Button variant="outline" onClick={() => handleShare(shareLinks.facebook, 'facebook')} className="rounded-full gap-2">
            <Facebook className="h-4 w-4" /> Facebook
          </Button>
          <Button variant="outline" onClick={handleCopy} className="rounded-full gap-2">
            <Link2 className="h-4 w-4" /> Link kopieren
          </Button>
          {typeof navigator !== 'undefined' && (navigator as any).share && (
            <Button variant="ghost" onClick={handleNativeShare} className="rounded-full">
              Mehr…
            </Button>
          )}
        </div>

        <button onClick={handleDismiss} className="mt-4 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
          Weiter ohne Teilen →
        </button>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="flex gap-2 items-start bg-muted/50 rounded-lg p-3">
            <Gift className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div><p className="text-sm font-semibold">Gratis-Kapitel</p><p className="text-xs text-muted-foreground">PDF sofort</p></div>
          </div>
          <div className="flex gap-2 items-start bg-muted/50 rounded-lg p-3">
            <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div><p className="text-sm font-semibold">Voller Artikel</p><p className="text-xs text-muted-foreground">Kein Cut mehr</p></div>
          </div>
          <div className="flex gap-2 items-start bg-muted/50 rounded-lg p-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div><p className="text-sm font-semibold">Danke!</p><p className="text-xs text-muted-foreground">Du hilfst unabhängiger Satire</p></div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 text-left bg-background border rounded-xl p-4">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&amp;token=42ce90a3-ed34-49d2-8e09-5258d0dfc484"
            alt="Hallo Welt Cover"
            className="w-16 h-20 object-cover rounded-md shadow-sm shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Buch Tipp</p>
            <p className="font-bold leading-tight">Hallo Welt — 106 Seiten</p>
            <p className="text-xs text-muted-foreground">4.8★ · 10,99 € auf Amazon</p>
          </div>
          <Link href="/shop" className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            Zum Shop <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
