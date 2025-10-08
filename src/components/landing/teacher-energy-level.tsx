
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Battery, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';

const getEnergyLevel = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour < 8) return 95; // Vor der Schule
    if (currentHour < 10) return 60; // Nach den ersten beiden Stunden
    if (currentHour < 12) return 25; // Kurz vor der Mittagspause
    if (currentHour < 14) return 40; // Nach der Pause (kurzer Anstieg)
    if (currentHour < 16) return 5;  // Ende des Schultags
    return 75; // Nachmittags-Kaffee oder Erholung
};

const EnergyIcon = ({ level }: { level: number }) => {
    if (level > 75) return <BatteryFull className="w-6 h-6 text-green-500" />;
    if (level > 50) return <BatteryMedium className="w-6 h-6 text-yellow-500" />;
    if (level > 15) return <BatteryLow className="w-6 h-6 text-orange-500" />;
    return <BatteryWarning className="w-6 h-6 text-red-500 animate-pulse" />;
}

export function TeacherEnergyLevel() {
    const [energy, setEnergy] = useState(0);

    useEffect(() => {
        // Set initial value on client mount
        const initialEnergy = getEnergyLevel();
        setEnergy(initialEnergy);

        // No interval needed as it's just a snapshot of the current time
    }, []);

    return (
        <section className="w-full py-8 md:py-12 bg-white">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                           Energielevel-Anzeige
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                           Live-Daten aus dem Lehrerzimmer. Die Leistung kann je nach Koffein-Zufuhr variieren.
                        </p>
                    </div>
                     <Card className="w-full max-w-2xl mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Aktueller Status</span>
                                <EnergyIcon level={energy} />
                            </CardTitle>
                            <CardDescription>Systemleistung in Prozent</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="relative h-8 w-full">
                                <Progress value={energy} className="h-8" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-bold text-lg text-primary-foreground drop-shadow-md">{energy}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
