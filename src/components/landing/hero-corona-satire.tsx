
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';

export function HeroCoronaSatire() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance">
                Nasenbohrer willkommen!
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Eine satirische Aufarbeitung der Pandemie aus Schülersicht. Von der Kunst des Stäbchen-Tests bis zur Freude über die Quarantäne-Ferien.
                </p>
                 <Link href="/buchhandlung-paulik-reisch">
                    <Button size="lg">Das Kapitel zur Krise lesen</Button>
                </Link>
            </div>
          </div>
          <Image
            alt="Satirische Darstellung eines Corona-Tests"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-first transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105 shadow-2xl"
            data-ai-hint="medical test funny"
            height="310"
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/corona.png?alt=media&token=e85455c1-b0c4-4f46-8fac-d9fb346de97d"
            width="550"
          />
        </div>
    </section>
  );
}
