
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function HeroBusfahrenMutprobe() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center text-center text-white">
      <Image
        alt="Überfüllter Bus"
        src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/bus.png?alt=media&token=08503995-08e6-46dc-accf-cdfaa2f34650"
        data-ai-hint="overcrowded bus"
        fill
        className="object-cover -z-10 brightness-50"
      />
      <div className="container px-4 md:px-6 space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none font-headline text-balance">
          Busfahren = Tägliche Mutprobe
        </h1>
        <p className="mx-auto max-w-[700px] text-lg md:text-xl">
          Der Nahverkehr als moderner Gladiatorenkampf. Nur die Stärksten bekommen einen Sitzplatz. Die anderen? Ein unvergessliches Aroma-Erlebnis.
        </p>
        <Button size="lg">
          <Download className="mr-2" />
          Survival Guide herunterladen
        </Button>
      </div>
    </section>
  );
}
