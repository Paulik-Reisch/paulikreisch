import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { getLegalPage } from "@/lib/firestore";
import { notFound } from "next/navigation";

export default async function ImpressumPage() {
  const page = await getLegalPage("impressum");

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              {page.title}
            </h1>
            
            {page.content.split('\n\n').map((paragraph, index) => {
              const lines = paragraph.split('\n');
              const isHeadline = lines[0].startsWith('<h2>') && lines[0].endsWith('</h2>');

              if (isHeadline) {
                return <h2 key={index} className="text-2xl font-bold font-headline mt-8" dangerouslySetInnerHTML={{ __html: lines[0].substring(4, lines[0].length - 5) }} />
              }
              
              return (
                <div key={index} className="space-y-2 text-muted-foreground">
                  {lines.map((line, lineIndex) => (
                    <p key={lineIndex} dangerouslySetInnerHTML={{ __html: line.replace(/<br \/>/g, '') }} />
                  ))}
                </div>
              );
            })}
             <p className="text-xs text-muted-foreground mt-8">Stand: {page.lastUpdated ? page.lastUpdated.toDate().toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}