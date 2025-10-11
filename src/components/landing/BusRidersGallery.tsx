
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const riders = [
    { title: "Der Rucksack-Rambo", specialty: "Dreht sich im vollen Bus um 180 Grad und verteilt unabsichtlich Kinnhaken.", image: "https://picsum.photos/seed/bus1/400/400", hint: "person backpack crowded" },
    { title: "Die Telefon-Terroristin", specialty: "Teilt lauthals Details ihrer Scheidung mit dem gesamten Wagen.", image: "https://picsum.photos/seed/bus2/400/400", hint: "person phone angry" },
    { title: "Der Döner-Despot", specialty: "Parfümiert den Bus mit einer Melange aus Zwiebel, Knoblauch und scharfer Soße.", image: "https://picsum.photos/seed/bus3/400/400", hint: "person eating smelly" },
    { title: "Dr. Soundcloud", specialty: "Lässt seine neueste Techno-Mischung über Handy-Lautsprecher laufen. Kopfhörer sind für Anfänger.", image: "https://picsum.photos/seed/bus4/400/400", hint: "teenager music phone" },
];

export function BusRidersGallery() {
    return (
        <section className="w-full py-8 md:py-12 bg-yellow-100 dark:bg-yellow-900/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                           Typologie der Mitfahrer
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                           Eine soziologische Studie der Kreaturen, die den öffentlichen Nahverkehr bevölkern.
                        </p>
                    </div>
                </div>
                 <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
                     <TooltipProvider>
                        {riders.map((rider, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Card className="flex flex-col text-center bg-background/50 hover:scale-105 transition-transform duration-300 overflow-hidden">
                                        <div className="aspect-square relative">
                                            <Image
                                                src={rider.image}
                                                alt={`Foto von ${rider.title}`}
                                                data-ai-hint={rider.hint}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-4 flex-grow flex flex-col justify-center">
                                            <CardTitle className="font-headline text-base">{rider.title}</CardTitle>
                                             <p className="text-xs text-muted-foreground mt-2 md:hidden">
                                                {rider.specialty}
                                            </p>
                                        </div>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent className="hidden md:block max-w-xs">
                                    <p>{rider.specialty}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </div>
        </section>
    );
}
