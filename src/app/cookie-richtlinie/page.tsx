import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { getLegalPage } from "@/lib/firestore";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

function processContent(content: string) {
    const parts = content.split(/(\[\[.*?\]\])/g);
    return parts.map((part, index) => {
        if (part.startsWith('[[') && part.endsWith(']]')) {
            const linkData = part.substring(2, part.length - 2).split('|');
            const href = linkData[1] || '#';
            const text = linkData[0];
            return <Link key={index} href={href} className="underline">{text}</Link>;
        }
        return part;
    });
}

export default async function CookieRichtliniePage() {
  const page = await getLegalPage("cookie-richtlinie");

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-8">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              {page.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              Die schockierende Wahrheit über die digitalen Krümel, die wir auf Ihrem Computer hinterlassen.
            </p>

            {page.content.split('\n\n').map((section, index) => {
                const lines = section.split('\n');
                const titleLine = lines.shift() || '';
                
                return (
                    <div key={index} className="space-y-4">
                        <h2 className="text-2xl font-bold font-headline">{titleLine}</h2>
                        <div className="text-muted-foreground space-y-2">
                           {lines.map((line, lineIndex) => {
                                if (line.startsWith('* ')) {
                                    return (
                                        <ul key={lineIndex} className="list-disc list-inside space-y-2">
                                            <li>
                                                <strong>{line.substring(2, line.indexOf(':') + 1)}</strong>
                                                {line.substring(line.indexOf(':') + 1)}
                                            </li>
                                        </ul>
                                    )
                                }
                               return <p key={lineIndex}>{processContent(line)}</p>
                           })}
                        </div>
                    </div>
                )
            })}
            
             <div className="space-y-4">
                 <p className="text-xs text-muted-foreground">Stand: {page.lastUpdated ? format(new Date(page.lastUpdated), 'dd.MM.yyyy') : new Date().toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
