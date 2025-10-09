
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Coffee, Plus, Minus, AlertTriangle, Skull } from "lucide-react";

const coffeeEffects = [
  {
    type: "Filterkaffee",
    effect: "+ 10 % Basisfunktion",
    sideEffect: "Keine nennenswerten Nebenwirkungen.",
    icon: Plus,
    color: "text-green-500",
  },
  {
    type: "Espresso",
    effect: "+ 50 % Sprechgeschwindigkeit",
    sideEffect: "- 20 % Geduld. Vorsicht bei Nachfragen.",
    icon: Plus,
    color: "text-green-500",
  },
  {
    type: "Doppelter Espresso",
    effect: "+ 30 % Lautstärke",
    sideEffect: "Erhöhtes Risiko für spontane Monologe über die Jugend von heute.",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    type: "Entkoffeiniert",
    effect: "FATAL_ERROR",
    sideEffect: "Systemabsturz. Unmittelbare Evakuierung des Raumes empfohlen.",
    icon: Skull,
    color: "text-red-500",
  },
];

export function CoffeeCompatibility() {
  return (
    <section className="w-full py-8 md:py-12 bg-orange-100/70 dark:bg-orange-900/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Kaffee-Kompatibilitätskatalog
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Die richtige Treibstoffwahl ist entscheidend für einen reibungslosen Betrieb.
            </p>
          </div>
        </div>
        <Card className="max-w-4xl mx-auto mt-12">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5"/>
                    Leistungssteigerung durch Koffein
                </CardTitle>
                <CardDescription>offizielle Herstellerangaben</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kaffeetyp</TableHead>
                            <TableHead>Effekt</TableHead>
                            <TableHead>Nebenwirkung</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coffeeEffects.map((coffee) => (
                            <TableRow key={coffee.type}>
                                <TableCell className="font-semibold">{coffee.type}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <coffee.icon className={`w-4 h-4 ${coffee.color}`} />
                                        <span>{coffee.effect}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-foreground">{coffee.sideEffect}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
