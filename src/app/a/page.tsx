
import { getArticles, getSeoMetadata, type Article, getAuthors, type Author } from "@/lib/firestore";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from 'next';
import { StandardArticleCard } from "@/components/article/article-cards";
import { WorthaftTeaser } from "@/components/landing/worthaft-teaser";

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
      'itemListElement': articles.map((article, index) => {
        const articleAuthor = article.authorSlug ? authorsMap.get(article.authorSlug) : null;
        const authorLd = articleAuthor ? {
          '@type': 'Person',
          name: `${articleAuthor.firstName} ${articleAuthor.lastName}`,
          url: `https://paulik-reisch.de/autoren/${articleAuthor.slug}`
        } : {
          '@type': 'Organization',
          name: 'Paulik & Reisch',
          url: 'https://paulik-reisch.de'
        };

        return {
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Article',
            'headline': article.title,
            'url': `https://paulik-reisch.de/a/${article.slug}`,
            'image': article.imageUrl,
            'datePublished': article.publishedDate,
            'author': authorLd,
            'publisher': {
                '@type': 'Organization',
                'name': 'Paulik & Reisch',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'
                }
            },
            'description': article.teaser
          }
        };
      }),
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
            <div className="container px-4 md:px-6">
                <header className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl text-balance">
                        Paulik & Reisch Satire Magazin
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 text-balance">
                        Stöbern Sie durch unsere Sammlung satirischer Meisterwerke. Frisch aus der Feder der Zyniker.
                    </p>
                </header>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <StandardArticleCard key={article.id} article={article} author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null} />
                ))}
                </div>
            </div>
        </section>
        
        <WorthaftTeaser />
      </main>
      <Footer />
    </div>
  );
}

    