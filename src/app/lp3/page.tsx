
import { Header } from "@/components/landing/header";
import { HeroLP3 } from "@/components/landing/hero-lp3";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Reviews } from "@/components/landing/reviews";
import { LP2Teaser } from "@/components/landing/lp2-teaser";
import { Footer } from "@/components/landing/footer";
import { getSeoMetadata } from "@/lib/firestore";
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoData = await getSeoMetadata('lp3');
 
  if (!seoData) {
    return {
        title: "Hallo Welt ist Live! | Paulik & Reisch",
        description: "Das Buch ist öffentlich! Worauf warten Sie noch? Sichern Sie sich jetzt Ihr Exemplar von 'Hallo Welt'."
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
        canonical: seoData.canonicalUrl || '/lp3',
    },
    robots: seoData.robots,
  }
}

export default function LP3() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroLP3 />
        <CtaBanner />
        <Reviews />
        <LP2Teaser />
      </main>
      <Footer />
    </div>
  );
}
