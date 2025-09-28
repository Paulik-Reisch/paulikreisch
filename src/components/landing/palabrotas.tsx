
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

const vocabulary = [
    { 
        de: "Arschloch", 
        es: "el cabrón / el capullo",
        wortart: "Nomen, maskulin, inflationär verwendet",
        anwendung: "Universell einsetzbar für sympathische Mitmenschen, die einem gerade die Vorfahrt oder den letzten Nerv geraubt haben.",
        synonyme: "Charakter-Vakuum, Nervensäge, Grund für den Glaubensverlust an die Menschheit",
        beispiel: "Dieser cabrón hat den letzten Parkplatz genommen!",
        pfeiferFaktor: 4
    },
    { 
        de: "Wichser", 
        es: "el pendejo",
        wortart: "Nomen, maskulin, stark pejorativ",
        anwendung: "Für Personen, deren Arroganz nur von ihrer Inkompetenz übertroffen wird. Oft in Kombination mit teuren Autos und schlechtem Musikgeschmack anzutreffen.",
        synonyme: "Luftpumpe, Geltungsdrang-Opfer, menschlicher Blinddarm",
        beispiel: "Mira este pendejo con su coche ruidoso.",
        pfeiferFaktor: 5
    },
    {
        de: "Hurensohn", 
        es: "el hijo de puta",
        wortart: "Nomen, maskulin, Eskalationsstufe Rot",
        anwendung: "Fortgeschrittenes Vokabular für den fortgeschrittenen Frust. Wenn 'Arschloch' einfach nicht mehr ausreicht. Nicht für den Gebrauch im Büro empfohlen, es sei denn, Ihr Chef ist es.",
        synonyme: "Genetischer Unfall, Produkt eines bedauerlichen Zwischenfalls",
        beispiel: "¡Ese árbitro es un hijo de puta!",
        pfeiferFaktor: 5
    },
    { 
        de: "Scheiße", 
        es: "la mierda",
        wortart: "Interjektion / Nomen, feminin",
        anwendung: "Ein zeitloser Klassiker. Passt immer, wenn etwas nicht nach Plan läuft – vom verschütteten Kaffee bis zur globalen Finanzkrise.",
        synonyme: "Exkrement, Desaster, 'Oh, nein, nicht schon wieder!'",
        beispiel: "¡Mierda! He olvidado las llaves.",
        pfeiferFaktor: 1
    },
    { 
        de: "Mistkerl", 
        es: "el gilipollas",
        wortart: "Nomen, maskulin, alltagstauglich",
        anwendung: "Für den liebenswerten Idioten von nebenan. Weniger aggressiv als 'cabrón', aber mit einer klaren Botschaft der Missbilligung.",
        synonyme: "Vollpfosten, intellektuelles Flachland, menschgewordener Montagmorgen",
        beispiel: "Mi vecino es un completo gilipollas, pone la música a tope.",
        pfeiferFaktor: 4
    },
    { 
        de: "Fotze", 
        es: "el coño",
        wortart: "Nomen, maskulin (ja, wirklich!), vulgär",
        anwendung: "Sehr vielseitig. Kann als Ausdruck des Schmerzes ('¡Coño, mi dedo!'), der Überraschung ('¡Coño, qué sorpresa!') oder als allgemeine Beleidigung verwendet werden.",
        synonyme: "Siehe weibliches Geschlechtsorgan",
        beispiel: "¡Coño! ¿Pero qué haces?",
        pfeiferFaktor: 5
    },
    { 
        de: "Schlampe", 
        es: "la zorra",
        wortart: "Nomen, feminin, toxisch",
        anwendung: "Für eine besonders raffinierte weibliche Nervensäge, die ihre Intrigen mit einem Lächeln serviert.",
        synonyme: "Intrigantin, Giftschlange, Drama-Queen",
        beispiel: "No te fíes de ella, es una zorra.",
        pfeiferFaktor: 4
    },
];

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


export function Palabrotas() {
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
                    <AccordionItem key={word.de} value={word.de} className="border-b-0">
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
