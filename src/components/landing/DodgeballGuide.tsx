
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, EyeOff, Ghost, Users, Rabbit, ChevronDown } from "lucide-react";

const strategies = [
  {
    title: "Die menschliche Zielscheibe",
    description: "Suchen Sie sich den größten und langsamsten Mitschüler. Positionieren Sie sich direkt hinter ihm. Er wird zum lebenden Schutzschild, während Sie ungestört über den Sinn des Lebens nachdenken können.",
    icon: Shield,
  },
  {
    title: "Die Tarnkappe",
    description: "Binden Sie sich demonstrativ langsam die Schuhe. Wiederholen Sie diesen Vorgang, bis die Runde vorbei ist. Bonuspunkte, wenn Sie dabei einen überzeugend angestrengten Gesichtsausdruck aufsetzen.",
    icon: EyeOff,
  },
  {
    title: "Der Geist der Turnhalle",
    description: "Bewegen Sie sich exakt im Gleichschritt mit dem Schiedsrichter (Lehrer). Sie werden Teil seiner Aura und für die Werfer unsichtbar. Funktioniert am besten, wenn der Lehrer selbstvergessen Kaffee trinkt.",
    icon: Ghost,
  },
  {
    title: "Soziale Kernschmelze",
    description: "Starten Sie eine hitzige Debatte über ein kontroverses Thema (z.B. Ananas auf Pizza) mit Ihren Mitspielern. Während alle diskutieren, rollt der Ball unbeachtet ins Aus.",
    icon: Users,
  },
  {
    title: "Der plötzliche Anfall",
    description: "Simulieren Sie einen akuten Anfall von »Ball-Allergie« mit dramatischem Niesen und Juckreiz, sobald sich ein Ball nähert. Niemand wirft auf einen Kranken. Meistens.",
    icon: Rabbit,
  },
];

export function DodgeballGuide() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--bg-subtle-blue))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Die Kunst des unauffälligen Wegduckens
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Ein Völkerball-Strategie-Guide für Pazifisten und solche, die es werden wollen.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-12">
            <Accordion type="single" collapsible className="w-full space-y-4">
                {strategies.map((strategy, index) => (
                     <AccordionItem key={index} value={`item-${index}`} className="bg-background/70 border rounded-lg shadow-sm">
                        <AccordionTrigger className="text-left font-semibold px-6 hover:no-underline group">
                             <div className="flex items-center gap-3">
                                <strategy.icon className="h-6 w-6 text-primary shrink-0"/>
                                <span className="text-lg">{strategy.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="px-6 text-base">
                            <p className="text-muted-foreground">{strategy.description}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </section>
  );
}
