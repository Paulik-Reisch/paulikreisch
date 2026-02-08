
import { getArticleBySlug, getSeoMetadata } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { type Metadata, type ResolvingMetadata } from 'next'
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

type Props = {
  params: { slug: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const seoSlug = `a-${slug}`; // a for article
  const [article, seoData] = await Promise.all([
      getArticleBySlug(slug),
      getSeoMetadata(seoSlug)
  ]);
 
  if (!article) {
    return { title: "Artikel nicht gefunden" }
  }

  const previousImages = (await parent).openGraph?.images || []
  const title = seoData?.title || article.title;
  const description = seoData?.metaDescription || article.teaser;
 
  return {
    title,
    description,
    keywords: seoData?.keywords,
    openGraph: {
      title: seoData?.ogTitle || title,
      description: seoData?.ogDescription || description,
      images: seoData?.ogImage ? [seoData.ogImage, ...previousImages] : (article.imageUrl ? [article.imageUrl, ...previousImages] : previousImages),
      type: 'article',
      publishedTime: new Date(article.publishedDate).toISOString(),
      authors: ['Philipp Paulik', 'Maximilian Reisch'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.twitterTitle || title,
      description: seoData?.twitterDescription || description,
      images: seoData?.twitterImage ? [seoData.twitterImage] : (article.imageUrl ? [article.imageUrl] : previousImages),
    },
     alternates: {
        canonical: seoData?.canonicalUrl || `/a/${slug}`,
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6">
            <article className="prose dark:prose-invert mx-auto max-w-4xl">
                <header className="mb-12">
                    <Badge variant="secondary" className="mb-4">{article.category}</Badge>
                    <h1 className="text-4xl sm:text-5xl font-extrabold font-headline tracking-tight text-balance">{article.title}</h1>
                    <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={article.publishedDate}>
                                {format(new Date(article.publishedDate), "dd. MMMM yyyy", { locale: de })}
                            </time>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime} Minuten Lesezeit</span>
                        </div>
                    </div>
                </header>
                
                <figure className="not-prose my-12 -mx-4 md:mx-0">
                    <Image
                        src={article.imageUrl}
                        alt={article.imageAlt}
                        width={1200}
                        height={675}
                        className="rounded-lg shadow-lg aspect-video object-cover"
                        priority
                    />
                </figure>
                
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
