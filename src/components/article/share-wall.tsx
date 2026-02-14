'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Article } from '@/lib/firestore';

export function ShareWall({ article, onUnlock }: { article: Article; onUnlock: () => void }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const url = `https://paulik-reisch.de${pathname}`;
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

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link kopiert!',
      description: 'Der Link zum Artikel wurde in die Zwischenablage kopiert.',
    });
    onUnlock();
  };

  return (
    <Card className="max-w-xl mx-auto bg-background/80 backdrop-blur-sm border-primary shadow-lg">
      <CardHeader className="text-center">
        <Share2 className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="font-headline text-2xl">Teilen und weiterlesen</CardTitle>
        <CardDescription>Teilen Sie diesen Artikel, um den Rest des Inhalts sofort freizuschalten.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => handleShare(shareLinks.twitter)} aria-label="Auf Twitter teilen">
          <Twitter className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleShare(shareLinks.facebook)} aria-label="Auf Facebook teilen">
          <Facebook className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleShare(shareLinks.linkedin)} aria-label="Auf LinkedIn teilen">
          <Linkedin className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={copyLink} aria-label="Link kopieren">
          <LinkIcon className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
