
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { ArticleSection } from "@/components/landing/article-section";
import { Authors } from "@/components/landing/authors";
import { Features } from "@/components/landing/features";
import { LP2Teaser } from "@/components/landing/lp2-teaser";
import { Testimonials } from "@/components/landing/testimonials";
import { Newsletter } from "@/components/landing/newsletter";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";
import { Product, getSeoMetadata } from "@/lib/firestore";
import { CountdownBanner } from "@/components/landing/countdown-banner";
import type { Metadata, ResolvingMetadata } from 'next'
import { WorthaftTeaser } from '@/components/landing/worthaft-teaser';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoData = await getSeoMetadata('home');
 
  if (!seoData) {
    return {
        title: "Paulik & Reisch | Satirische Literatur & humorvolle Bücher",
        description: "Die offiziellen Autorenwerke von Philipp Paulik & Maximilian Reisch. Satirische Bücher, absurde Kurzgeschichten und tiefgründiger Unsinn über Schule, Bürokratie und den alltäglichen Wahnsinn."
    }
  }
 
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: seoData.title,
    description: seoData.metaDescription,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      images: seoData.ogImage ? [seoData.ogImage, ...previousImages] : previousImages,
      type: seoData.ogType as 'website' | 'article' | 'book' | 'profile' | undefined,
    },
    twitter: {
      card: seoData.twitterCard as "summary" | "summary_large_image" | "app" | "player" | undefined,
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: seoData.twitterImage ? [seoData.twitterImage] : previousImages,
      site: seoData.twitterSite,
      creator: seoData.twitterCreator,
    },
    alternates: {
        canonical: seoData.canonicalUrl || '/',
    },
    robots: seoData.robots,
  }
}


const hw1: Product = {
    id: "hw1",
    title: "Hallo Welt",
    subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
    price: 10.99,
    imageSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-mockup-1.png?alt=media&token=c82b73e5-76bd-490d-a65f-008a3bfac00b",
    aiHint: "book cover satire",
    amazonLink: "https://www.amazon.de/Hallo-Welt-unerh%C3%B6rten-Bildungsgang-Lernvollzugsanstalt/dp/3982548803",
    description: "Die satirische Abrechnung mit dem Schulsystem, Lehrern als Beamtenrobotern und dem täglichen Wahnsinn des Erwachsenwerdens."
};

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": "https://www.paulikreisch.de/#organization",
    "name": "Paulik & Reisch",
    "url": "https://www.paulikreisch.de",
    "logo": {
      "@type": "ImageObject",
      "url": "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
    },
    "slogan": "Die Speerspitze der modernen Satire",
    "genre": ["Satire", "Comedy", "News"],
    "knowsAbout": ["Politiksatire", "Gesellschaftskritik", "Fake News Satire"],
    "hasPart": [
        {
          "@type": "WebPage",
          "@id": "https://www.paulikreisch.de/a",
          "name": "Paulik & Reisch Satire Magazin",
          "url": "https://www.paulikreisch.de/a",
          "description": "Eine kuratierte Sammlung satirischer Meisterwerke, die den alltäglichen Wahnsinn auf die Schippe nehmen."
        },
        {
          "@type": "WebPage",
          "@id": "https://www.paulikreisch.de/autoren",
          "name": "Unsere Autoren",
          "url": "https://www.paulikreisch.de/autoren",
          "description": "Lernen Sie die kreativen Köpfe hinter den satirischen Artikeln und Büchern von Paulik & Reisch kennen."
        }
      ]
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero product={hw1} />
        <ArticleSection />
        <WorthaftTeaser />
        <Features />
        <Authors />
        <Testimonials />
        <CtaBanner />
        <LP2Teaser />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
