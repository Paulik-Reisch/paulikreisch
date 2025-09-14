import { Button } from "@/components/ui/button";
import Link from "next/link";

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
                 <Link href="/buchhandlung-paulik-reisch">
                    <Button size="lg" variant="secondary">Band 1 kaufen</Button>
                </Link>
                 <Link href="/buchhandlung-paulik-reisch">
                    <Button size="lg" variant="secondary">Band 2 kaufen</Button>
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
