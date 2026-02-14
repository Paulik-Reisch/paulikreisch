import Link from 'next/link';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';

const mockArticles = Array.from({ length: 30 }).map((_, i) => ({
  id: `mock-article-${i + 1}`,
  title: `Die ${i + 1}. Stufe des Wahnsinns`,
  slug: `/a/artikel-${i + 1}`,
  imageUrl: `https://picsum.photos/seed/article${i+1}/500/${Math.floor(Math.random() * (600 - 400 + 1)) + 400}`,
  aiHint: 'satire humor article'
}));

export function LP2Teaser() {
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
        
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
          {mockArticles.map((article) => (
            <div key={article.id} className="break-inside-avoid">
              <Link href={article.slug}>
                <div className="group relative block w-full overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={500}
                    height={500} // Base height, will be overridden by actual image ratio
                    className="w-full h-auto"
                    data-ai-hint={article.aiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-white font-bold font-headline text-base drop-shadow-md">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
