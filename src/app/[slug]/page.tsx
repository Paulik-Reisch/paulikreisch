"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { getLegalPage, type LegalPage as LegalPageType } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function LegalPage({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<LegalPageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLegalPage(params.slug)
      .then((data) => {
        if (!data) {
          // In a real app, you might want to handle this more gracefully
          // For now, we'll just not render the content.
          console.error(`Page not found for slug: ${params.slug}`);
        }
        setPage(data);
      })
      .catch((error) => {
        console.error("Error fetching legal page:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.slug]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
        <Header />
        <main className="flex-1 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <article className="prose prose-lg dark:prose-invert mx-auto">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-5/6 mb-4" />
            </article>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return notFound();
  }

  const lastUpdatedDate = format(new Date(page.lastUpdated), "dd. MMMM yyyy", { locale: de });
  const showTitle = page.showTitle !== false;
  const showDate = page.showDate !== false;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <article className="prose prose-lg dark:prose-invert mx-auto">
                {showTitle && <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{page.title}</h1>}
                {showDate && <p className="text-sm text-muted-foreground">Zuletzt aktualisiert am {lastUpdatedDate}</p>}
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
