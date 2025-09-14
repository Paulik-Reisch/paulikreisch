import { Button } from "@/components/ui/button";

export function SeriesCta() {
  return (
    <section id="series-cta" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Bereit für die volle Dosis?</h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Sichern Sie sich die komplette "Hallo Welt"-Saga und tauchen Sie ein in eine Welt, aus der Sie vielleicht nie wieder auftauchen wollen (oder können).
            </p>
          </div>
           <div className="flex flex-col sm:flex-row gap-4">
                 <a href="https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="secondary">Band 1 kaufen</Button>
                </a>
                 <a href="https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="secondary">Band 2 kaufen</Button>
                </a>
            </div>
        </div>
      </div>
    </section>
  );
}
