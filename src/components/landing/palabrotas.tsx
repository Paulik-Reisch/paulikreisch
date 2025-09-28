
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Book, Flame, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Palabrota } from "@/lib/firestore";

const PfeiferRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1" aria-label={`Pfeifer-Faktor: ${rating} von 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Flame 
                key={i}
                className={cn(
                    'transition-colors',
                    i < rating ? 'text-red-500 fill-current animate-flame-in' : 'text-gray-300'
                )}
                style={{ animationDelay: `${i * 100}ms` }}
            />
        ))}
    </div>
);

export function Palabrotas({ vocabulary }: { vocabulary: Palabrota[] }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
            <Badge>Pfeifer's Vermächtnis</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Der "Palabrotas"-Duden
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Ein essenzieller Wortschatz für den modernen Weltbürger. Präsentiert von der R. Pfeifer Akademie für angewandte Linguistik und zwischenmenschliche Eskalation.
            </p>
        </div>

        <div className="max-w-4xl mx-auto mt-12">
            <Accordion type="single" collapsible className="w-full space-y-4">
                {vocabulary.map((word) => (
                    <AccordionItem key={word.id} value={word.id} className="border-b-0">
                        <AccordionTrigger className="text-xl font-semibold hover:no-underline border rounded-lg p-4 bg-card data-[state=open]:rounded-b-none data-[state=open]:bg-muted/50 transition-all">
                           <div className="flex items-center justify-between w-full">
                             <span>{word.de}</span>
                             <span className="text-lg italic text-primary font-normal">{word.es}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 border border-t-0 rounded-b-lg bg-card text-base">
                           <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-sm text-muted-foreground">Wortart</h4>
                                    <p>{word.wortart}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-muted-foreground">Anwendung</h4>
                                    <p>{word.anwendung}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-muted-foreground">Synonyme</h4>
                                    <p className="italic">{word.synonyme}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-muted-foreground">Beispielsatz</h4>
                                    <blockquote className="border-l-4 border-primary pl-4 py-1 my-2">
                                        {word.beispiel}
                                    </blockquote>
                                </div>
                                 <div className="flex items-center gap-4 pt-2">
                                    <h4 className="font-bold text-sm text-muted-foreground">Pfeifer-Faktor™:</h4>
                                    <PfeiferRating rating={word.pfeiferFaktor} />
                                </div>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
           <p className="text-xs text-center text-muted-foreground mt-4">*Haftungsausschluss: Die Autoren übernehmen keine Verantwortung für daraus resultierende soziale oder diplomatische Verwicklungen.</p>
        </div>
      </div>
    </section>
  );
}
