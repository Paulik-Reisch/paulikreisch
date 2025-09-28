
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSchulzeitenGenickbruch() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-48 bg-gray-900 text-white relative">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/schulzeiten.png?alt=media&token=63d97151-7333-4241-85ea-96e6973d71f3"
              width="200"
              height="200"
              className="mx-auto rounded-[25px] object-cover"
              alt="Schulzeiten"
            />
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Schulzeiten = Genickbruch
            </h1>
            <p className="mx-auto max-w-3xl text-gray-300 md:text-xl">
              Warum der Wecker der wahre Feind der Menschheit ist und Frühaufstehen als Staatsverbrechen geahndet werden sollte. Ein Manifest gegen den Morgen.
            </p>
            <p className="text-2xl italic font-semibold text-primary">"Wer vor 9 Uhr aufsteht, hat die Kontrolle über sein Leben verloren."</p>
          </div>
          <Link href="/buchhandlung-paulik-reisch">
            <Button size="lg" variant="secondary">
              Gegen den Wecker rebellieren
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
