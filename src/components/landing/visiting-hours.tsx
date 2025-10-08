
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function VisitingHours() {
  return (
    <section className="w-full py-8 md:py-12 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
              Besuchszeiten & Regelwerk
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
              Offizielle Anordnung für den Elternsprechtag. Disziplin ist der Schlüssel zum Erfolg.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-4xl items-start gap-8 py-12 md:grid-cols-2">
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Offizielle Sprechzeiten
              </CardTitle>
              <CardDescription>
                Pro Insasse sind 7,5 Minuten Besuchszeit angesetzt. Jede Sekunde
                darüber hinaus wird dem Notenkonto angelastet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 font-mono text-lg text-foreground">
                 <div>
                    <p><strong>Nächster Termin:</strong></p>
                    <p>29. Februar 2025</p>
                </div>
                <div>
                    <p><strong>Uhrzeit (Gruppe A-K):</strong></p>
                    <p>15:00 - 15:07 Uhr</p>
                </div>
                <div>
                    <p><strong>Uhrzeit (Gruppe L-Z):</strong></p>
                    <p>15:08 - 15:15 Uhr</p>
                </div>
                <p className="text-sm text-yellow-500 dark:text-yellow-400 font-sans">
                  Pünktlichkeit ist eine Tugend, Verspätung ein Vergehen!
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-headline flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" /> Erlaubte
                Gesprächsthemen
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Das Wetter (nur neutrale Bemerkungen)</li>
                <li>Lobpreisungen für das Bildungssystem</li>
                <li>Angebote zur Erhöhung des Kopiergeldes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-red-500" /> Verbotene
                Gesprächsthemen
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Fragen nach dem Wohlbefinden des Insassen</li>
                <li>Diskussionen über "Gefühle" oder "Kreativität"</li>
                <li>Andeutungen über ein Leben außerhalb der Anstalt</li>
                <li>Jegliche Form von Humor</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
            <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg" variant="outline">
                    Das vollständige Regelwerk im Buch nachlesen <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
