
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Bus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
    "Ein Eichhörnchen hat ein Stromkabel durchgenagt.",
    "Der Fahrer hat den Bus mit seinem Privat-PKW verwechselt und ist Brötchen holen gefahren.",
    "Plötzlicher Formel-1-Grand-Prix auf Ihrer Route.",
    "Der Bus hat entschieden, heute als U-Boot zu arbeiten. Die Tauchfahrt dauert an.",
    "Gravitationsanomalie. Der Bus ist derzeit 2 cm über dem Boden und hat keine Traktion.",
    "Die Fahrgäste haben eine demokratische Abstimmung über die Route begonnen. Das Ergebnis wird in 3-5 Werktagen erwartet.",
    "Der Busfahrer hat eine Wette verloren und muss die gesamte Strecke im Rückwärtsgang fahren.",
    "Eine Herde philosophierender Kühe blockiert die Straße und diskutiert den Sinn des Lebens.",
    "Die Haltestellen sind heute schüchtern und haben sich hinter Bäumen versteckt."
];

const importanceLevels = [
    { value: "egal", label: "Völlig egal", description: "(z.B. Treffen mit der Schwiegermutter)" },
    { value: "unwichtig", label: "Unwichtig", description: "(z.B. Spaziergang im Park)" },
    { value: "normal", label: "Durchschnittlich wichtig", description: "(z.B. Pünktlich Feierabend machen)" },
    { value: "wichtig", label: "Wichtig", description: "(z.B. Job-Interview, Klausur)" },
    { value: "sehr_wichtig", label: "Sehr wichtig", description: "(z.B. Flug erwischen)" },
    { value: "lebenswichtig", label: "Lebenswichtig", description: "(z.B. Lottogewinn abholen, eigene Hochzeit)" },
];

export function DelayCalculator() {
    const [importanceIndex, setImportanceIndex] = useState(2); // Default to "Normal"
    const [delay, setDelay] = useState<string | null>(null);
    const [reason, setReason] = useState<string | null>(null);

    const calculateDelay = () => {
        const importance = importanceLevels[importanceIndex].value;

        let calculatedDelay = 0;
        switch (importance) {
            case "lebenswichtig":
                setDelay("Der Bus fällt heute leider aus.");
                setReason("Aufgrund eines unvorhergesehenen Risses im Raum-Zeit-Kontinuum.");
                return;
             case "sehr_wichtig":
                calculatedDelay = Math.floor(Math.random() * 30) + 45; // 45-75 min
                break;
            case "wichtig":
                calculatedDelay = Math.floor(Math.random() * 20) + 20; // 20-40 min
                break;
             case "normal":
                calculatedDelay = Math.floor(Math.random() * 10) + 5; // 5-15 min
                break;
            case "unwichtig":
                calculatedDelay = Math.floor(Math.random() * 5); // 0-5 min
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

    const handleSliderChange = (value: number[]) => {
        setImportanceIndex(value[0]);
    }

    const currentImportance = importanceLevels[importanceIndex];

    return (
        <section className="w-full py-8 md:py-12 bg-blue-100 dark:bg-blue-900/40">
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
                         <div className="space-y-4">
                            <Slider
                                defaultValue={[2]}
                                max={importanceLevels.length - 1}
                                step={1}
                                onValueChange={handleSliderChange}
                            />
                            <div className="text-center">
                                <p className="font-semibold">{currentImportance.label}</p>
                                <p className="text-xs text-muted-foreground">{currentImportance.description}</p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                             <Button onClick={calculateDelay}>
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
