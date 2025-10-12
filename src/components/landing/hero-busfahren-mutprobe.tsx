
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function HeroBusfahrenMutprobe() {
  return (
     <section className="w-full py-12 md:py-24 lg:py-32 relative">
           <Image
              alt="Ritter Trenk"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              data-ai-hint="Ritter Trenk"
              layout="fill"
              src="https://m.media-amazon.com/images/I/817qRWAuYsL._UF894,1000_QL80_.jpg"
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
                <BookOpen className="mr-2" />
                Im Buch mehrere Survival-Tipps nachlesen
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
