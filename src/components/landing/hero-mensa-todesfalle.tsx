
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function HeroMensaTodesfalle() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-destructive text-destructive-foreground relative">
        <Image
            alt="Abstraktes, unappetitliches Essen"
            src="https://picsum.photos/seed/mensafood/1920/1080"
            data-ai-hint="disgusting food abstract"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 -z-10 brightness-50 opacity-50"
        />
      <div className="container px-4 md:px-6 z-10 relative">
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
