import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSeries() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden">
        <Image
            alt="Hintergrundbild Chaos"
            src="https://placehold.co/1920x1080.png"
            data-ai-hint="abstract chaos"
            fill
            className="object-cover -z-10 brightness-50 opacity-30"
        />
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance animate-in fade-in slide-in-from-top-12 duration-1000">
              Die komplette Saga des Wahnsinns
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl text-balance animate-in fade-in slide-in-from-top-16 duration-1000">
              Ein Buch war nur der Anfang. Zwei sind eine Lebenseinstellung. Entdecken Sie das "Hallo Welt"-Universum in seiner ganzen glorreichen Vollendung.
            </p>
          </div>
          <div className="animate-in fade-in slide-in-from-top-20 duration-1000">
             <a href="#book-showcase">
                <Button size="lg" className="animate-pulse">
                    Jetzt die ganze Wahrheit herausfinden
                </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
