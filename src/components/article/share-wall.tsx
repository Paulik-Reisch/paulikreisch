'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, Facebook, Linkedin, MoreHorizontal, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Article } from '@/lib/firestore';
import { Separator } from '../ui/separator';
import { createTrackedUrl } from '@/lib/utils';


const reasons = [
    { text: "IMMER kostenlos" },
    { text: "IMMER werbefrei" },
    { text: "IMMER öffentlich zugänglich" },
    { text: "IMMER (hoffentlich) lustig" },
    { text: "IMMER unabhängig geschrieben" },
    { text: "IMMER ohne Tracking-Exzesse" },
    { text: "IMMER mit Herzblut gemacht" },
    { text: "IMMER mit einer Prise Wahnsinn" },
    { text: "IMMER auf der Seite des Lesers" },
    { text: "IMMER gegen den Strom" },
    { text: "IMMER ein Grund zum Schmunzeln" },
    { text: "IMMER ehrlich (manchmal zu sehr)" },
];


export function ShareWall({ article, onUnlock }: { article: Article; onUnlock: () => void }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const url = createTrackedUrl(`https://paulik-reisch.de${pathname}`, 'share-wall', 'social-share', article.slug);
  const text = `Interessanter Artikel: "${article.title}" von Paulik & Reisch`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.teaser)}&source=Paulik%20%26%20Reisch`,
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onUnlock();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: article.title,
                text: text,
                url: url,
            });
            onUnlock();
        } catch (error) {
            console.error('Fehler beim nativen Teilen:', error);
            toast({
                variant: "destructive",
                title: "Teilen fehlgeschlagen",
                description: "Ihr Browser hat das Teilen verhindert.",
            });
        }
    } else {
        toast({
            title: "Nicht unterstützt",
            description: "Ihr Browser unterstützt die native Teilen-Funktion nicht.",
        });
    }
  };

  return (
    <div className="bg-muted py-8 px-6 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.03)]">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-headline text-2xl font-bold mt-4">Teilen und weiterlesen</h2>
        <p className="text-muted-foreground mt-2 mb-6">Teilen Sie diesen Artikel, um den Rest des Inhalts sofort freizuschalten.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={() => handleShare(shareLinks.twitter)} aria-label="Auf Twitter teilen">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleShare(shareLinks.facebook)} aria-label="Auf Facebook teilen">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleShare(shareLinks.linkedin)} aria-label="Auf LinkedIn teilen">
            <Linkedin className="h-5 w-5" />
          </Button>
          {typeof navigator !== 'undefined' && navigator.share && (
              <Button variant="outline" size="icon" onClick={handleNativeShare} aria-label="Mehr Teilen-Optionen">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
          )}
        </div>

         <div className="mt-8 text-center">
            <Separator />
             <div className="py-6 space-y-4">
                <h4 className="font-semibold text-sm">Warum eine Wall?</h4>
                <ul className="space-y-2 text-sm text-left text-muted-foreground max-w-xs mx-auto">
                    {reasons.map((reason, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                            <span>{reason.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Separator />
            <div className="mt-6 text-xs text-muted-foreground space-y-1">
                <p>Danke, dass Sie uns unterstützen!</p>
                 <p>
                    Einen Gastbeitrag verfassen oder uns einen Liebesbrief schreiben? E-Mail an uns:{' '}
                    <a href="mailto:philipp.l.paulik@gmail.com" className="underline">Philipp</a>{' & '}
                    <a href="mailto:maximilian.reisch@t-online.de" className="underline">Max</a>.
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                    Brieftauben-, wie auch Flaschenpost empfangen wir derzeit nicht.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
