
import { getAuthors, type Author } from "@/lib/firestore";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  title: "Unsere Autoren",
  description: "Lerne die kreativen Köpfe hinter den satirischen Artikeln und Büchern von Paulik & Reisch kennen.",
  path: '/autoren',
});

function AuthorCard({ author }: { author: Author }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group text-center">
      <CardContent className="p-6 flex flex-col flex-grow items-center">
        <Link href={`/autoren/${author.slug}`} className="block">
            <Image
            src={author.profilePictureUrl}
            alt={`Profilbild von ${author.firstName} ${author.lastName}`}
            width={120}
            height={120}
            className="rounded-full aspect-square object-cover shadow-lg mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
            />
        </Link>
        <div className="flex-grow">
          <Link href={`/autoren/${author.slug}`} className="mt-2 block">
            <h3 className="text-xl font-bold font-serifHeadline tracking-tight group-hover:text-primary transition-colors">
              {author.firstName} {author.lastName}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 text-balance flex-grow">
            {author.bio}
          </p>
        </div>
        <div className="mt-6">
            <Link href={`/autoren/${author.slug}`}>
                <Button variant="outline" size="sm">Profil ansehen</Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <header className="text-center mb-12">
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl text-balance">
                  Unsere Autoren
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 text-balance">
                  Die kreativen Köpfe, die den alltäglichen Wahnsinn in Worte fassen.
              </p>
          </header>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {authors.map(author => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
