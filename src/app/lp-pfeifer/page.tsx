
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroPfeifer } from "@/components/landing/hero-pfeifer";
import { getSeoMetadata } from "@/lib/firestore";
import type { Metadata } from 'next'
 
type Props = {
  params: { slug: string }
}
 
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const seoData = await getSeoMetadata('lp-pfeifer');
 
  if (!seoData) {
    return {
        title: "Das Pfeifer-Mysterium | Paulik & Reisch",
        description: "Die satirische Wahrheit über La Silbadora Pfeifer, die legendäre Spanischlehrerin aus der 'Hallo Welt' Buchreihe."
    }
  }
 
  return {
    title: seoData.title,
    description: seoData.metaDescription,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      images: seoData.ogImage ? [seoData.ogImage] : [],
      type: 'article',
      siteName: 'Paulik & Reisch',
    },
    twitter: {
        card: 'summary_large_image',
        title: seoData.twitterTitle,
        description: seoData.twitterDescription,
        images: seoData.twitterImage ? [seoData.twitterImage] : [],
    }
  }
}

export default function PfeiferPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroPfeifer />
      </main>
      <Footer />
    </div>
  );
}
