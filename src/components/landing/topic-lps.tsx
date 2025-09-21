
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const topics = [
    {
        title: "Schule = Straflager",
        description: "Die Lernvollzugsanstalt hat wieder geöffnet. Freistunden als Fluchtversuch, Lehrer als Wärter.",
        link: "/lp-schule-straflager",
        image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/schule.png?alt=media&token=8d6d2220-8eee-4143-ba1e-8517eec2385f",
        aiHint: "prison school"
    },
    {
        title: "Lehrer sind auch nur Menschen (leider)",
        description: "Ein Kapitel über inkompetente Lehrer. Ein Hoch auf den Beamtenroboter mit Kaffeetasse.",
        link: "/lp-lehrer-roboter",
        image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/lehrer.png?alt=media&token=e49dd416-a307-4278-909d-6920dcf7a0c3",
        aiHint: "robot teacher"
    },
    {
        title: "Mensa = Todesfalle",
        description: "Ekelhumor vom Feinsten. Das Essen als Bio-Waffe. Lies das Menü der Hölle.",
        link: "/lp-mensa-todesfalle",
        image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/mensa.png?alt=media&token=4e17cbe9-5f6e-4d4f-b919-e3917f961601",
        aiHint: "disgusting food"
    },
    {
        title: "Busfahren = Mutprobe",
        description: "Der tägliche Nahverkehr als Gladiatorenkampf. Hol dir den 'Survival Guide'.",
        link: "/lp-busfahren-mutprobe",
        image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/bus.png?alt=media&token=08503995-08e6-46dc-accf-cdfaa2f34650",
        aiHint: "crowded bus"
    },
    {
        title: "Sport ist Mord",
        description: "Ein tiefgründiger Blick in die Abgründe der Sporthalle. Design wie ein Fitness-Werbeplakat – nur mit Knochenbrüchen.",
        link: "/lp-sport-ist-mord",
        image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/sport.png?alt=media&token=81c3dfa8-3b76-4b30-a0d3-96ff219145ce",
        aiHint: "sports accident"
    },
    {
        title: "Schulzeiten = Genickbruch",
        description: "Warum Frühaufstehen ein Staatsverbrechen ist. Der Wecker ist der wahre Feind der Menschheit.",
        link: "/lp-schulzeiten-genickbruch",
        image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/schulzeiten.png?alt=media&token=63d97151-7333-4241-85ea-96e6973d71f3",
        aiHint: "alarm clock"
    },
    {
        title: "Corona für Schüler erklärt",
        description: "Eine satirische Aufarbeitung von Tests & Quarantäne. Nasenbohrer willkommen!",
        link: "/lp-corona-satire",
        image: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.appspot.com/o/corona.png?alt=media&token=e85455c1-b0c4-4f46-8fac-d9fb346de97d",
        aiHint: "medical test"
    }
];

export function TopicLPs() {
  const [activeTopic, setActiveTopic] = useState(topics[0]);

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
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="flex flex-col gap-2">
                {topics.map((topic) => (
                    <Link
                        href={topic.link}
                        key={topic.link}
                        className={cn(
                            "p-4 rounded-lg transition-all duration-300",
                            activeTopic.link === topic.link ? 'bg-card shadow-lg' : 'hover:bg-card/50'
                        )}
                        onMouseEnter={() => setActiveTopic(topic)}
                    >
                        <h3 className="font-headline text-xl font-bold">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                        <div className={cn(
                            "flex items-center text-primary font-semibold text-sm mt-2 transition-all duration-300",
                            activeTopic.link === topic.link ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                            Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </Link>
                ))}
            </div>
            <div className="relative h-64 md:h-96 lg:h-full min-h-[300px] lg:min-h-full rounded-xl overflow-hidden shadow-2xl transform lg:group-hover:scale-105 transition-transform duration-500 -rotate-1">
                 {topics.map((topic) => (
                    <Image
                        key={topic.link}
                        alt={topic.title}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                            activeTopic.link === topic.link ? "opacity-100" : "opacity-0"
                        )}
                        height="600"
                        src={topic.image}
                        data-ai-hint={topic.aiHint}
                        width="800"
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
