
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function HeroBusfahrenMutprobe() {
  return (
     <section className="w-full py-12 md:py-24 lg:py-32 relative">
           <Image
              alt="Urban Dictionary Mug"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              data-ai-hint="funny mug"
              layout="fill"
              src="https://urbandictionary.store/image/mug/5044676"
            />
      <div className="container px-4 md:px-6 space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none font-headline text-balance">
          Busfahren = Tägliche Mutprobe
        </h1>
        <p className="max-w-[700px] text-lg md:text-xl">
          Der Nahverkehr als moderner Gladiatorenkampf. Nur die Stärksten bekommen einen Sitzplatz – die anderen ein unvergessliches Erlebnis.
        </p>
        <div className="pt-3">
            <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg">
                Im Buch mehrere Survival-Tipps nachlesen
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
