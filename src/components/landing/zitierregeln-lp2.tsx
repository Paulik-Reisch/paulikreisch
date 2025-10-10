
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCheck, Scale } from "lucide-react";

export function ZitierregelnLP2() {
    return (
        <section id="zitierregeln" className="w-full py-12 md:py-16 bg-muted/40">
            <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-4">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Für die Akademiker</div>
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Zitierpflicht & Lizenz-Voodoo</h2>
                        <p className="text-muted-foreground md:text-lg/relaxed text-balance">
                           Für alle, die es ganz genau nehmen (müssen). Weil selbst satirische Meisterwerke korrekt zitiert werden wollen. Und weil wir Anwälte mögen, aber nur aus sicherer Entfernung.
                        </p>
                    </div>
                    <div className="space-y-6">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><BookCheck className="h-5 w-5 text-primary"/> Zitiervorschlag</CardTitle>
                                <CardDescription>Um das Werk »Hallo Welt 2« korrekt zu zitieren:</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono">
                               <p className="break-words">Paulik, P. und Reisch, M. (2025). 1. Auflage – Hallo Welt 2: Wie das Leben funktioniert, [Seitenzahl(en)]. Verfügbar unter: www.paulik-reisch.de; ISBN 979-8-298-31897-6 [Datum des Zugriffs]</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><Scale className="h-5 w-5 text-primary"/> Lizenz</CardTitle>
                                <CardDescription>Creative Commons CC BY-NC-SA 4.0</CardDescription>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground space-y-2">
                                <p>
                                    Dieses Werk wird unter den Bedingungen der Creative Commons Attribution-Non-Commercial-ShareAlike 4.0 International Public License zur Verfügung gestellt. Bearbeitungen müssen unter identischer Lizenz weitergegeben werden. Die kommerzielle Nutzung ist ausgeschlossen.
                                </p>
                                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    Vollständige Lizenzbedingungen einsehen
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
