import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Maximilian Reisch | Autor & Stratege | Paulik & Reisch",
    description: 'Lernen Sie Maximilian Reisch kennen, einen der strategischen Köpfe hinter der satirischen Buchreihe "Hallo Welt". Entdecken Sie seine Rolle als Autor und Strukturschaffender des Duos.',
    alternates: {
      canonical: '/ueber/max-reisch',
    },
  };
}

export default function MaxReischPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <header className="text-center mb-12">
            <Badge variant="secondary" className="text-lg">Autor & Stratege</Badge>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mt-4">
              Maximilian Reisch
            </h1>
          </header>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:col-span-1 flex justify-center">
              <Image 
                src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/reisch.png?alt=media&token=5aa20eee-967e-4912-9bfe-3f0b6861a316"
                alt="Porträt von Maximilian Reisch" 
                width={250} 
                height={250} 
                className="rounded-full aspect-square object-cover shadow-lg"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-headline text-3xl font-bold">Über Maximilian</h2>
              <article className="prose dark:prose-invert max-w-none">
                <p>Maximilian Reisch ist das strategische Gehirn und die strukturelle Kraft hinter dem satirischen Duo 'Paulik & Reisch'. Während Philipp Paulik das Chaos entfesselt, ist es Max, der diesem Chaos eine Form gibt, es in lesbare Sätze fasst und sicherstellt, dass die Pointen nicht nur zünden, sondern auch nachhaltig im Gedächtnis bleiben.</p>
                <p>Mit einem scharfen Blick für Details und einer Vorliebe für syntaktische Präzision verwandelt er alltägliche Absurditäten in pointierte Gesellschaftskritik. Seine Arbeit sorgt dafür, dass die 'Hallo Welt'-Reihe nicht nur ein Feuerwerk an Gags ist, sondern auch eine intelligente und zusammenhängende Satire.</p>
              </article>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
