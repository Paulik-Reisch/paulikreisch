import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Luin Schiffbauer | Illustrator | Paulik & Reisch",
    description: 'Entdecken Sie die Arbeit von Luin Schiffbauer, dem brillanten Illustrator, der dem satirischen Universum von "Hallo Welt" sein unverwechselbares Gesicht verleiht.',
    alternates: {
      canonical: '/ueber/luin-schiffbauer',
    },
  };
}

export default function LuinSchiffbauerPage() {
  const amazonUrl = "https://www.amazon.de/s?i=stripbooks&rh=p_27%3ALuin%2BSchiffbauer&s=relevancerank&text=Luin+Schiffbauer&ref=dp_byline_sr_book_3";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <header className="text-center mb-12">
            <Badge variant="secondary" className="text-lg">Illustrator & Künstler</Badge>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mt-4">
              Luin Schiffbauer
            </h1>
          </header>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:col-span-1 flex justify-center">
              <Image 
                src="https://picsum.photos/seed/luin-profile/500/500"
                alt="Porträt von Luin Schiffbauer" 
                data-ai-hint="artist portrait illustrator"
                width={250} 
                height={250} 
                className="rounded-full aspect-square object-cover shadow-lg"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-headline text-3xl font-bold">Über Luin</h2>
              <article className="prose dark:prose-invert max-w-none">
                <p>Luin Schiffbauer ist der visionäre Künstler, der den Worten von Paulik & Reisch ein unvergessliches Gesicht gibt. Als Illustrator der 'Hallo Welt'-Reihe ist er dafür verantwortlich, den satirischen Wahnsinn in Bilder zu übersetzen, die oft mehr sagen als tausend Worte. Sein einzigartiger Stil, eine Mischung aus minimalistischer Klarheit und maximalem Ausdruck, ist ein wesentlicher Bestandteil des Erfolgs.</p>
                <p>Mit jedem Strich fängt Luin die Essenz der Charaktere und Situationen ein und schafft visuelle Gags, die perfekt mit dem Text harmonieren. Seine Illustrationen sind nicht nur Beiwerk, sondern ein integraler Bestandteil des Leseerlebnisses. Entdecken Sie mehr von seiner Arbeit und den Büchern, die er mitgestaltet hat, auf Amazon.</p>
              </article>
              <div className="pt-4">
                <a href={amazonUrl} target="_blank" rel="noopener noreferrer">
                    <Button>Bücher auf Amazon</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
