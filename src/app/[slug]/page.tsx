import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { getLegalPage } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default async function DynamicLegalPage({ params }: { params: { slug: string } }) {
  const page = await getLegalPage(params.slug);

  if (!page) {
    notFound();
  }

  // Fallback to old content if components are not present
  const contentHtml = page.content;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-6 py-12 md:py-24">
            <div 
              className="prose dark:prose-invert max-w-none" 
              dangerouslySetInnerHTML={{ __html: contentHtml }} 
            />
            <p className="text-xs text-muted-foreground mt-12">Stand: {page.lastUpdated ? format(new Date(page.lastUpdated), 'dd.MM.yyyy', { locale: de }) : 'N/A'}</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
