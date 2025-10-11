
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroLuin } from "@/components/landing/hero-luin";
import { getSeoMetadata } from "@/lib/firestore";
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoData = await getSeoMetadata('lp-luin');
 
  if (!seoData) {
    return {
        title: "Luin Schiffbauer: Der Illustrator | Paulik & Reisch",
        description: "Entdecken Sie den Künstler, der dem Wahnsinn der 'Hallo Welt'-Bücher ein Gesicht gibt. Die brillanten und absurden Illustrationen von Luin Schiffbauer."
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
        canonical: seoData.canonicalUrl || '/lp-luin',
    },
    robots: seoData.robots,
  }
}

export default function LuinPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroLuin />
      </main>
      <Footer />
    </div>
  );
}
