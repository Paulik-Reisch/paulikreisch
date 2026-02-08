
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Authors } from "@/components/landing/authors";
import { Newsletter } from "@/components/landing/newsletter";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Über die Autoren | Paulik & Reisch",
    description: "Lernen Sie die kreativen und chaotischen Köpfe hinter der 'Hallo Welt'-Buchreihe kennen: Philipp Paulik, Maximilian Reisch und den Illustrator Luin Schiffbauer.",
    alternates: {
      canonical: '/ueber/autoren',
    },
  };
}

export default function UeberAutorenPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-4">
                        <Badge>Das Team</Badge>
                        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl text-balance">
                           Die Architekten des Wahnsinns
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
                            Drei Individuen, eine Mission: den alltäglichen Wahnsinn zu dokumentieren und in satirische Meisterwerke zu verwandeln. Lernen Sie die Köpfe hinter den Büchern kennen.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        <Authors />
        <Newsletter />

      </main>
      <Footer />
    </div>
  );
}
