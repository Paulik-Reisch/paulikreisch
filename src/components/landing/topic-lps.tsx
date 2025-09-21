
"use client";

import Link from 'next/link';
import { ArrowRight, School, Coffee, Utensils, Bus, Dumbbell, AlarmClock, Biohazard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const topics = [
    {
        title: "Schule = Straflager",
        description: "Die Lernvollzugsanstalt hat wieder geöffnet. Freistunden als Fluchtversuch, Lehrer als Wärter.",
        link: "/lp-schule-straflager",
        icon: School
    },
    {
        title: "Lehrer sind auch nur Menschen",
        description: "Ein Kapitel über inkompetente Lehrer. Ein Hoch auf den Beamtenroboter mit Kaffeetasse.",
        link: "/lp-lehrer-roboter",
        icon: Coffee
    },
    {
        title: "Mensa = Todesfalle",
        description: "Ekelhumor vom Feinsten. Das Essen als Bio-Waffe. Lies das Menü der Hölle.",
        link: "/lp-mensa-todesfalle",
        icon: Utensils
    },
    {
        title: "Busfahren = Mutprobe",
        description: "Der tägliche Nahverkehr als Gladiatorenkampf. Hol dir den 'Survival Guide'.",
        link: "/lp-busfahren-mutprobe",
        icon: Bus
    },
    {
        title: "Sport ist Mord",
        description: "Ein tiefgründiger Blick in die Abgründe der Sporthalle. Völkerball als Kriegsersatz.",
        link: "/lp-sport-ist-mord",
        icon: Dumbbell
    },
    {
        title: "Schulzeiten = Genickbruch",
        description: "Warum Frühaufstehen ein Staatsverbrechen ist. Der Wecker ist der wahre Feind der Menschheit.",
        link: "/lp-schulzeiten-genickbruch",
        icon: AlarmClock
    },
    {
        title: "Corona für Schüler erklärt",
        description: "Eine satirische Aufarbeitung von Tests & Quarantäne. Nasenbohrer willkommen!",
        link: "/lp-corona-satire",
        icon: Biohazard
    }
];

export function TopicLPs() {
  return (
    <section id="topic-lps" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Was dich interessieren könnte:</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Unser Buch hat viele Facetten. Welche spricht dich am meisten an? Finde es heraus!
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {topics.map((topic, index) => (
                <Card key={topic.link} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl" style={{ transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (1 + index * 0.2)}deg)` }}>
                    <CardHeader className="items-center text-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                            <topic.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-xl">{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex-grow">
                        <CardDescription>{topic.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="justify-center">
                         <Link href={topic.link}>
                            <Button variant="outline">
                                Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
