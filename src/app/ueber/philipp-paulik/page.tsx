
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createTrackedUrl } from "@/lib/utils";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Philipp Paulik | Autor & Kreativkopf | Paulik & Reisch",
    description: 'Lernen Sie Philipp Paulik kennen, einen der kreativen Köpfe hinter der satirischen Buchreihe "Hallo Welt". Entdecken Sie seine Arbeit, seinen Werdegang und sein Portfolio.',
    alternates: {
      canonical: '/ueber/philipp-paulik',
    },
  };
}

export default function PhilippPaulikPage() {
  const portfolioUrl = createTrackedUrl(
    'https://philipp-paulik.de/',
    'author_profile_link',
    'organic_crosslink',
    'profile_page_hw_website'
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <header className="text-center mb-12">
            <Badge variant="secondary" className="text-lg">Autor & Kreativkopf</Badge>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mt-4">
              Philipp Paulik
            </h1>
          </header>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:col-span-1 flex justify-center">
              <Image 
                src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/ersteller%2Fphilipp-paulik.png?alt=media&token=7e48b706-80fa-45cc-ae51-b6444bd7ccb3"
                alt="Porträt von Philipp Paulik" 
                width={250} 
                height={250} 
                className="rounded-full aspect-square object-cover shadow-lg"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-headline text-3xl font-bold">Über Philipp</h2>
              <article className="prose dark:prose-invert max-w-none">
                <p>Philipp Paulik ist der Funke, der das satirische Feuer der 'Hallo Welt'-Reihe entfacht. Als einer der beiden Autoren ist er der Meister des kreativen Chaos und der unkonventionellen Ideen. Seine Fähigkeit, die absurdesten Alltagsbeobachtungen in scharfzüngige Kritik zu verwandeln, bildet das Herzstück der Serie.</p>
                <p>Getrieben von einer gesunden Portion Zynismus und zu viel Koffein, sorgt Philipp dafür, dass keine Pointe zu gewagt und kein Thema zu heilig ist. Sein Schreiben ist ein direkter Angriff auf die Monotonie des Alltags und eine Einladung, die Welt mit einem Lachen zu hinterfragen. Besuchen Sie sein persönliches Portfolio, um mehr über seine weiteren Projekte und kreativen Eskapaden zu erfahren.</p>
              </article>
              <div className="pt-4">
                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                    <Button>Portfolio besuchen</Button>
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
