import { getAuthorBySlug } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { type Metadata } from 'next'
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

import { SafeRichText } from '@/components/security/safe-rich-text';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorBySlug((await params).slug);
 
  if (!author) {
    return { title: "Autor nicht gefunden" }
  }

  const fullName = `${author.firstName} ${author.lastName}`;
  const title = `${fullName} | Paulik & Reisch`;
  const description = `Profil von ${fullName} bei Paulik & Reisch. ${author.bio.substring(0, 120)}...`;

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
      firstName: author.firstName,
      lastName: author.lastName,
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
  const author = await getAuthorBySlug((await params).slug);

  if (!author) {
    notFound();
  }

  const fullName = `${author.firstName} ${author.lastName}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'ProfilePage',
            '@id': `https://paulikreisch.de/autoren/${author.slug}`,
            'url': `https://paulikreisch.de/autoren/${author.slug}`,
            'name': `${fullName} - Autorenprofil | Paulik & Reisch`,
            'mainEntity': {'@id': `https://paulikreisch.de/autoren/${author.slug}#person`}
        },
        {
            '@type': 'Person',
            '@id': `https://paulikreisch.de/autoren/${author.slug}#person`,
            'name': fullName,
            'description': author.bio,
            'image': author.profilePictureUrl,
            'url': `https://paulikreisch.de/autoren/${author.slug}`,
            'mainEntityOfPage': {'@id': `https://paulikreisch.de/autoren/${author.slug}`},
            'worksFor': {
                '@type': 'Organization',
                'name': 'Paulik & Reisch',
                'url': 'https://paulikreisch.de'
            },
            ...(author.websiteUrl ? { 'sameAs': [author.websiteUrl] } : {})
        }
    ]
  };

  // serializeJsonLd escapes every <; safe-rich-text.test.ts covers script-breakout payloads.
  // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
  const authorJsonLd = <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-muted/30 text-foreground">
      {authorJsonLd}
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
                        <SafeRichText className="prose prose-lg dark:prose-invert" html={author.bio} />
                        
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

        </div>
      </main>
      <Footer />
    </div>
  );
}
