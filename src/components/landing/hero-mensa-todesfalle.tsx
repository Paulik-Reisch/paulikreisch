import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function HeroMensaTodesfalle() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-balance">
            Mensa = Todesfalle
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Wo das Essen mehr einer biologischen Waffe gleicht und jedes Gericht ein Experiment mit ungewissem Ausgang ist. Sind Sie mutig genug?
          </p>
          <div className="pt-4">
            <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg" variant="secondary">Lesen Sie das Menü der Hölle</Button>
            </Link>
          </div>
        </div>
        <Image
          alt="Schulgebäude als Gefängnis"
          className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105"
          data-ai-hint="vergammelter fraß mit gift als beilage"
          height="550"
          src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/mensa.png?alt=media&token=4e17cbe9-5f6e-4d4f-b919-e3917f961601"
          width="550"
        />
      </div>
    </section>
  );
}
