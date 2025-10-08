
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const bugs = [
  {
    code: "Error 404: Motivation Not Found",
    description: "Symptom: Starrer Blick, wiederholt Phrasen wie 'Das brauchen wir für die Klausur'.",
  },
  {
    code: "Error 502: Bad Gateway",
    description: "Symptom: Antwortet auf komplexe Fragen mit 'Das steht im Buch'. Lösung: auf einen anderen Lehrer hoffen.",
  },
  {
    code: "Infinite Loop: 'Ruhe jetzt!'",
    description: "Symptom: Wiederholt den Befehl in steigender Lautstärke, ohne das eigentliche Problem zu lösen.",
  },
];

export function TeacherBugs() {
  return (
    <section className="w-full py-8 md:py-12 bg-yellow-200/50 dark:bg-yellow-900/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Fehler im System: häufige Bugs
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Selbst der beste Code hat seine Schwachstellen. Hier sind die häufigsten Betriebsstörungen des Modells L-3H-R3R.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-3 lg:gap-8">
          {bugs.map((bug) => (
            <Card key={bug.code} className="transition-all duration-300 hover:shadow-lg hover:border-destructive/50 hover:bg-destructive/5 group/card">
              <CardHeader className="flex flex-row items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-destructive group-hover:animate-glitch" />
                <CardTitle className="font-mono text-base">{bug.code}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{bug.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
