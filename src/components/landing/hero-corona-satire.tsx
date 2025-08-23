import { Button } from '@/components/ui/button';

export function HeroCoronaSatire() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Nasenbohrer willkommen!
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Eine satirische Aufarbeitung der Pandemie aus Schülersicht. Von der Kunst des Stäbchen-Tests bis zur Freude über die Quarantäne-Ferien.
            </p>
          </div>
           <a href="https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J" target="_blank" rel="noopener noreferrer">
                <Button size="lg">Das Kapitel zur Krise lesen</Button>
            </a>
        </div>
      </div>
    </section>
  );
}
