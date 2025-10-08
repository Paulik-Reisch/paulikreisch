import { UserX } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const guards = [
    { title: "Oberaufseher K.", specialty: "Spezialgebiet: Spontane Leistungskontrollen und das Zerstören von Träumen." },
    { title: "Wärterin M.", specialty: "Meisterin des unangekündigten Vokabeltests und der passiv-aggressiven Ermahnung." },
    { title: "Schließer H.", specialty: "Verantwortlich für die pünktliche Verriegelung aller Fluchtwege (auch bekannt als Türen)." },
    { title: "Aufseher B.", specialty: "Experte für die pädagogisch wertvolle Maßnahme des 'lauten Anschweigens'." },
];

export function GuardsGallery() {
    return (
        <section className="w-full py-12 md:py-16 bg-yellow-100 dark:bg-yellow-900/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                           Galerie der Wärter
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                           Lernen Sie das engagierte Personal kennen, das für Ihre 'Bildung' verantwortlich ist.
                        </p>
                    </div>
                </div>
                 <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
                     <TooltipProvider>
                        {guards.map((guard, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Card className="text-center bg-background/50 hover:scale-105 transition-transform duration-300">
                                        <CardHeader>
                                            <UserX className="h-16 w-16 mx-auto text-muted-foreground" />
                                            <CardTitle className="mt-4 font-headline">{guard.title}</CardTitle>
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
