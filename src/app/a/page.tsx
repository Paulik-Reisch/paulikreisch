import { getArticles, getSeoMetadata, type Article, getAuthors, type Author } from "@/lib/firestore";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Metadata, ResolvingMetadata } from 'next';

function FeaturedArticleCard({ article, author }: { article: Article, author: Author | null }) {
  const authorDetails = {
    name: author ? `${author.firstName} ${author.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
    avatarUrl: author ? author.profilePictureUrl : (article.author === 'gastbeitrag' 
      ? 'https://picsum.photos/seed/guest-author/100/100' 
      : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
    avatarFallback: author ? `${author.firstName[0]}${author.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
    slug: author?.slug
  }

  return (
    <Link href={`/a/${article.slug}`} className="block group">
      <Card className="relative min-h-[450px] text-white overflow-hidden flex flex-col justify-end">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 -z-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-0" />
        <CardContent className="relative z-10 p-8">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-transparent">{article.category}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold font-serifHeadline tracking-tight leading-snug line-clamp-3">
            {article.title}
          </h2>
          <div className="mt-6 flex items-center gap-4 text-sm text-white/80">
            {authorDetails.slug ? (
                <Link href={`/autoren/${authorDetails.slug}`} className="flex items-center gap-2 group/author" onClick={(e) => e.stopPropagation()}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={authorDetails.avatarUrl} />
                        <AvatarFallback>{authorDetails.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold group-hover/author:underline">{authorDetails.name}</span>
                </Link>
            ) : (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={authorDetails.avatarUrl} />
                        <AvatarFallback>{authorDetails.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{authorDetails.name}</span>
                </div>
            )}
            <span className="opacity-50">|</span>
             <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.publishedDate}>
                  {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
                </time>
              </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function StandardArticleCard({ article, author }: { article: Article, author: Author | null }) {
    const authorDetails = {
        name: author ? `${author.firstName} ${author.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
        avatarUrl: author ? author.profilePictureUrl : (article.author === 'gastbeitrag' 
          ? 'https://picsum.photos/seed/guest-author/100/100' 
          : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
        avatarFallback: author ? `${author.firstName[0]}${author.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
        slug: author?.slug
    }
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
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={authorDetails.avatarUrl} />
                    <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{authorDetails.name}</span>
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

function ListArticleCard({ article, author }: { article: Article, author: Author | null }) {
  const authorDetails = {
      name: author ? `${author.firstName} ${author.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
      avatarUrl: author ? author.profilePictureUrl : (article.author === 'gastbeitrag' 
        ? 'https://picsum.photos/seed/guest-author/100/100' 
        : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
      avatarFallback: author ? `${author.firstName[0]}${author.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
      slug: author?.slug
  }
  return (
    <Link href={`/a/${article.slug}`} className="block">
      <Card className="p-4 hover:bg-muted transition-colors group">
        <div className="flex items-start gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
                {authorDetails.slug ? (
                    <Link href={`/autoren/${authorDetails.slug}`} className="flex items-center gap-2 group/author" onClick={(e) => e.stopPropagation()}>
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={authorDetails.avatarUrl} />
                            <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold group-hover/author:text-primary transition-colors">{authorDetails.name}</span>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={authorDetails.avatarUrl} />
                            <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold">{authorDetails.name}</span>
                    </div>
                )}
            </div>
            <h3 className="text-lg font-bold font-serifHeadline leading-snug line-clamp-2">
              {article.title}
            </h3>
             <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <Badge variant="outline">{article.category}</Badge>
                <time dateTime={article.publishedDate}>
                  {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
                </time>
             </div>
          </div>
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            width={100}
            height={100}
            className="rounded-md object-cover aspect-square"
          />
        </div>
      </Card>
    </Link>
  );
}

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoSlug = 'artikel'; // A unique slug for the articles overview page
  const seoData = await getSeoMetadata(seoSlug);
 
  const title = seoData?.title || "Satirische Artikel | Paulik & Reisch Magazin";
  const description = seoData?.metaDescription || "Eine kuratierte Sammlung satirischer Meisterwerke, die den alltäglichen Wahnsinn auf die Schippe nehmen. Von Gesellschaftskritik bis Technik-Alpträume.";
  const previousImages = (await parent).openGraph?.images || []

  return {
    title,
    description,
    keywords: seoData?.keywords?.split(',').map(k => k.trim()) || ['Satire', 'Artikel', 'Humor', 'Gesellschaftskritik', 'Magazin', 'Kolumne'],
    openGraph: {
      title: seoData?.ogTitle || title,
      description: seoData?.ogDescription || description,
      url: seoData?.canonicalUrl || '/a',
      siteName: seoData?.ogSiteName || 'Paulik & Reisch',
      images: seoData?.ogImage ? [seoData.ogImage, ...previousImages] : previousImages,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitterTitle || title,
      description: seoData?.twitterDescription || description,
      images: seoData?.twitterImage ? [seoData.twitterImage, ...previousImages] : previousImages,
    },
    alternates: {
        canonical: seoData?.canonicalUrl || '/a',
    },
    robots: seoData?.robots || 'index, follow',
  }
}


export default async function ArticlesPage() {
  const [articles, authors] = await Promise.all([getArticles(), getAuthors()]);
  const authorsMap = new Map(authors.map(author => [author.slug, author]));

  if (articles.length === 0) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-2xl font-bold">Keine Artikel gefunden</h1>
            <p className="text-muted-foreground">Die Autoren sind wahrscheinlich im Urlaub.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const featuredArticle = articles[0];
  const standardArticles = articles.slice(1, 5);
  const listArticles = articles.slice(5);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    "name": "Satirische Artikel | Das Paulik & Reisch Magazin",
    "description": "Eine kuratierte Sammlung satirischer Meisterwerke, die den alltäglichen Wahnsinn auf die Schippe nehmen. Von Gesellschaftskritik bis Technik-Alpträume.",
    "url": "https://paulik-reisch.de/a",
    "publisher": {
      "@type": "Organization",
      "name": "Paulik & Reisch",
      "logo": {
        "@type": "ImageObject",
        "url": "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
      }
    },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': articles.map((article, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Article',
          'headline': article.title,
          'url': `https://paulik-reisch.de/a/${article.slug}`,
          'image': article.imageUrl,
          'datePublished': article.publishedDate,
          'author': [
            { "@type": "Person", "name": "Philipp Paulik" },
            { "@type": "Person", "name": "Maximilian Reisch" }
          ],
          'description': article.teaser
        }
      })),
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6 space-y-16">
          
          <section>
             <FeaturedArticleCard article={featuredArticle} author={featuredArticle.authorSlug ? authorsMap.get(featuredArticle.authorSlug) ?? null : null} />
          </section>

          {standardArticles.length > 0 && (
            <section>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {standardArticles.map(article => (
                  <StandardArticleCard key={article.id} article={article} author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null} />
                ))}
              </div>
            </section>
          )}

          {listArticles.length > 0 && (
            <section>
               <h2 className="text-3xl font-bold font-headline text-center mb-8">Weitere Artikel</h2>
               <div className="max-w-3xl mx-auto space-y-4">
                {listArticles.map(article => (
                  <ListArticleCard key={article.id} article={article} author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null} />
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
