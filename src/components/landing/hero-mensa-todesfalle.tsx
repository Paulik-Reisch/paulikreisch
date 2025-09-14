import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroMensaTodesfalle() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-destructive text-destructive-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Mensa = Todesfalle
            </h1>
            <p className="mx-auto max-w-[700px] md:text-xl text-balance">
              Wo das Essen mehr einer biologischen Waffe gleicht und jedes Gericht ein Experiment mit ungewissem Ausgang ist. Sind Sie mutig genug?
            </p>
          </div>
          <Link href="/buchhandlung-paulik-reisch">
            <Button size="lg" variant="secondary" className="animate-pulse">Lies das Menü der Hölle</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
