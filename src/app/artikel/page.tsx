import { getArticles, getSeoMetadata, type Article } from "@/lib/firestore";
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
import type { Metadata, ResolvingMetadata } from 'next'

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
                <span>{article.readTime} min</span>
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
      url: seoData?.canonicalUrl || '/artikel',
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
        canonical: seoData?.canonicalUrl || '/artikel',
    },
    robots: seoData?.robots || 'index, follow',
  }
}


export default async function ArticlesPage() {
  const articles = await getArticles();
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    "name": "Satirische Artikel | Das Paulik & Reisch Magazin",
    "description": "Eine kuratierte Sammlung satirischer Meisterwerke, die den alltäglichen Wahnsinn auf die Schippe nehmen. Von Gesellschaftskritik bis Technik-Alpträume.",
    "url": "https://paulik-reisch.de/artikel",
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
          'url': `https://paulik-reisch.de/artikel/${article.slug}`,
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
        <div className="container px-4 md:px-6">
          <header className="text-center mb-12">
              <Badge>Magazin</Badge>
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl mt-4 text-balance">
                  Archiv des Wahnsinns
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 text-balance">
                  Stöbern Sie durch unsere Sammlung satirischer Meisterwerke. Frisch aus der Feder der Zyniker.
              </p>
          </header>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
