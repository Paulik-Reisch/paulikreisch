
import { getSeoMetadata } from "@/lib/firestore";
import type { Metadata, ResolvingMetadata } from 'next';
import { RisitasClientPage } from "./risitas-client-page";

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seoData = await getSeoMetadata('lp-risitas');
 
  if (!seoData) {
    return {
        title: "Das Risitas-Hörverständnis | Paulik & Reisch",
        description: "Ein unterhaltsames und herausforderndes Hörverständnis-Erlebnis mit dem legendären El Risitas."
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
        canonical: seoData.canonicalUrl || '/lp-risitas',
    },
    robots: seoData.robots,
  }
}

export default function RisitasPage() {
  return <RisitasClientPage />;
}
