
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Battery, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';

const EnergyIcon = ({ level }: { level: number }) => {
    if (level > 75) return <BatteryFull className="w-6 h-6 text-green-500" />;
    if (level > 50) return <BatteryMedium className="w-6 h-6 text-yellow-500" />;
    if (level > 15) return <BatteryLow className="w-6 h-6 text-orange-500" />;
    return <BatteryWarning className="w-6 h-6 text-red-500 animate-pulse" />;
}

export function TeacherEnergyLevel() {
    const [targetEnergy, setTargetEnergy] = useState(0);
    const [displayEnergy, setDisplayEnergy] = useState(0);

    useEffect(() => {
        // Run only on client
        const randomEnergy = Math.floor(Math.random() * 101);
        setTargetEnergy(randomEnergy);
    }, []);

    useEffect(() => {
        if (displayEnergy < targetEnergy) {
            const timer = setTimeout(() => {
                setDisplayEnergy(prev => Math.min(prev + 1, targetEnergy));
            }, 20); // Speed of the animation
            return () => clearTimeout(timer);
        }
    }, [displayEnergy, targetEnergy]);

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
                                <EnergyIcon level={targetEnergy} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="relative h-8 w-full">
                                <Progress value={displayEnergy} className="h-8 transition-all duration-500 ease-out" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-bold text-lg text-primary-foreground drop-shadow-md">{Math.round(displayEnergy)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
