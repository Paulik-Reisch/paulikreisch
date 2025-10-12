import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import placeholderImages from '@/lib/placeholder-images.json';

const devices = placeholderImages.deathDevices;

export function DeathDevices() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                           Das "Geräte-des-Todes"-Lexikon
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                           Eine Galerie der Folterinstrumente, getarnt als Sportgeräte.
                        </p>
                    </div>
                </div>
                 <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
                     <TooltipProvider>
                        {devices.map((device, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Card className="flex flex-col text-center bg-background hover:scale-105 transition-transform duration-300 overflow-hidden group">
                                        <div className="aspect-square relative overflow-hidden">
                                            <Image
                                                src={device.image}
                                                alt={device.alt}
                                                data-ai-hint={device.aiHint}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4 flex-grow flex flex-col justify-center">
                                            <CardTitle className="font-headline text-lg">{device.title}</CardTitle>
                                             <p className="text-sm text-muted-foreground mt-2 md:hidden">
                                                {device.specialty}
                                            </p>
                                        </div>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent className="hidden md:block max-w-xs bg-destructive text-destructive-foreground border-destructive-foreground/20">
                                    <p className="font-bold text-lg">{device.specialty}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </div>
        </section>
    );
}
