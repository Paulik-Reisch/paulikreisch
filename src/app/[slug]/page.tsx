
import { getLegalPage, type LegalPage as LegalPageType } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { format } from "date-fns";
import { de } from "date-fns/locale";

// This is now a Server Component
export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = await getLegalPage((await params).slug);

  if (!page) {
    notFound();
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
