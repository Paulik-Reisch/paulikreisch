
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function HeroMensaTodesfalle() {
  return (
<section className="w-full py-12 md:py-24 lg:py-32 relative">
       <Image
          alt="Schulgebäude als Gefängnis"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          data-ai-hint="vergammelter fra&szlig; mit gift als beilage"
          layout="fill"
          src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/mensa.png?alt=media&token=4e17cbe9-5f6e-4d4f-b919-e3917f961601"
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
