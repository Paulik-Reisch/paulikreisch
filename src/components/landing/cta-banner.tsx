import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CountdownBanner } from "./countdown-banner";

export function CtaBanner() {
  return (
    <section id="cta-banner" aria-labelledby="cta-heading" className="w-full py-20 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <CountdownBanner />
          <div className="space-y-2">
            <h2 id="cta-heading" className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Kurzzeit-Angebot</h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              <span className="inline-block whitespace-nowrap line-through">20,99 €</span> <span className="inline-block whitespace-nowrap font-bold text-2xl animate-pulse">10,99 €</span>
            </p>
          </div>
          <Link href="/buchhandlung-paulik-reisch">
            <Button size="lg" variant="secondary">Ja, ich will den Rabatt!</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
