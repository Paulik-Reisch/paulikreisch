import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { getLegalPage } from "@/lib/firestore";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { de } from "date-fns/locale";

// Helper function to process content with special syntax like [[link|href]]
function processContent(content: string) {
    // This regex looks for patterns like [[text|href]]
    const parts = content.split(/(\[\[.*?\]\])/g);
    return parts.map((part, index) => {
        if (part.startsWith('[[') && part.endsWith(']]')) {
            const linkData = part.substring(2, part.length - 2).split('|');
            const href = linkData[1] || '#';
            const text = linkData[0];
            return <Link key={index} href={href} className="underline hover:text-primary">{text}</Link>;
        }
        return part;
    });
}

export default async function DynamicLegalPage({ params }: { params: { slug: string } }) {
  const page = await getLegalPage(params.slug);

  if (!page) {
    notFound();
  }

  // Very basic renderer, can be improved to handle more markdown/custom syntax
  const renderContent = () => {
    return page.content.split('\n\n').map((paragraph, index) => {
        const lines = paragraph.split('\n');
        return (
            <div key={index} className="space-y-2 text-muted-foreground">
                {lines.map((line, lineIndex) => (
                    <p key={lineIndex}>{processContent(line)}</p>
                ))}
            </div>
        );
    });
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
              {page.title}
            </h1>
            
            <div className="space-y-6">
                {renderContent()}
            </div>
            
             <p className="text-xs text-muted-foreground mt-8">Stand: {page.lastUpdated ? format(new Date(page.lastUpdated), 'dd.MM.yyyy', { locale: de }) : 'N/A'}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
