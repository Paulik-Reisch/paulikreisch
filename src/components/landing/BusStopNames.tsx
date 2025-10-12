
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Hospital, Factory, AlertCircle } from "lucide-react";

const stops = [
  { name: "Am Rande des Nervenzusammenbruchs", icon: AlertCircle },
  { name: "Letzte Hoffnung", description: "(Krankenhaus)", icon: Hospital },
  { name: "Paralleluniversum", description: "(Industriegebiet)", icon: Factory },
];

export function BusStopNames() {
  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Die wahren Haltestellennamen
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Eine ehrliche Umbenennung der Stationen auf Ihrer täglichen Odyssee.
            </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 grid gap-8 md:grid-cols-3">
            {stops.map((stop, index) => (
                <Card key={index} className="flex flex-col text-center items-center p-6 bg-muted/20">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                        <stop.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-lg text-balance">{stop.name}</CardTitle>
                    {stop.description && (
                        <CardDescription>{stop.description}</CardDescription>
                    )}
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
