'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, MoreHorizontal, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Article } from '@/lib/firestore';
import { Separator } from '../ui/separator';

const reasons = [
    { text: "IMMER kostenlos" },
    { text: "IMMER werbefrei" },
    { text: "IMMER öffentlich zugänglich" },
    { text: "IMMER (hoffentlich) lustig" },
    { text: "IMMER unabhängig geschrieben" },
    { text: "IMMER ohne Tracking-Exzesse" },
    { text: "IMMER mit Herzblut gemacht" },
];


export function ShareWall({ article, onUnlock }: { article: Article; onUnlock: () => void }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const url = `https://paulik-reisch.de${pathname}?utm_source=share_wall&utm_medium=social_share&utm_campaign=${article.slug}`;
  const text = `Spannender Artikel: "${article.title}" von Paulik & Reisch`;

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
    <div className="bg-background/80 backdrop-blur-sm py-8 px-6">
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
            <div className="py-6">
                <h4 className="font-semibold text-sm mb-4">Warum eine Wall?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    {reasons.map((reason, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{reason.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Separator />
            <div className="mt-6 text-xs text-muted-foreground space-y-1">
                <p>Danke, dass Sie uns unterstützen!</p>
                <p>
                    Schreiben Sie uns gerne eine E-Mail:{' '}
                    <a href="mailto:philipp.l.paulik@gmail.com" className="underline">Philipp</a>{' & '}
                    <a href="mailto:maximilian.reisch@t-online.de" className="underline">Max</a>.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
