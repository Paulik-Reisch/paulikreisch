
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Badge } from "../ui/badge";

const data = [
  { zone: "Quetsch-Zone", description: "Eingangsbereich. Persönlicher Raum ist ein Fremdwort. Überlebensrate: gering.", value: 100, fill: "#ef4444" },
  { zone: "Duft-Oase", description: "Neben der Tür. Eine Mischung aus altem Parfüm, Achselschweiß und dem Döner von gestern.", value: 100, fill: "#f97316" },
  { zone: "Bermuda-Dreieck", description: "Der Platz, an dem Schlüssel, Fahrkarten und die Hoffnung auf eine pünktliche Ankunft verschwinden.", value: 100, fill: "#eab308" },
  { zone: "VIP-Lounge", description: "Die unerreichbare letzte Reihe. Nur für Legenden, die den Endgegner-Busfahrer besiegt haben.", value: 100, fill: "#22c55e" },
];

export function BusAnatomyChart() {
  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Anatomie eines überfüllten Busses
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Eine Einteilung des Mikrokosmos auf Rädern.
            </p>
        </div>
        <Card className="max-w-4xl mx-auto mt-12 bg-muted/30">
            <CardHeader>
                <CardTitle>Bus-Zonen-Analyse</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="zone" hide />
                             <Tooltip 
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))"
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                labelStyle={{ fontWeight: "bold" }}
                                formatter={(value, name, props) => [props.payload.description, "Beschreibung"]}
                             />
                            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                                 <LabelList dataKey="zone" position="insideLeft" offset={10} fill="#fff" className="font-bold drop-shadow-md" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">Fahren Sie mit der Maus über die Balken, um die Zonen-Beschreibung zu lesen.</p>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
