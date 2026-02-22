
import { getAuthorBySlug, getArticlesByAuthorSlug, type Author, type Article } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { type Metadata } from 'next'
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, Twitter, Linkedin, Globe, BookHeart, Rss } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: { slug: string }
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <Link href={`/a/${article.slug}`} className="block overflow-hidden">
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
          <Badge variant="secondary">{article.category}</Badge>
          <Link href={`/a/${article.slug}`} className="mt-2 block">
            <h3 className="text-xl font-bold font-serifHeadline tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={article.publishedDate}>
              {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);
 
  if (!author) {
    return { title: "Autor nicht gefunden" }
  }

  const fullName = `${author.firstName} ${author.lastName}`;
  const title = `${fullName} | Paulik & Reisch`;
  const description = `Profil und aktuellste Artikel von ${fullName}, Autor bei Paulik & Reisch. ${author.bio.substring(0, 120)}...`;

  return {
    title,
    description,
    alternates: {
        canonical: `/autoren/${author.slug}`,
    },
    openGraph: {
      type: 'profile',
      title: title,
      description: description,
      url: `/autoren/${author.slug}`,
      profile: {
        firstName: author.firstName,
        lastName: author.lastName,
      },
      images: [
        {
          url: author.profilePictureUrl,
          alt: `Profilbild von ${fullName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [author.profilePictureUrl],
    },
  }
}

export default async function AuthorPage({ params }: Props) {
  const [author, articles] = await Promise.all([
    getAuthorBySlug(params.slug),
    getArticlesByAuthorSlug(params.slug)
  ]);

  if (!author) {
    notFound();
  }

  const fullName = `${author.firstName} ${author.lastName}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'ProfilePage',
            '@id': `https://paulik-reisch.de/autoren/${author.slug}`,
            'url': `https://paulik-reisch.de/autoren/${author.slug}`,
            'name': `${fullName} - Autorenprofil | Paulik & Reisch`,
            'mainEntity': {'@id': `https://paulik-reisch.de/autoren/${author.slug}#person`}
        },
        {
            '@type': 'Person',
            '@id': `https://paulik-reisch.de/autoren/${author.slug}#person`,
            'name': fullName,
            'description': author.bio,
            'image': author.profilePictureUrl,
            'url': `https://paulik-reisch.de/autoren/${author.slug}`,
            'mainEntityOfPage': {'@id': `https://paulik-reisch.de/autoren/${author.slug}`},
            'worksFor': {
                '@type': 'Organization',
                'name': 'Paulik & Reisch',
                'url': 'https://paulik-reisch.de'
            },
            ...(author.websiteUrl ? { 'sameAs': [author.websiteUrl] } : {})
        }
    ]
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-muted/30 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6">
            <header className="bg-background rounded-lg border p-8 md:p-12 mb-16">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-1 flex justify-center">
                        <Image
                            src={author.profilePictureUrl}
                            alt={`Profilbild von ${fullName}`}
                            width={200}
                            height={200}
                            className="rounded-full aspect-square object-cover shadow-lg border-4 border-secondary"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-extrabold font-serifHeadline tracking-tight">{fullName}</h1>
                        <div className="prose prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: author.bio }} />
                        
                        {author.websiteUrl && (
                           <div className="pt-4 flex gap-4">
                                <a href={author.websiteUrl} target="_blank" rel="noopener me" className="group">
                                    <Button variant="outline">
                                        <Globe className="mr-2 h-4 w-4 group-hover:text-primary transition-colors"/>
                                        Website
                                    </Button>
                                </a>
                           </div>
                        )}
                    </div>
                </div>
            </header>

            {articles.length > 0 && (
              <section>
                  <h2 className="text-3xl font-bold font-headline text-center mb-12 flex items-center justify-center gap-3">
                    <Rss className="h-8 w-8 text-primary" />
                    Neueste Artikel von {author.firstName}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                      {articles.map((article) => (
                          <ArticleCard key={article.id} article={article} />
                      ))}
                  </div>
              </section>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
