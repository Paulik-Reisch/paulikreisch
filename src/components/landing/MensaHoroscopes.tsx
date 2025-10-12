
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Soup, Cloudy } from "lucide-react";

const horoscopes = [
    {
        title: "Wassermann (21.01. - 19.02.)",
        prediction: "Sie sehnen sich nach Freiraum. Die Sterne sehen eine leere Sitzreihe für Sie – leider im Bus, der in die Gegenrichtung fährt.",
        color: "border-blue-300 bg-blue-50"
    },
    {
        title: "Stier (21.04. - 20.05.)",
        prediction: "Ihre Geduld wird heute auf die Probe gestellt. Ein Rucksack-Rambo wird Ihren persönlichen Raum neu definieren. Bleiben Sie standhaft (Sie haben keine andere Wahl).",
        color: "border-green-300 bg-green-50"
    },
    {
        title: "Zwillinge (21.05. - 21.06.)",
        prediction: "Ihre kommunikative Art hilft Ihnen heute: Sie schaffen es, den Busfahrer zu überzeugen, dass 'kurz vor der Ampel' eine offizielle Haltestelle ist.",
        color: "border-yellow-300 bg-yellow-50"
    }
];

export function MensaHoroscopes() {
  return (
    <section className="w-full py-8 md:py-12 bg-red-200 dark:bg-red-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Ihr Pendler-Horoskop
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Was die Sterne über Ihre heutige Busfahrt verraten. Spoiler: Nichts Gutes.
            </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 grid gap-8 md:grid-cols-3">
            {horoscopes.map((horoscope, index) => (
                 <Card key={index} className={`flex flex-col text-center ${horoscope.color} dark:bg-neutral-800`}>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">{horoscope.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{horoscope.prediction}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
