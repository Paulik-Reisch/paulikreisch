
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Soup, Cloudy } from "lucide-react";

const horoscopes = [
    {
        title: "Wassermann (21.01. - 19.02.)",
        prediction: "Ihre kreative Ader wird heute auf die Probe gestellt, wenn Sie versuchen herauszufinden, ob das auf Ihrem Teller Fisch oder Hühnchen ist. Tipp: Es ist keins von beiden.",
        color: "border-blue-300 bg-blue-50"
    },
    {
        title: "Stier (21.04. - 20.05.)",
        prediction: "Sie schätzen Beständigkeit. Gut für Sie, denn der Kartoffelbrei hat dieselbe Konsistenz wie letzte Woche. Und die Woche davor.",
        color: "border-green-300 bg-green-50"
    },
    {
        title: "Zwillinge (21.05. - 21.06.)",
        prediction: "Ihre gespaltene Persönlichkeit ist heute ein Vorteil. Der eine Teil kann das Hauptgericht essen, der andere die Beilage. Zusammen schaffen Sie es vielleicht.",
        color: "border-yellow-300 bg-yellow-50"
    }
];

export function MensaHoroscopes() {
  return (
    <section className="w-full py-8 md:py-12 bg-red-200 dark:bg-red-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Ihr kulinarisches Horoskop
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Was die Sterne über Ihr heutiges Mittagessen verraten. Spoiler: Nichts Gutes.
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
