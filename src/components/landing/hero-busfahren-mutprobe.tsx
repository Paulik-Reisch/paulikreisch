
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function HeroBusfahrenMutprobe() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800/40">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:items-center">
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter xl:text-7xl/none font-headline text-balance">
                Busfahren = Tägliche Mutprobe
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto md:mx-0">
                Der Nahverkehr als moderner Gladiatorenkampf. Nur die Stärksten bekommen einen Sitzplatz – die anderen ein unvergessliches Erlebnis.
                </p>
                <div className="pt-3 flex justify-center md:justify-start">
                    <Link href="/buchhandlung-paulik-reisch">
                        <Button size="lg">
                        Im Buch mehrere Survival-Tipps nachlesen
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-2xl border transform-gpu rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-105">
                     <Image
                      alt="Urban Dictionary Mug"
                      className="rounded-md"
                      data-ai-hint="funny mug"
                      height={400}
                      width={400}
                      src="https://urbandictionary.store/image/mug/5044676"
                    />
                    <p className="text-center mt-2 text-sm italic text-muted-foreground">"soy max y adicto a hacerme pajas"</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
