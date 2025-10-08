
import { Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


export function EscapeAttempt() {
    return (
        <section className="w-full py-12 md:py-16 bg-pink-100 dark:bg-pink-900/30">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                           Ausbruchsversuch des Monats
                        </h2>
                    </div>
                </div>
                 <div className="mx-auto max-w-2xl mt-12">
                    <Card className="bg-background/50 text-center">
                        <CardHeader>
                            <Award className="h-12 w-12 mx-auto text-yellow-500" />
                            <CardTitle className="font-headline text-2xl mt-2">Insasse F. und die Zimmerpflanze</CardTitle>
                             <CardDescription>ein Akt stillen Protests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg text-muted-foreground text-balance">
                                Insasse F. versuchte, sich als verwelkte Zimmerpflanze aus dem Biologieraum zu schmuggeln. Der Plan scheiterte, als der Hausmeister ihn zu gießen versuchte. Er wurde zu zwei Wochen Tafeldienst und zur Teilnahme am Gärtnerei-Kurs verurteilt.
                            </p>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </section>
    );
}
