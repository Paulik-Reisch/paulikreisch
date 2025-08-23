import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none text-balance animate-in fade-in slide-in-from-top-12 duration-1000">
                Ein Buch, das allen Konventionen trotzt. Und gutem Geschmack.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl animate-in fade-in slide-in-from-top-16 duration-1000">
                Willkommen bei "Hallo Welt". Eine literarische Reise, so tiefgründig, dass Sie alles in Frage stellen werden, was Sie über Bücher zu wissen glaubten. Und die Realität. Und Eichhörnchen.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row animate-in fade-in slide-in-from-top-20 duration-1000">
              <Button size="lg">Jetzt kaufen (Sie wissen, Sie wollen es)</Button>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in-50 duration-1000">
             <Image
                alt="Buchcover"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105 shadow-2xl"
                data-ai-hint="book cover"
                height="550"
                src="https://placehold.co/550x550.png"
                width="550"
              />
          </div>
        </div>
      </div>
    </section>
  );
}
