import { getArticleBySlug, getSeoMetadata } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { type Metadata, type ResolvingMetadata } from 'next'
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

type Props = {
  params: { slug: string }
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
        canonical: seoData?.canonicalUrl || `/artikel/${slug}`,
    },
    robots: seoData?.robots || 'index, follow',
    openGraph: {
      title: seoData?.ogTitle || title,
      description: seoData?.ogDescription || description,
      url: seoData?.canonicalUrl || `/artikel/${slug}`,
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
  const [article, seoData] = await Promise.all([
    getArticleBySlug(slug),
    getSeoMetadata(`a-${slug}`),
  ]);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': seoData?.articleType || 'SatiricalArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://paulik-reisch.de/artikel/${slug}`,
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

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6">
            <article className="prose dark:prose-invert mx-auto max-w-4xl">
                <header className="mb-12">
                    <Badge variant="secondary" className="mb-4">{article.category}</Badge>
                    <h1 className="text-4xl sm:text-5xl font-extrabold font-headline tracking-tight text-balance">{article.title}</h1>
                    <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
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
                
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
