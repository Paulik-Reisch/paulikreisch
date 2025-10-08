
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils, Biohazard, Skull, Bomb, Drama, Droplets, FishOff } from "lucide-react";

const menu = [
    { day: "Montag", dish: "Graue Pampe mit Spurenelementen des gestrigen Tages", side: "dazu ein Glas lauwarmes Toilettenwasser.", icon: Skull },
    { day: "Dienstag", dish: "Überraschungs-Auflauf", side: "überraschend ist, dass es schmeckt. Zumindest fast.", icon: Bomb },
    { day: "Mittwoch", dish: "Fake-Fleisch-Fantasie in undefinierbarer Soße", side: "serviert mit Kartoffel-ähnlichem Erzeugnis.", icon: Drama },
    { day: "Donnerstag", subtitle: "Vegetarischer Tag", dish: "Gekochtes Wasser", side: "verfeinert mit einem Hauch von Nichts.", icon: Droplets },
    { day: "Freitag", dish: "Fischstäbchen-Fragment (Stückzahl: 1)", side: "dazu eine Remoulade aus dem letzten Jahrzehnt.", icon: FishOff },
];

export function CanteenMenu() {
    return (
        <section className="w-full py-8 md:py-12 bg-blue-200 dark:bg-blue-900/50">
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
                            <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4">
                                <div className="flex flex-col min-w-[120px]">
                                    <CardTitle className="text-lg font-headline">{item.day}</CardTitle>
                                    {item.subtitle && <CardDescription className="text-xs">{item.subtitle}</CardDescription>}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.dish}</p>
                                    <p className="text-sm text-muted-foreground">{item.side}</p>
                                </div>
                                <item.icon className="h-8 w-8 text-primary/70" />
                            </CardHeader>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>
    );
}
