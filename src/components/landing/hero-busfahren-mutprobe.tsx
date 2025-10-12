
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function HeroBusfahrenMutprobe() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800/40">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:items-center">
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter xl:text-6xl/none font-headline text-balance">
                Busfahren = Tägliche Mutprobe
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto md:mx-0">
                Der Nahverkehr als moderner Gladiatorenkampf. Nur die Stärksten bekommen einen Sitzplatz – die anderen ein unvergessliches Erlebnis.
                </p>
                <div className="flex justify-center md:justify-start pt-3">
                    <Link href="/buchhandlung-paulik-reisch">
                        <Button size="lg">
                        Im Buch mehrere Survival-Tipps nachlesen
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="p-4 rounded-lg">
                     <Image
                        src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/basura.png?alt=media&token=527ef31c-2d8f-47ee-afb9-9eb2965f220f"
                        alt="Ein Müllhaufen, der einen Bus darstellt"
                        width={400}
                        height={400}
                        className="rounded-lg object-contain"
                        data-ai-hint="trash garbage"
                    />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
