
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { getArticles, type Article } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <Link href={`/a/${article.slug}`} className="block overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          width={800}
          height={450}
          className="aspect-video object-cover w-full transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.publishedDate}>
                  {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min Lesezeit</span>
              </div>
            </div>
          </div>
          <Link href={`/a/${article.slug}`}>
            <h3 className="text-2xl font-bold font-headline tracking-tight leading-snug group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="mt-3 text-muted-foreground line-clamp-3 text-balance">
            {article.teaser}
          </p>
        </div>
        <div className="mt-6">
          <Link href={`/a/${article.slug}`}>
            <Button variant="link" className="p-0 h-auto">
              Weiterlesen <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


export async function TopicLPs() {
  const articles = await getArticles();

  return (
    <section id="topic-lps" aria-labelledby="topic-lps-heading" className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-4">
            <h2 id="topic-lps-heading" className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Neueste Satire-Artikel</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Frisch aus der Feder der Zyniker. Unsere Beobachtungen zum aktuellen Weltgeschehen.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
      </div>
    </section>
  );
}
