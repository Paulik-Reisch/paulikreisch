import { getArticles, getAuthors } from '@/lib/firestore';
import { LP2MarqueeClient } from './lp2-marquee-client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function LP2Teaser() {
  const [articles, authors] = await Promise.all([getArticles(), getAuthors()]);
  const authorsMap = new Map(authors.map((author) => [author.slug, author]));

  if (articles.length === 0) return null;

  return (
    <section
      id="premium-teaser"
      aria-labelledby="premium-teaser-heading"
      className="w-full py-16 md:py-20 lg:py-24 bg-background text-foreground overflow-hidden border-t border-border/40"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10 md:mb-12">
          <div className="space-y-4">
            <h2
              id="premium-teaser-heading"
              className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[clamp(1.9rem,4vw,2.7rem)] font-bold leading-[1.08] tracking-[-0.015em] text-balance"
            >
              Mehr Satire und Humor
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Für alle, die nach »Hallo Welt« nicht genug bekommen: Entdecken Sie unsere Wand der Absurditäten.
            </p>
          </div>
        </div>
      </div>

      {/* Marquee Wand — horizontal, pause on hover */}
      <LP2MarqueeClient articles={articles.slice(0, 8)} authorsMap={authorsMap} />

      <div className="container px-4 md:px-6">
        <div className="mt-10 text-center">
          <Link href="/a">
            <Button size="lg">
              Mehr Artikel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
