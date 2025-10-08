
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const guards = [
    { title: "Oberaufseher K.", specialty: "Spezialgebiet: Spontane Leistungskontrollen und das Zerstören von Träumen.", image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/personal1.png?alt=media&token=044b6a93-3e27-45f9-ba85-aaf3753e3a14", hint: "strict teacher" },
    { title: "Wärterin M.", specialty: "Meisterin des unangekündigten Vokabeltests und der passiv-aggressiven Ermahnung.", image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/personal2.png?alt=media&token=8bfbfe12-09fd-42ae-bfed-47f34e75fbd4", hint: "stern teacher" },
    { title: "Schließer H.", specialty: "Verantwortlich für die pünktliche Verriegelung aller Fluchtwege.", image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/personal3.png?alt=media&token=cfd2bda2-16bf-4aef-ab50-12a2531760b4", hint: "old teacher" },
    { title: "Aufseherin B.", specialty: "Expertin für die pädagogisch wertvolle Maßnahme des lauten Schweigens.", image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/personal4.png?alt=media&token=f4570b8e-d7a2-4b21-8fda-04b438e299cf", hint: "serious teacher" },
];

export function GuardsGallery() {
    return (
        <section className="w-full py-8 md:py-12 bg-yellow-100 dark:bg-yellow-900/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                           Galerie der Wärter
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                           Lernen Sie das engagierte Personal kennen.
                        </p>
                    </div>
                </div>
                 <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
                     <TooltipProvider>
                        {guards.map((guard, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Card className="text-center bg-background/50 hover:scale-105 transition-transform duration-300 overflow-hidden">
                                        <CardHeader className="p-0">
                                            <div className="aspect-square relative">
                                                <Image
                                                    src={guard.image}
                                                    alt={`Foto von ${guard.title}`}
                                                    data-ai-hint={guard.hint}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <CardTitle className="mt-2 font-headline">{guard.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{guard.specialty}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </div>
        </section>
    );
}
