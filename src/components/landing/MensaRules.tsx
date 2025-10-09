
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gavel, Siren, Scale } from "lucide-react";

const rules = [
  "Kauen ist nur mit schriftlicher Genehmigung gestattet. Das Formular B-17 ist eine Woche im Voraus einzureichen.",
  "Jeglicher Augenkontakt mit dem Küchenpersonal ist als Provokation zu werten und wird mit extra Brokkoli bestraft.",
  "Beschwerden über die Nahrungsqualität werden alphabetisch sortiert und anschließend ignoriert.",
  "Das Tauschen von Speisekomponenten ist strengstens untersagt und stellt einen Akt der Rebellion dar.",
  "Positive Äußerungen über das Essen führen zu sofortigem Misstrauen und einer Überprüfung Ihrer geistigen Gesundheit.",
  "Das Verlassen von Resten auf dem Teller ist erwünscht. Es dient der morgigen Soßengrundlage."
];

export function MensaRules() {
  return (
    <section className="w-full py-8 md:py-12 bg-blue-200 dark:bg-blue-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Das offizielle Mensa-Regelwerk
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Anordnung 3A-§42. Unwissenheit schützt vor Strafe nicht.
            </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
          <Card className="border-2 border-dashed border-destructive/50 bg-background shadow-lg">
            <CardHeader className="text-center">
                <Siren className="w-12 h-12 mx-auto text-destructive" />
                <CardTitle className="font-headline text-2xl mt-2">ANORDNUNG</CardTitle>
                <CardDescription>Verhaltensvorschriften für die Nahrungsaufnahme</CardDescription>
            </CardHeader>
            <CardContent>
                <ol className="list-decimal list-outside pl-6 space-y-4 text-left">
                    {rules.map((rule, index) => (
                        <li key={index} className="text-muted-foreground pl-2">{rule}</li>
                    ))}
                </ol>
                <p className="text-xs text-center mt-6 text-muted-foreground font-semibold">
                    Gezeichnet, die Anstaltsleitung.
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
