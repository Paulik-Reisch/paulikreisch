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

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/*
          The 'prose' class provides default styling for raw HTML.
          You can write any HTML with Tailwind classes in the LPM content field.
          This div acts as the container for your custom landing page content.
        */}
        <div 
          className="prose dark:prose-invert max-w-none" 
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />

        <div className="container mx-auto px-4 md:px-6 mt-12">
            <p className="text-xs text-muted-foreground">Stand: {page.lastUpdated ? format(new Date(page.lastUpdated), 'dd.MM.yyyy', { locale: de }) : 'N/A'}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}