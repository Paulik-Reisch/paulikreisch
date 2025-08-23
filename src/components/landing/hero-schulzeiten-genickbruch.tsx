import { Button } from '@/components/ui/button';
import { AlarmClockOff } from 'lucide-react';

export function HeroSchulzeitenGenickbruch() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-48 bg-gray-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <AlarmClockOff className="h-24 w-24 mx-auto text-primary animate-pulse" />
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Schulzeiten = Genickbruch
            </h1>
            <p className="mx-auto max-w-3xl text-gray-300 md:text-xl">
              Warum der Wecker der wahre Feind der Menschheit ist und Frühaufstehen als Staatsverbrechen geahndet werden sollte. Ein Manifest gegen den Morgen.
            </p>
            <p className="text-2xl italic font-semibold text-primary">"Wer vor 9 Uhr aufsteht, hat die Kontrolle über sein Leben verloren."</p>
          </div>
          <a href="https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary">
              Gegen den Wecker rebellieren
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
