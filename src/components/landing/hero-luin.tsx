import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Paintbrush } from "lucide-react";

const illustrations = [
  {
    src: "https://picsum.photos/seed/luin1/500/500",
    alt: "Illustration of a chaotic school scene",
    aiHint: "chaotic school illustration",
    title: "Der alltägliche Wahnsinn",
  },
  {
    src: "https://picsum.photos/seed/luin2/500/500",
    alt: "Illustration of a teacher robot",
    aiHint: "teacher robot illustration",
    title: "Der Beamtenroboter",
  },
  {
    src: "https://picsum.photos/seed/luin3/500/500",
    alt: "Illustration of a bizarre mensa food",
    aiHint: "bizarre food illustration",
    title: "Mensa-Experimente",
  },
  {
    src: "https://picsum.photos/seed/luin4/500/500",
    alt: "Illustration of a complex bureaucratic form",
    aiHint: "complex form illustration",
    title: "Antrag A-38",
  },
   {
    src: "https://picsum.photos/seed/luin5/500/500",
    alt: "Illustration of an exploding alarm clock",
    aiHint: "exploding clock illustration",
    title: "Der Wecker",
  },
  {
    src: "https://picsum.photos/seed/luin6/500/500",
    alt: "Illustration of a crowded bus",
    aiHint: "crowded bus illustration",
    title: "Nahverkehrs-Sardine",
  },
];

export function HeroLuin() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-amber-50 dark:bg-amber-900/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge variant="secondary" className="py-2 px-6 text-lg rounded-full shadow-lg">
            <Paintbrush className="mr-3 h-6 w-6" />
            Das Auge hinter dem Chaos
          </Badge>
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Luin Schiffbauer: Der Illustrator
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Jede Zeile Satire in den "Hallo Welt"-Büchern wird durch Luins brillante und herrlich absurde Illustrationen zum Leben erweckt. Entdecken Sie den Künstler, der dem Wahnsinn ein Gesicht gibt.
            </p>
          </div>
        </div>

        <div className="mt-16">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {illustrations.map((item) => (
                    <div key={item.src} className="group relative overflow-hidden rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105 hover:rotate-[-2deg]">
                        <Image 
                            src={item.src}
                            alt={item.alt}
                            data-ai-hint={item.aiHint}
                            width={500}
                            height={500}
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white font-bold text-lg font-headline">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-20 text-center max-w-3xl mx-auto space-y-8">
             <div className="space-y-4">
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Ein Strich, der mehr sagt als tausend Worte</h2>
                <p className="text-muted-foreground md:text-lg text-balance">
                    Luins Stil ist eine meisterhafte Mischung aus minimalistischer Klarheit und maximalem Ausdruck. Mit wenigen, präzisen Strichen fängt er die Essenz der "Hallo Welt"-Satire ein und schafft Bilder, die im Kopf bleiben – ob man will oder nicht.
                </p>
            </div>
             <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg" variant="secondary" className="shadow-lg animate-pulse">
                    Mehr von Luins Kunst im Buch entdecken
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
