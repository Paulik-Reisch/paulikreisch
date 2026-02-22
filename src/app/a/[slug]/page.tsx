import { getArticleBySlug, getArticles, getSeoMetadata, type Article, getAuthorBySlug, getAuthors, type Author } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { type Metadata, type ResolvingMetadata } from 'next'
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { ArticleRenderer } from "@/components/article/article-renderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/session";
import { WorthaftIcon } from "@/components/ui/icons/worthaft-icon";

type Props = {
  params: { slug: string }
}

function ArticleCard({ article, author }: { article: Article, author: Author | null }) {
    const authorDetails = {
        name: author ? `${author.firstName} ${author.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
        avatarUrl: author ? author.profilePictureUrl : (article.author === 'gastbeitrag' 
          ? 'https://picsum.photos/seed/guest-author/100/100' 
          : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
        avatarFallback: author ? `${author.firstName[0]}${author.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
        slug: author?.slug,
    };

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
          <Badge variant="secondary">{article.category}</Badge>
          <Link href={`/a/${article.slug}`} className="mt-2 block">
            <h3 className="text-xl font-bold font-serifHeadline tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          {authorDetails.slug ? (
            <Link href={`/autoren/${authorDetails.slug}`} className="flex items-center gap-2 group/author">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={authorDetails.avatarUrl} />
                    <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="font-semibold group-hover/author:text-primary transition-colors">{authorDetails.name}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 font-semibold">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={authorDetails.avatarUrl} />
                    <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                </Avatar>
                <span>{authorDetails.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={article.publishedDate}>
              {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
            </time>
          </div>
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

  const [article, seoData, allArticles, allAuthors] = await Promise.all([
    getArticleBySlug(slug),
    getSeoMetadata(`a-${slug}`),
    getArticles(), // This now only gets published articles
    getAuthors(),
  ]);

  if (!article || (article.status !== 'published' && !session)) {
    notFound();
  }

  const authorsMap = new Map(allAuthors.map(author => [author.slug, author]));
  const articleAuthor = article.authorSlug ? authorsMap.get(article.authorSlug) : null;

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
    name: articleAuthor ? `${articleAuthor.firstName} ${articleAuthor.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
    subtitle: articleAuthor ? 'Autor bei Paulik & Reisch' : (article.author === 'gastbeitrag' ? 'Von einem externen Autor' : 'Satire-Magazin'),
    avatarUrl: articleAuthor ? articleAuthor.profilePictureUrl : (article.author === 'gastbeitrag' ? 'https://picsum.photos/seed/guest-author/100/100' : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
    avatarFallback: articleAuthor ? `${articleAuthor.firstName[0]}${articleAuthor.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
    slug: article.authorSlug,
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
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Bilder sind möglicherweise KI-generiert</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 not-prose">
                        {author.slug ? (
                            <Link href={`/autoren/${author.slug}`} className="flex items-center gap-4 group">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={author.avatarUrl} alt={`Avatar für ${author.name}`} />
                                    <AvatarFallback>{author.avatarFallback}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{author.name}</p>
                                    <p className="text-sm text-muted-foreground">{author.subtitle}</p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={author.avatarUrl} alt={`Avatar für ${author.name}`} />
                                    <AvatarFallback>{author.avatarFallback}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground">{author.name}</p>
                                    <p className="text-sm text-muted-foreground">{author.subtitle}</p>
                                </div>
                            </div>
                        )}
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

            <section className="mt-24 rounded-lg bg-muted p-8 md:p-12 not-prose max-w-4xl mx-auto">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <WorthaftIcon className="mx-auto h-16 w-16 text-primary" />
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Testen Sie Ihren Wortschatz</h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        Haben Sie in der Lernvollzugsanstalt gut aufgepasst? Beweisen Sie es und erraten Sie das tägliche Wort mit fünf Buchstaben.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/worthaft">
                        <Button size="lg">Jetzt spielen</Button>
                        </Link>
                        <Link href="/worthaft/ueber">
                            <Button size="lg" variant="outline">Mehr zu Worthaft</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {relatedArticles.length > 0 && (
              <section className="mt-24 border-t pt-16">
                  <h2 className="text-3xl font-bold font-headline text-center mb-12">
                      Das könnte Sie auch interessieren
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                      {relatedArticles.map((relatedArticle) => {
                          const relatedAuthor = relatedArticle.authorSlug ? authorsMap.get(relatedArticle.authorSlug) : null;
                          return <ArticleCard key={relatedArticle.id} article={relatedArticle} author={relatedAuthor ?? null} />
                      })}
                  </div>
              </section>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
