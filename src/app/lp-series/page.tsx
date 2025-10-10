
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSeries } from "@/components/landing/hero-series";
import { BookShowcase } from "@/components/landing/book-showcase";
import { WhyBoth } from "@/components/landing/why-both";
import { getSeoMetadata } from "@/lib/firestore";
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoData = await getSeoMetadata('lp-series');
 
  if (!seoData) {
    return {
        title: "Die 'Hallo Welt' Buchreihe | Paulik & Reisch",
        description: "Entdecken Sie das 'Hallo Welt'-Universum in seiner ganzen glorreichen Vollendung. Zwei Bücher, eine Saga des Wahnsinns."
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
        canonical: seoData.canonicalUrl || '/lp-series',
    },
    robots: seoData.robots,
  }
}


export default function SeriesPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSeries />
        <BookShowcase />
        <WhyBoth />
      </main>
      <Footer />
    </div>
  );
}
