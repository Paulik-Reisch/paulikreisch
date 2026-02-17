'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Article } from '@/lib/firestore';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.165-.67-.165l-.25-1.05c-.2-.8-.4-.8-.6-.8-.2 0-.4 0-.6 0s-.5.2-.8.7c-.3.5-1 1-1 2.5s1 3 1.1 3.1c.1.1 2 3 5 4.2.7.3 1.2.4 1.6.5.7.2 1.3.1 1.8-.1.5-.2 1.5-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3zM12 2.05A10 10 0 0 0 2 12.05c0 3.2.8 5.4 2.1 6.8l-1.5 5.5 5.6-1.5c1.4.7 2.9 1.1 4.5 1.1A10 10 0 0 0 22 12.05 10 10 0 0 0 12 2.05z" fill="currentColor"/>
    </svg>
);

export function ShareWall({ article, onUnlock }: { article: Article; onUnlock: () => void }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const url = `https://paulik-reisch.de${pathname}?utm_source=share_wall&utm_medium=social_share&utm_campaign=${article.slug}`;
  const text = `Spannender Artikel: "${article.title}" von Paulik & Reisch`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.teaser)}&source=Paulik%20%26%20Reisch`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
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
    <div className="bg-background/80 backdrop-blur-sm py-12 px-6 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
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
          <Button variant="outline" size="icon" onClick={() => handleShare(shareLinks.whatsapp)} aria-label="Auf WhatsApp teilen">
            <WhatsAppIcon className="h-5 w-5" />
          </Button>
          {typeof navigator !== 'undefined' && navigator.share && (
              <Button variant="outline" size="icon" onClick={handleNativeShare} aria-label="Mehr Teilen-Optionen">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
          )}
        </div>
      </div>
    </div>
  );
}
