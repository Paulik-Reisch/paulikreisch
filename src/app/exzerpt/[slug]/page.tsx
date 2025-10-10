
import { getExcerpt, getSeoMetadata } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: { slug: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const seoSlug = `exzerpt-${slug}`;
  const [excerpt, seoData] = await Promise.all([
      getExcerpt(slug),
      getSeoMetadata(seoSlug)
  ]);
 
  if (!excerpt || !excerpt.isPublished) {
    return {
        title: "Seite nicht gefunden",
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  const title = seoData?.title || excerpt.title;
  const description = seoData?.metaDescription || `Leseprobe aus Kapitel ${excerpt.chapterNumber} der 'Hallo Welt' Buchreihe.`;
 
  return {
    title,
    description,
    keywords: seoData?.keywords,
    openGraph: {
      title: seoData?.ogTitle || title,
      description: seoData?.ogDescription || description,
      images: seoData?.ogImage ? [seoData.ogImage, ...previousImages] : previousImages,
      type: 'article',
      publishedTime: new Date(excerpt.lastUpdated).toISOString(),
      authors: ['Philipp Paulik', 'Maximilian Reisch'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitterTitle || title,
      description: seoData?.twitterDescription || description,
      images: seoData?.twitterImage ? [seoData?.twitterImage] : previousImages,
    },
     alternates: {
        canonical: seoData?.canonicalUrl || `/exzerpt/${slug}`,
    },
  }
}

export default async function ExcerptPage({ params }: { params: { slug: string } }) {
  const page = await getExcerpt(params.slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  const lastUpdatedDate = format(new Date(page.lastUpdated), "dd. MMMM yyyy", { locale: de });

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <article className="prose dark:prose-invert mx-auto max-w-4xl">
                <h1>{page.title}</h1>
                <p className="text-sm text-muted-foreground">Zuletzt aktualisiert am {lastUpdatedDate}</p>
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
