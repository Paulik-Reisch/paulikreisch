
"use client";

import Link from 'next/link';
import { ArrowRight, School, Coffee, Utensils, Bus, Dumbbell, AlarmClock, Biohazard, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '../ui/separator';

const topics = [
    {
        title: "Schule = Straflager",
        description: "Die Lernvollzugsanstalt hat wieder geöffnet. Freistunden als Fluchtversuch, Lehrer als Wärter.",
        link: "/lp-schule-straflager",
        icon: School,
        color: "text-red-500"
    },
    {
        title: "Lehrer sind auch nur Menschen",
        description: "Ein Kapitel über inkompetente Lehrer. Ein Hoch auf den Beamtenroboter mit Kaffeetasse.",
        link: "/lp-lehrer-roboter",
        icon: Coffee,
        color: "text-blue-500"
    },
    {
        title: "Mensa = Todesfalle",
        description: "Ekelhumor vom Feinsten. Das Essen als Bio-Waffe. Lies das Menü der Hölle.",
        link: "/lp-mensa-todesfalle",
        icon: Utensils,
        color: "text-green-500"
    },
    {
        title: "Busfahren = Mutprobe",
        description: "Der tägliche Nahverkehr als Gladiatorenkampf. Hol dir den Survival Guide.",
        link: "/lp-busfahren-mutprobe",
        icon: Bus,
        color: "text-yellow-500"
    },
    {
        title: "Sport ist Mord",
        description: "Ein tiefgründiger Blick in die Abgründe der Sporthalle. Völkerball als Kriegsersatz.",
        link: "/lp-sport-ist-mord",
        icon: Dumbbell,
        color: "text-indigo-500"
    },
    {
        title: "Schulzeiten = Genickbruch",
        description: "Warum Frühaufstehen ein Staatsverbrechen ist. Der Wecker ist der wahre Feind der Menschheit.",
        link: "/lp-schulzeiten-genickbruch",
        icon: AlarmClock,
        color: "text-purple-500"
    },
    {
        title: "Corona für Schüler erklärt",
        description: "Eine satirische Aufarbeitung von Tests & Quarantäne. Nasenbohrer willkommen!",
        link: "/lp-corona-satire",
        icon: Biohazard,
        color: "text-pink-500"
    }
];

export function TopicLPs() {
  return (
    <section id="topic-lps" className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-4">
            <Separator className="max-w-80 mx-auto" />
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl pt-4">Was dich interessieren könnte</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Unser Buch hat viele Facetten. Welche spricht dich am meisten an?
            </p>
          </div>
        </div>
        
        <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
                {topics.map((topic) => (
                    <AccordionItem value={topic.title} key={topic.title} className="border bg-background rounded-lg shadow-sm">
                        <AccordionTrigger className="text-xl font-headline hover:no-underline px-6 py-4">
                            <div className="flex items-center gap-4">
                                <topic.icon className={`h-6 w-6 ${topic.color}`} />
                                {topic.title}
                            </div>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 px-6 pb-4">
                           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-10 border-t pt-4">
                                <p className="text-base text-muted-foreground flex-grow">{topic.description}</p>
                                <Link href={topic.link} className="shrink-0">
                                    <Button variant="outline">
                                        Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </section>
  );
}
