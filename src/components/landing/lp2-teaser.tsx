
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { getArticles, type Article } from '@/lib/firestore';
import { StandardArticleCard } from '../article/article-cards';
import { getAuthors, type Author } from "@/lib/firestore";


export async function LP2Teaser() {
  const [articles, authors] = await Promise.all([getArticles(), getAuthors()]);
  const authorsMap = new Map(authors.map(author => [author.slug, author]));

  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="premium-teaser" aria-labelledby="premium-teaser-heading" className="w-full py-20 md:py-24 lg:py-32 bg-background text-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-4">
            <h2 id="premium-teaser-heading" className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Mehr Satire und Humor
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Für alle, die nach »Hallo Welt« nicht genug bekommen: Entdecken Sie unsere Wand der Absurditäten.
            </p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 6).map(article => (
                <StandardArticleCard key={article.id} article={article} author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null} />
            ))}
        </div>

        <div className="mt-12 text-center">
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

    