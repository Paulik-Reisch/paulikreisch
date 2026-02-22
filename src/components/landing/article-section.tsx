
import Link from "next/link";
import { getArticles, type Article } from "@/lib/firestore";
import { StandardArticleCard } from "../article/article-cards";
import { getAuthors, type Author } from "@/lib/firestore";


export async function ArticleSection() {
  const [articles, authors] = await Promise.all([getArticles(), getAuthors()]);
  const authorsMap = new Map(authors.map(author => [author.slug, author]));
  
  if (articles.length === 0) {
    return null;
  }
  
  return (
    <section id="articles" aria-labelledby="articles-heading" className="w-full py-20 md:py-24 lg:py-32 bg-muted/40 text-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-4">
            <h2 id="articles-heading" className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Aus dem Magazin</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Frisch aus der Feder der Zyniker. Unsere Beobachtungen zum aktuellen Weltgeschehen.
            </p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 3).map(article => (
                <StandardArticleCard key={article.id} article={article} author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null} />
            ))}
        </div>

      </div>
    </section>
  );
}

    