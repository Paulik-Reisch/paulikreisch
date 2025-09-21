import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Book, Scale } from "lucide-react";
import { getLegalPage } from "@/lib/firestore";
import { notFound } from "next/navigation";

export default async function LizenzPage() {
    const page = await getLegalPage("lizenz");

    if (!page) {
        notFound();
    }

    const sections = page.content.split('---');
    const zitiervorschlagContent = sections[0] || '';
    const lizenzContent = sections[1] || '';

    const zitiervorschlagParts = zitiervorschlagContent.split('\n\n');
    const zitiervorschlagIntro = zitiervorschlagParts.shift();
    const hw1Zitat = zitiervorschlagParts[0] || '';
    const hw2Zitat = zitiervorschlagParts[1] || '';
    
    const lizenzParts = lizenzContent.split('\n\n');
    const lizenzIntro = lizenzParts.shift();
    
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-12">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                {page.title}
                </h1>
                <p className="text-lg text-muted-foreground mt-4 text-balance">
                Der (überraschend) seriöse Teil darüber, was Sie mit unseren geistigen Ergüssen tun dürfen und was nicht.
                </p>
            </div>

            <div className="space-y-6 p-8 border rounded-lg shadow-sm bg-card">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Book className="w-6 h-6 text-primary"/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-headline">Zitiervorschlag</h2>
                    <p className="text-muted-foreground mt-1">
                        {zitiervorschlagIntro}
                    </p>
                </div>
              </div>
              <div className="pl-12 space-y-6">
                <div>
                    <h3 className="font-semibold text-foreground">Hallo Welt 1</h3>
                    <blockquote className="mt-2 border-l-2 pl-6 italic text-muted-foreground"
                     dangerouslySetInnerHTML={{ __html: hw1Zitat.replace(/\n/g, '<br />') }}>
                    </blockquote>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground">Hallo Welt 2</h3>
                    <blockquote className="mt-2 border-l-2 pl-6 italic text-muted-foreground"
                     dangerouslySetInnerHTML={{ __html: hw2Zitat.replace(/\n/g, '<br />') }}>
                    </blockquote>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8 border rounded-lg shadow-sm bg-card">
                <div className="flex items-start gap-4">
                     <div className="p-2 bg-primary/10 rounded-full">
                        <Scale className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-headline">Lizenz</h2>
                         <p className="text-muted-foreground mt-1">
                            {lizenzIntro}
                        </p>
                    </div>
                </div>

              <div className="pl-12 space-y-4 text-muted-foreground text-sm">
                {lizenzParts.slice(0, 1).map((p, i) => <p key={i}>{p}</p>)}
                <div className="text-center my-4">
                    <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.de" target="_blank" rel="noopener noreferrer">
                        <Badge variant="secondary" className="text-sm py-2 px-4 cursor-pointer hover:scale-105 transition-transform">
                            CC BY-NC-SA 4.0 Legal Code
                        </Badge>
                    </Link>
                </div>
                {lizenzParts.slice(1).map((p, i) => <p key={i}>{p}</p>)}
                <p className="text-xs text-muted-foreground pt-4">Stand: {page.lastUpdated ? page.lastUpdated.toDate().toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}</p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
