
import { Header } from "@/components/landing/header";
import { HeroLP2 } from "@/components/landing/hero-lp2";
import { Footer } from "@/components/landing/footer";
import { FeaturesLP2 } from "@/components/landing/features-lp2";
import { CountdownTeaser } from "@/components/landing/countdown-teaser";
import { HW2Teaser } from "@/components/landing/hw2-teaser";
import { AboutAuthorsLP2 } from "@/components/landing/about-authors-lp2";
import { VorwortLP2 } from "@/components/landing/vorwort-lp2";
import { ZitierregelnLP2 } from "@/components/landing/zitierregeln-lp2";
import { ExcerptTeaser } from "@/components/landing/excerpt-teaser";
import { getSeoMetadata } from "@/lib/firestore";
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoData = await getSeoMetadata('lp2');
 
  if (!seoData) {
    return {
        title: "Hallo Welt 2 - Der Countdown | Paulik & Reisch",
        description: "Hallo Welt 2 kommt! Seien Sie dabei, wenn das nächste Kapitel des satirischen Wahnsinns aufgeschlagen wird. "
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
        canonical: seoData.canonicalUrl || '/lp2',
    },
    robots: seoData.robots,
  }
}

export default function LP2() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroLP2 />
        <VorwortLP2 />
        <FeaturesLP2 />
        <AboutAuthorsLP2 />
        <ExcerptTeaser />
        <ZitierregelnLP2 />
        <CountdownTeaser />
        <HW2Teaser />
      </main>
      <Footer />
    </div>
  );
}
