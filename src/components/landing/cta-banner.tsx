import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section id="cta-banner" className="w-full py-12 md:py-16 lg:py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Launch-Angebot! (Völlig echt*)</h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nur für die nächsten 14 Tage! Sparen Sie jetzt und sichern Sie sich Ihr Exemplar für nur <span className="line-through">19,99€</span> <span className="font-bold text-2xl animate-pulse">10,99€</span>!
              <br/><span className="text-xs">*Angebot so real wie unsere Bescheidenheit.</span>
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
