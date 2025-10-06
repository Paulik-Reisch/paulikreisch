
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function HeroBusfahrenMutprobe() {
  return (
     <section className="w-full py-12 md:py-24 lg:py-32 relative">
           <Image
              alt="Schulgebäude als Gefängnis"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              data-ai-hint="school prison"
              layout="fill"
              src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/bus.png?alt=media&token=0c046182-305c-44d7-afbf-dae92227e748"
            />
      <div className="container px-4 md:px-6 space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none font-headline text-balance">
          Busfahren = Tägliche Mutprobe
        </h1>
        <p className="max-w-[700px] text-lg md:text-xl">
          Der Nahverkehr als moderner Gladiatorenkampf. Nur die Stärksten bekommen einen Sitzplatz – die anderen ein unvergessliches Erlebnis.
        </p>
        <Button size="lg">
          <Download className="mr-2" />
          Survival Guide herunterladen
        </Button>
      </div>
    </section>
  );
}
