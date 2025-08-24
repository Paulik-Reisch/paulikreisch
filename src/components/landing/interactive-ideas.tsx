import {
  BrainCircuit,
  FileText,
  Train,
  Sparkles,
  Gamepad2,
  Home,
  Dices,
  Clock,
  MessageCircle,
  BookText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

const ideas = [
  {
    icon: FileText,
    title: "Bürokratie-Generator",
    description: "Erhalten Sie auf Knopfdruck ein absurd langes und sinnloses Behörden-Antwortschreiben. Effizienz, wie sie im Buche steht.",
    link: "/lp-buerokratie-generator",
    cta: "Antrag generieren",
    status: "live",
    book: "Hallo Welt 2"
  },
  {
    icon: BrainCircuit,
    title: "Lehrer-Noten-Simulator",
    description: "Geben Sie Ihren Namen ein und erhalten Sie ein völlig absurdes Schulzeugnis, das Ihre wahren Talente (wie Pausenbrot-Management) würdigt.",
    link: "/lp-lehrer-noten-simulator",
    cta: "Zeugnis erhalten",
    status: "live",
    book: "Hallo Welt"
  },
  {
    icon: Train,
    title: "Deutsche Bahn Ausreden-Bot",
    description: "Warum hat Ihr Zug Verspätung? Unser Bot liefert Ihnen die kreativsten und absurdesten Ausreden, direkt aus der Konzernzentrale.",
    link: "/lp-db-ausreden-bot",
    cta: "Ausrede würfeln",
    status: "live",
    book: "Hallo Welt 2"
  },
  {
    icon: Sparkles,
    title: "Satire-Typ-Test",
    description: "Welche Katastrophenfigur aus dem 'Hallo Welt'-Universum sind Sie? Machen Sie den Test und teilen Sie Ihr traumatisches Ergebnis.",
    link: "#",
    cta: "Test starten",
    status: "coming-soon",
    book: "Hallo Welt"
  },
  {
    icon: Gamepad2,
    title: "Schulhof-Survival-Game",
    description: "Weichen Sie dem Mensa-Essen aus, meiden Sie Lehrer und erwischen Sie den Bus. Ein Spiel, das Sie nicht gewinnen können.",
    link: "#",
    cta: "Spiel starten",
    status: "coming-soon",
    book: "Hallo Welt"
  },
  {
    icon: Home,
    title: "Mietenwahnsinn-Rechner",
    description: "Was kostet ein 4qm-Zimmer ohne Fenster in Ihrer Stadt? Finden Sie es heraus (und weinen Sie leise).",
    link: "/lp-mietenwahnsinn",
    cta: "Miete berechnen",
    status: "live",
    book: "Hallo Welt 2"
  },
  {
    icon: Dices,
    title: "Schulzeit-Roulette",
    description: "Welche Katastrophe trifft Sie heute? Von lebendigem Mensa-Essen bis zu Mathe-Tests ohne Ende.",
    link: "#",
    cta: "Katastrophe wählen",
    status: "coming-soon",
    book: "Hallo Welt"
  },
  {
    icon: Clock,
    title: "Beamten-Wartezeiten-Simulator",
    description: "Erleben Sie die beruhigende Wirkung einer endlosen Warteschleife. Ihr Antrag wird geprüft... vielleicht.",
    link: "#",
    cta: "Warten starten",
    status: "coming-soon",
    book: "Hallo Welt 2"
  },
  {
    icon: MessageCircle,
    title: "KI-Chat mit Max & Philipp",
    description: "Fragen Sie die Autoren alles, was Sie schon immer wissen wollten. Erwarten Sie keine hilfreichen Antworten.",
    link: "#",
    cta: "Chat starten",
    status: "coming-soon",
    book: "Hallo Welt 2"
  },
  {
    icon: BookText,
    title: "Kapitel-Fußnoten-Generator",
    description: "Erfinden Sie zu jedem Thema eine pseudo-wissenschaftliche Fußnote im unverkennbaren Stil des Buches.",
    link: "/lp-fussnoten-generator",
    cta: "Fußnote generieren",
    status: "live",
    book: "Hallo Welt"
  },
];


export function InteractiveIdeas() {
  return (
    <section id="interactive-ideas" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Interaktive Experimente aus dem "Hallo Welt"-Labor</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Spielen Sie mit unseren verrückten Ideen, die es ins Buch geschafft haben (oder hätten schaffen sollen). Jedes Tool ist ein Stück interaktiver Wahnsinn.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-6 py-12 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {ideas.map((idea) => (
                <Card key={idea.title} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                     <CardHeader className="relative">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <idea.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="font-headline text-xl">{idea.title}</CardTitle>
                            </div>
                           
                        </div>
                        <Badge variant="outline" className="absolute top-4 right-4">{idea.book}</Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{idea.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2">
                        {idea.status === 'live' ? (
                             <Link href={idea.link} className="w-full">
                                <Button className="w-full">{idea.cta}</Button>
                            </Link>
                        ) : (
                            <Button className="w-full" disabled>{idea.cta}</Button>
                        )}
                       
                         {idea.status === 'coming-soon' && (
                           <p className="text-xs text-center w-full text-muted-foreground">Kommt bald... (vielleicht)</p>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
