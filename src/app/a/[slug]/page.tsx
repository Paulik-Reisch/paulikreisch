
import { getArticleBySlug, getArticles, getSeoMetadata, type Article } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { type Metadata, type ResolvingMetadata } from 'next'
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { ArticleRenderer } from "@/components/article/article-renderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/session";

type Props = {
  params: { slug: string }
}

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
                <span>{article.readTime} min</span>
              </div>
            </div>
          </div>
          <Link href={`/a/${article.slug}`}>
            <h3 className="text-2xl font-bold font-headline tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
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
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const seoSlug = `a-${slug}`;
  const [article, seoData] = await Promise.all([
      getArticleBySlug(slug),
      getSeoMetadata(seoSlug)
  ]);
 
  if (!article) {
    return { title: "Artikel nicht gefunden" }
  }

  const previousImages = (await parent).openGraph?.images || []
  const title = seoData?.title || article.title;
  const description = seoData?.metaDescription || article.teaser;
  const authors = seoData?.authorName?.split(',').map(s => s.trim()) || ['Philipp Paulik', 'Maximilian Reisch'];

  const openGraphImages = seoData?.ogImage ? [
        {
            url: seoData.ogImage,
            alt: seoData.ogImageAlt || article.imageAlt,
        }
    ] : (article.imageUrl ? [
        {
            url: article.imageUrl,
            alt: article.imageAlt,
        }
    ] : []);
 
  return {
    title,
    description,
    keywords: seoData?.keywords?.split(',').map(k => k.trim()),
    authors: authors.map(author => ({ name: author })),
    alternates: {
        canonical: seoData?.canonicalUrl || `/a/${slug}`,
    },
    robots: seoData?.robots || 'index, follow',
    openGraph: {
      title: seoData?.ogTitle || title,
      description: seoData?.ogDescription || description,
      url: seoData?.canonicalUrl || `/a/${slug}`,
      siteName: seoData?.ogSiteName || 'Paulik & Reisch',
      images: [...openGraphImages, ...previousImages],
      locale: seoData?.language ? seoData.language.replace('-', '_') : 'de_DE',
      type: 'article',
      article: {
        publishedTime: seoData?.datePublished || new Date(article.publishedDate).toISOString(),
        modifiedTime: seoData?.dateModified,
        authors: authors,
        tags: article.category ? [article.category] : undefined,
      }
    },
    twitter: {
      card: seoData?.twitterCard as "summary" | "summary_large_image" | "app" | "player" | undefined || 'summary_large_image',
      title: seoData?.twitterTitle || title,
      description: seoData?.twitterDescription || description,
      site: seoData?.twitterSite,
      creator: seoData?.twitterCreator,
      images: seoData?.twitterImage ? [seoData.twitterImage] : (article.imageUrl ? [article.imageUrl] : undefined),
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const session = await getSession();

  const [article, seoData, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getSeoMetadata(`a-${slug}`),
    getArticles(), // This now only gets published articles
  ]);

  if (!article || (article.status !== 'published' && !session)) {
    notFound();
  }

  const relatedArticles = allArticles
    .filter(a => a.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': seoData?.articleType || 'SatiricalArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://paulik-reisch.de/a/${slug}`,
    },
    headline: seoData?.title || article.title,
    description: seoData?.metaDescription || article.teaser,
    image: seoData?.ogImage || article.imageUrl,
    author: {
      '@type': 'Person',
      name: seoData?.authorName || 'Paulik & Reisch',
    },
    publisher: {
      '@type': 'Organization',
      name: seoData?.publisher || 'Paulik & Reisch',
      logo: {
        '@type': 'ImageObject',
        url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522',
      },
    },
    datePublished: seoData?.datePublished || new Date(article.publishedDate).toISOString(),
    dateModified: seoData?.dateModified || new Date(article.publishedDate).toISOString(),
  };

  const author = {
    name: article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Unsere Autoren',
    subtitle: article.author === 'gastbeitrag' ? 'Von einem externen Autor' : 'Paulik & Reisch',
    avatarUrl: article.author === 'gastbeitrag' 
      ? 'https://picsum.photos/seed/guest-author/100/100' 
      : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522',
    avatarFallback: article.author === 'gastbeitrag' ? 'G' : 'PR',
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
       <ReadingProgressBar />
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6">
            <article className="prose prose-lg prose-serif dark:prose-invert mx-auto max-w-4xl">
                <header className="mb-12">
                    <Badge variant="secondary" className="mb-4">{article.category}</Badge>
                    <h1 className="text-4xl sm:text-5xl font-extrabold font-serifHeadline tracking-tight text-balance">{article.title}</h1>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={article.publishedDate}>
                                {format(new Date(article.publishedDate), "dd. MMMM yyyy", { locale: de })}
                            </time>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime} Minuten Lesezeit</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 not-prose">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={author.avatarUrl} alt={`Avatar für ${author.name}`} />
                            <AvatarFallback>{author.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-foreground">{author.name}</p>
                            <p className="text-sm text-muted-foreground">{author.subtitle}</p>
                        </div>
                    </div>

                    <div className="mt-8 text-lg text-muted-foreground text-balance prose" dangerouslySetInnerHTML={{ __html: article.teaser }} />
                </header>
                
                <figure className="not-prose my-12 -mx-4 md:mx-0">
                    <Image
                        src={article.imageUrl}
                        alt={article.imageAlt}
                        width={1200}
                        height={675}
                        className="rounded-lg shadow-lg aspect-video object-cover"
                        priority
                    />
                </figure>
                
                <ArticleRenderer article={article} />

            </article>

            {relatedArticles.length > 0 && (
              <section className="mt-24 border-t pt-16">
                  <h2 className="text-3xl font-bold font-headline text-center mb-12">
                      Das könnte Sie auch interessieren
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                      {relatedArticles.map((relatedArticle) => (
                          <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                      ))}
                  </div>
              </section>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

    