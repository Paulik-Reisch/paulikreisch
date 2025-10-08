
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroLehrerRoboter() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance">
                Lehrer sind auch nur Menschen. Oder?
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Ein tiefgründiger Einblick in die Welt der inkompetenten Pädagogen, unmotivierten Beamtenroboter und ihrer unendlichen Liebe zu Kaffeetassen.
              </p>
            </div>
             <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg">Buch jetzt kaufen</Button>
            </Link>
          </div>
          <Image
            alt="Lehrer als Beamtenroboter"
            className="mx-15 aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-95"
            data-ai-hint="robot teacher coffee"
            height="450"
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/lehrer.png?alt=media&token=e49dd416-a307-4278-909d-6920dcf7a0c3"
            width="450"
          />
        </div>
      </div>
    </section>
  );
}
