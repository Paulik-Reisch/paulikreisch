"use client";

import {
  BrainCircuit,
  FileText,
  Train,
  Sparkles,
  Home,
  Clock,
  BookText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const ideas = [
  {
    icon: FileText,
    title: "Bürokratie-Generator",
    description:
      "Erhalten Sie auf Knopfdruck ein absurd langes und sinnloses Behörden-Antwortschreiben. Effizienz, wie sie im Buche steht.",
    link: "/lp-buerokratie-generator",
    cta: "Antrag generieren",
    book: "Hallo Welt 2",
    bgColor: "bg-yellow-300",
    shape: (
      <svg
        className="absolute w-full h-full text-yellow-300"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M60.1,-55.9C74.2,-38.4,79.5,-11.2,74.5,12.3C69.5,35.8,54.2,55.5,35.8,66.1C17.4,76.7,-4.1,78.1,-24.3,69.9C-44.5,61.7,-63.3,43.9,-70.2,23.4C-77.1,2.9,-72,-20.3,-58.8,-37.9C-45.6,-55.4,-24.3,-67.2,0.6,-67.6C25.5,-68,51,-58.1,60.1,-55.9Z"
          transform="translate(100 100)"
        ></path>
      </svg>
    ),
  },
  {
    icon: BrainCircuit,
    title: "Lehrer-Noten-Simulator",
    description:
      "Geben Sie Ihren Namen ein und erhalten Sie ein völlig absurdes Schulzeugnis, das Ihre wahren Talente (wie Pausenbrot-Management) würdigt.",
    link: "/lp-lehrer-noten-simulator",
    cta: "Zeugnis erhalten",
    book: "Hallo Welt",
    bgColor: "bg-blue-400",
    shape: (
        <svg className="absolute w-full h-full text-blue-400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M63.8,-49.9C79.8,-29.4,87.8,-2.6,83.1,23.1C78.4,48.7,60.9,73.1,39.4,82.4C17.9,91.7,-7.6,85.9,-28.9,73.8C-50.2,61.7,-67.2,43.3,-74.2,22.1C-81.2,0.9,-78.1,-23.1,-65.1,-43.3C-52.1,-63.5,-29.2,-79.9,-2.2,-78.8C24.8,-77.7,47.7,-70.4,63.8,-49.9Z" transform="translate(100 100)" />
        </svg>
    ),
  },
  {
    icon: Train,
    title: "Deutsche Bahn Ausreden-Bot",
    description:
      "Warum hat Ihr Zug Verspätung? Unser Bot liefert Ihnen die kreativsten und absurdesten Ausreden, direkt aus der Konzernzentrale.",
    link: "/lp-db-ausreden-bot",
    cta: "Ausrede würfeln",
    book: "Hallo Welt 2",
    bgColor: "bg-orange-400",
     shape: (
        <svg className="absolute w-full h-full text-orange-400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M54,-61.7C69.4,-52.5,80.8,-37.2,85.2,-19.8C89.6,-2.4,87,17.2,76.2,32.8C65.4,48.4,46.4,60.1,27,69.5C7.6,78.9,-12.3,86,-30.9,81.4C-49.4,76.8,-66.6,60.6,-74.6,41.9C-82.6,23.2,-81.4,2.1,-75.4,-17.1C-69.4,-36.3,-58.6,-53.6,-43.7,-63.3C-28.7,-73,-9.6,-75.1,10.2,-71.8C30.1,-68.5,41.5,-68.8,54,-61.7Z" transform="translate(100 100)" />
        </svg>
    ),
  },
  {
    icon: Sparkles,
    title: "Satire-Typ-Test",
    description:
      "Welche Katastrophenfigur aus dem 'Hallo Welt'-Universum sind Sie? Machen Sie den Test und teilen Sie Ihr traumatisches Ergebnis.",
    link: "/lp-satire-typ-test",
    cta: "Test starten",
    book: "Hallo Welt",
    bgColor: "bg-pink-300",
    shape: (
        <svg className="absolute w-full h-full text-pink-300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M57.9,-54.5C72.9,-39.2,81.6,-19.6,81.8,0.3C82,20.2,73.8,40.4,59.3,53.2C44.9,66,24.2,71.4,3.2,70.5C-17.8,69.6,-35.6,62.4,-50.7,50.1C-65.7,37.8,-78,20.4,-78.9,-0.2C-79.9,-20.7,-70,-41.4,-54.8,-56.3C-39.6,-71.2,-19.8,-80.3,1.4,-81.1C22.6,-81.9,42.9,-70,57.9,-54.5Z" transform="translate(100 100)" />
        </svg>
    ),
  },
  {
    icon: Home,
    title: "Mietenwahnsinn-Rechner",
    description:
      "Was kostet ein 4qm-Zimmer ohne Fenster in Ihrer Stadt? Finden Sie es heraus (und weinen Sie leise).",
    link: "/lp-mietenwahnsinn",
    cta: "Miete berechnen",
    book: "Hallo Welt 2",
    bgColor: "bg-lime-300",
    shape: (
        <svg className="absolute w-full h-full text-lime-300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M51.9,-55.8C65.9,-44.3,74.7,-27.1,77.5,-8.3C80.3,10.5,77,30.9,65.8,44.9C54.6,58.9,35.4,66.5,16.8,71.9C-1.8,77.3,-20,80.5,-36.5,73.8C-53.1,67.1,-68,50.5,-73.4,32.3C-78.8,14.1,-74.7,-5.7,-65.9,-22.1C-57.1,-38.5,-43.6,-51.4,-28.9,-59.8C-14.2,-68.2,-7.1,-72.1,3.8,-70.8C14.7,-69.5,29.4,-63.9,51.9,-55.8Z" transform="translate(100 100)" />
        </svg>
    )
  },
  {
    icon: Clock,
    title: "Beamten-Wartezeiten-Simulator",
    description:
      "Erleben Sie die beruhigende Wirkung einer endlosen Warteschleife. Ihr Antrag wird geprüft... vielleicht.",
    link: "/lp-beamten-wartezeiten-simulator",
    cta: "Warten starten",
    book: "Hallo Welt 2",
    bgColor: "bg-green-400",
    shape: (
        <svg className="absolute w-full h-full text-green-400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M49.9,-53.4C63.8,-42.6,73.5,-27,76.5,-9.7C79.5,7.7,75.7,26.7,65.3,42.5C54.9,58.3,37.8,70.9,19.2,76.3C0.5,81.7,-19.7,80,-38.3,70.5C-56.9,61,-73.8,43.8,-79.1,24.9C-84.4,6,-78,-14.7,-66.1,-31.1C-54.2,-47.5,-36.8,-59.6,-19.3,-64.8C-1.8,-70,-0.9,-68.3,16.2,-64.5C33.3,-60.7,35.9,-64.2,49.9,-53.4Z" transform="translate(100 100)" />
        </svg>
    )
  },
  {
    icon: BookText,
    title: "Kapitel-Fußnoten-Generator",
    description:
      "Erfinden Sie zu jedem Thema eine pseudo-wissenschaftliche Fußnote im unverkennbaren Stil des Buches.",
    link: "/lp-fussnoten-generator",
    cta: "Fußnote generieren",
    book: "Hallo Welt",
    bgColor: "bg-indigo-400",
    shape: (
         <svg className="absolute w-full h-full text-indigo-400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M38.3,-55.8C52.1,-52.7,67.5,-45,76.4,-33.1C85.4,-21.2,87.9,-5.1,81.9,8.5C75.8,22.1,61.2,33.2,47.9,44.7C34.6,56.2,22.6,68.2,7.1,74.5C-8.4,80.8,-27.4,81.5,-43.5,74.5C-59.5,67.5,-72.6,52.8,-78.4,36.4C-84.2,20,-82.6,1.9,-76.7,-14.6C-70.7,-31.1,-60.4,-46.1,-46.9,-51.7C-33.4,-57.4,-16.7,-53.8,-2.2,-51.9C12.3,-50.1,24.5,-58.9,38.3,-55.8Z" transform="translate(100 100)" />
        </svg>
    )
  },
];

export function InteractiveIdeas() {
  return (
    <section
      id="interactive-ideas"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Interaktive Experimente aus dem "Hallo Welt"-Labor
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Spielen Sie mit unseren verrückten Ideen, die es ins Buch
              geschafft haben (oder hätten schaffen sollen). Jedes Tool ist ein
              Stück interaktiver Wahnsinn.
            </p>
          </div>
        </div>
        <div className="mt-16 space-y-24">
          {ideas.map((idea, i) => (
            <div
              key={idea.title}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div
                className={cn("relative aspect-square max-w-lg mx-auto w-full", i % 2 === 1 && "lg:order-last")}
              >
                {idea.shape}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-black">
                    <idea.icon className="h-16 w-16 mb-4" />
                    <h3 className="font-headline text-3xl font-bold text-balance">
                        {idea.title}
                    </h3>
                     <Badge variant="secondary" className="mt-2 text-sm">{idea.book}</Badge>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-4xl font-bold font-headline tracking-tight">
                  {idea.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed text-balance">
                  {idea.description}
                </p>
                <Link href={idea.link}>
                  <Button size="lg">
                    {idea.cta} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
