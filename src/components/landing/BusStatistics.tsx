
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Percent, Clock, CloudSmoke } from "lucide-react"

const stats = [
    {
        value: "98%",
        label: "aller 'Haltewunsch'-Knöpfe sind Placebos.",
        icon: Percent
    },
    {
        value: "100%",
        label: "Wahrscheinlichkeit, dass der Bus genau dann kommt, wenn Sie sich eine Zigarette anstecken.",
        icon: CloudSmoke
    },
    {
        value: "3 Sek.",
        label: "Zeitfenster zwischen 'Tür schließt' und 'Fahrer gibt Vollgas'.",
        icon: Clock
    }
]

export function BusStatistics() {
    return (
        <section className="w-full py-8 md:py-12 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                        Statistiken, die Sie nicht kannten (aber fühlen)
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                        Wissenschaftlich bewiesen durch das Institut für gefühlte Wahrheiten.
                    </p>
                </div>
                 <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-3 lg:gap-8">
                    {stats.map((stat, index) => (
                         <Card key={index} className="flex flex-col text-center items-center justify-center p-6 bg-muted/40">
                             <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <stat.icon className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-4xl font-bold font-mono text-primary">{stat.value}</p>
                            <p className="text-sm text-muted-foreground mt-2 text-balance">{stat.label}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
