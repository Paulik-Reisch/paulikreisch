
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { getLegalPage, type LegalPage } from "@/lib/firestore";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function DatenschutzClientPage() {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLegalPage('datenschutz').then(data => {
      setPage(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
        <Header />
        <main className="flex-1 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <article className="prose dark:prose-invert mx-auto">
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
    return (
        <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
            <Header />
            <main className="flex-1 py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <h1 className="text-center">Seite nicht gefunden.</h1>
            </div>
            </main>
            <Footer />
        </div>
    );
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
