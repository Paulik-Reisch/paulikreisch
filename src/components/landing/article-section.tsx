import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { type Article } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const mockArticles: Article[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `mock-${i}`,
    slug: `mock-article-${i + 1}`,
    title: `Der ${i + 1}. Kreis der Büro-Hölle`,
    category: i % 3 === 0 ? 'Gesellschaft' : i % 3 === 1 ? 'Technik' : 'Lebenshilfe',
    imageUrl: `https://picsum.photos/seed/article-carousel-${i}/800/450`,
    imageAlt: `Ein satirisches Bild zum ${i + 1}. Artikel`,
    teaser: 'Ein weiterer Tag, ein weiterer absurder Kampf gegen die Tücken des Alltags, von rebellischen Druckern bis zu philosophierenden Toastern.',
    content: '<p>Voller Inhalt...</p>',
    readTime: Math.floor(Math.random() * (7 - 3 + 1)) + 3,
    publishedDate: new Date().toISOString(),
    isFree: true,
}));


function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <Link href={`/artikel/${article.slug}`} className="block overflow-hidden">
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
          <Link href={`/artikel/${article.slug}`}>
            <h3 className="text-2xl font-bold font-headline tracking-tight leading-snug group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="mt-3 text-muted-foreground line-clamp-3 text-balance">
            {article.teaser}
          </p>
        </div>
        <div className="mt-6">
          <Link href={`/artikel/${article.slug}`}>
            <Button variant="link" className="p-0 h-auto">
              Weiterlesen <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


export async function ArticleSection() {
  return (
    <section id="articles" aria-labelledby="articles-heading" className="w-full py-20 md:py-24 lg:py-32 bg-background text-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-4">
            <h2 id="articles-heading" className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Neueste Satire-Artikel</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Frisch aus der Feder der Zyniker. Unsere Beobachtungen zum aktuellen Weltgeschehen.
            </p>
          </div>
        </div>
        
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent>
            {mockArticles.map((article) => (
              <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <ArticleCard article={article} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4 md:-left-12" />
          <CarouselNext className="hidden sm:flex -right-4 md:-right-12" />
        </Carousel>

      </div>
    </section>
  );
}
