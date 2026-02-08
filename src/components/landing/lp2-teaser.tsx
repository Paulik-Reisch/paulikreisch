
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function LP2Teaser() {
  return (
    <section id="premium-teaser" aria-labelledby="premium-teaser-heading" className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 id="premium-teaser-heading" className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Mehr Satire und Humor
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Für alle, die nach »Hallo Welt« nicht genug bekommen: Entdecken Sie Paulik & Reisch Premium. Top-aktuelle, humorvolle Artikel über alles, was die Welt gerade bewegt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
