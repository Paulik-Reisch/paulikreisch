import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils, Biohazard } from "lucide-react";

const menu = [
    { day: "Montag", dish: "Graue Pampe mit Spurenelementen des gestrigen Tages", side: "dazu ein Glas lauwarmes Leitungswasser." },
    { day: "Dienstag", dish: "Überraschungs-Auflauf", side: "überraschend ist, dass es schmeckt. Zumindest fast." },
    { day: "Mittwoch", dish: "Fake-Fleisch-Fantasie in undefinierbarer Soße", side: "serviert mit Kartoffel-ähnlichem Erzeugnis." },
    { day: "Donnerstag", dish: "Vegetarischer Tag: Gekochtes Wasser", side: "verfeinert mit einem Hauch von Nichts." },
    { day: "Freitag", dish: "Fischstäbchen-Fragment (Stückzahl: 1)", side: "dazu eine Remoulade aus dem letzten Jahrzehnt." },
];

export function CanteenMenu() {
    return (
        <section className="w-full py-12 md:py-16 bg-blue-200 dark:bg-blue-900/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                         <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                           Speiseplan der Anstalt
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                           Woche 42: "Kulinarische Grenzerfahrungen"
                        </p>
                    </div>
                </div>
                 <div className="mx-auto max-w-3xl mt-12 space-y-4">
                    {menu.map((item) => (
                        <Card key={item.day} className="bg-background/50">
                            <CardHeader className="grid grid-cols-[100px_1fr_auto] items-center gap-4 p-4">
                                <CardTitle className="text-lg font-headline">{item.day}</CardTitle>
                                <div>
                                    <p className="font-semibold">{item.dish}</p>
                                    <p className="text-sm text-muted-foreground">{item.side}</p>
                                </div>
                                <Biohazard className="h-6 w-6 text-destructive/50" />
                            </CardHeader>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>
    );
}
