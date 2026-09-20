'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, Facebook, Linkedin, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Article } from '@/lib/firestore';

export function SocialShare({ article }: { article: Article }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const url = `https://paulik-reisch.de${pathname}?utm_source=social_share_card&utm_medium=social&utm_campaign=${article.slug}`;
  const text = `Interessanter Artikel: "${article.title}" von Paulik & Reisch`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.teaser)}&source=Paulik%20%26%20Reisch`,
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: article.title,
                text: text,
                url: url,
            });
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
    <Card className="mt-16 not-prose">
      <CardHeader>
        <CardTitle className="text-center">Hat Ihnen der Artikel gefallen?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <p className="font-semibold text-muted-foreground mr-4">Teilen Sie ihn:</p>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="icon" aria-label="Auf Twitter teilen">
            <Twitter className="h-5 w-5" />
          </Button>
        </a>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="icon" aria-label="Auf Facebook teilen">
            <Facebook className="h-5 w-5" />
          </Button>
        </a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="icon" aria-label="Auf LinkedIn teilen">
            <Linkedin className="h-5 w-5" />
          </Button>
        </a>
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <Button variant="outline" size="icon" onClick={handleNativeShare} aria-label="Mehr Teilen-Optionen">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
