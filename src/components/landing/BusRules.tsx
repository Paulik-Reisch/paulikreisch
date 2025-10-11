
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gavel, Siren, Scale } from "lucide-react";

const rules = [
  "Derjenige, der am dringendsten aussteigen muss, sitzt immer ganz hinten am Fenster.",
  "Die Notwendigkeit des Festhaltens ist umgekehrt proportional zur Anzahl freier Hände.",
  "Der 'Haltewunsch'-Knopf dient primär der psychologischen Kriegsführung und hat keinen Einfluss auf den Bremsvorgang.",
  "Die freie Fläche neben dir wird erst besetzt, wenn der Bus eine Personendichte von 17 Menschen pro Quadratmeter erreicht hat.",
  "Die Lautstärke deiner Kopfhörer muss mindestens so hoch sein, dass der Sitznachbar den Liedtext mitsingen kann.",
  "Jede Tasche auf einem Sitzplatz ist ein heiliges Territorium und darf nur mit einem richterlichen Beschluss angefochten werden."
];

export function BusRules() {
  return (
    <section className="w-full py-8 md:py-12 bg-blue-200 dark:bg-blue-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Die ungeschriebenen Bus-Gesetze
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance italic">
              Gesammelt und aufbereitet vom Institut für angewandte Nahverkehrs-Soziologie.
            </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
          <Card className="border-2 border-dashed border-destructive/50 bg-background shadow-lg">
            <CardHeader className="text-center">
                <Gavel className="w-12 h-12 mx-auto text-destructive" />
                <CardTitle className="font-headline text-2xl mt-2">Beförderungsordnung §42</CardTitle>
                <CardDescription>Auszug aus den allgemeinen Beförderungsbedingungen</CardDescription>
            </CardHeader>
            <CardContent>
                <ol className="list-decimal list-outside pl-6 space-y-4 text-left">
                    {rules.map((rule, index) => (
                        <li key={index} className="text-muted-foreground pl-2">{rule}</li>
                    ))}
                </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
