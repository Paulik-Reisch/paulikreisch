
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Bus, Clock } from "lucide-react";

const reasons = [
    "Ein Eichhörnchen hat ein Stromkabel durchgenagt.",
    "Der Fahrer hat den Bus mit seinem Privat-PKW verwechselt und ist Brötchen holen gefahren.",
    "Plötzlicher Formel-1-Grand-Prix auf Ihrer Route.",
    "Der Bus hat entschieden, heute als U-Boot zu arbeiten. Die Tauchfahrt dauert an.",
    "Gravitationsanomalie. Der Bus ist derzeit 2 cm über dem Boden und hat keine Traktion.",
    "Die Fahrgäste haben eine demokratische Abstimmung über die Route begonnen. Das Ergebnis wird in 3-5 Werktagen erwartet."
];

export function DelayCalculator() {
    const [importance, setImportance] = useState("");
    const [delay, setDelay] = useState<string | null>(null);
    const [reason, setReason] = useState<string | null>(null);

    const calculateDelay = () => {
        if (!importance) return;

        let calculatedDelay = 0;
        switch (importance) {
            case "lebenswichtig":
                calculatedDelay = Math.floor(Math.random() * 30) + 45; // 45-75 min
                break;
            case "wichtig":
                calculatedDelay = Math.floor(Math.random() * 20) + 20; // 20-40 min
                break;
            case "egal":
                calculatedDelay = -5; // Der Bus ist 5 Minuten zu früh
                break;
            default:
                return;
        }

        if (calculatedDelay < 0) {
             setDelay("Der Bus ist 5 Minuten zu früh. Sie haben ihn verpasst.");
             setReason("Das Universum mag keine Gleichgültigkeit.");
        } else {
             setDelay(`Ihr Bus hat eine geschätzte Verspätung von ${calculatedDelay} Minuten.`);
             setReason(reasons[Math.floor(Math.random() * reasons.length)]);
        }
    };

    return (
        <section className="w-full py-8 md:py-12 bg-subtle-blue">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                        Der offizielle Verspätungs-Kalkulator
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                        Berechnen Sie die exakte Ankunftszeit Ihres Busses basierend auf erprobten Faktoren.
                    </p>
                </div>
                <Card className="max-w-xl mx-auto mt-12 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Pünktlichkeits-Orakel</CardTitle>
                        <CardDescription>Wie wichtig ist Ihr nächster Termin?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select onValueChange={setImportance} value={importance}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Wichtigkeit auswählen ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lebenswichtig">Lebenswichtig (z.B. Herz-OP, eigener Hochzeitstermin)</SelectItem>
                                    <SelectItem value="wichtig">Wichtig (z.B. Job-Interview, Klausur)</SelectItem>
                                    <SelectItem value="egal">Völlig egal (z.B. Treffen mit der Schwiegermutter)</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={calculateDelay} disabled={!importance}>
                                Verspätung berechnen <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        {delay && reason && (
                             <Alert>
                                <Bus className="h-4 w-4" />
                                <AlertTitle>{delay}</AlertTitle>
                                <AlertDescription>
                                    <strong className="font-semibold">Offizieller Grund:</strong> {reason}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
