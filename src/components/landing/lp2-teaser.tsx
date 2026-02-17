import Link from 'next/link';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getArticles, type Article } from '@/lib/firestore';

function PinterestArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group break-inside-avoid">
      <Link href={`/a/${article.slug}`} className="block overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          width={500}
          height={500}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Badge variant="secondary" className="mb-2">{article.category}</Badge>
          <Link href={`/a/${article.slug}`}>
            <h3 className="text-lg font-bold font-serifHeadline leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 text-balance">
            {article.teaser}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
           <Link href={`/a/${article.slug}`}>
            <Button variant="link" className="p-0 h-auto text-xs">
              Weiterlesen <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{article.readTime} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export async function LP2Teaser() {
  const articles = await getArticles();

  return (
    <section id="premium-teaser" aria-labelledby="premium-teaser-heading" className="w-full py-20 md:py-24 lg:py-32 bg-background text-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-4">
            <h2 id="premium-teaser-heading" className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Mehr Satire und Humor
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Für alle, die nach »Hallo Welt« nicht genug bekommen: Entdecken Sie unsere Wand der Absurditäten. Top-aktuelle, humorvolle Artikel über alles, was die Welt gerade bewegt.
            </p>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
            {articles.map((article) => (
              <PinterestArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
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
