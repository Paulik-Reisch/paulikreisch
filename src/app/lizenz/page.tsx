import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Book, Scale } from "lucide-react";

export default function LizenzPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-12">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                Lizenzierung & Weiternutzung
                </h1>
                <p className="text-lg text-muted-foreground mt-4 text-balance">
                Der (überraschend) seriöse Teil darüber, was Sie mit unseren geistigen Ergüssen tun dürfen und was nicht.
                </p>
            </div>

            <div className="space-y-6 p-8 border rounded-lg shadow-sm bg-card">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Book className="w-6 h-6 text-primary"/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-headline">Zitiervorschlag</h2>
                    <p className="text-muted-foreground mt-1">
                        Um unsere Werke korrekt zu zitieren, empfehlen wir folgende Quellenangaben. Ja, auch Satire will korrekt zitiert werden.
                    </p>
                </div>
              </div>
              <div className="pl-12 space-y-6">
                <div>
                    <h3 className="font-semibold text-foreground">Hallo Welt 1</h3>
                    <blockquote className="mt-2 border-l-2 pl-6 italic text-muted-foreground">
                        Paulik, P. und Reisch, M. (2023) <br/>
                        5. Auflage – Hallo Welt: Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S, [Seitenzahl(en)] <br/>
                        Verfügbar unter: www.paulik-reisch.de; ISBN 979-8-879-79169-3 <br/>
                        [Datum des Zugriffs]
                    </blockquote>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground">Hallo Welt 2</h3>
                    <blockquote className="mt-2 border-l-2 pl-6 italic text-muted-foreground">
                        Paulik, P. und Reisch, M. (2025) <br/>
                        1. Auflage – Hallo Welt 2: Wie das Leben funktioniert, [Seitenzahl(en)] <br/>
                        Verfügbar unter: www.paulik-reisch.de; ISBN 979-8-298-31897-6 <br/>
                        [Datum des Zugriffs]
                    </blockquote>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8 border rounded-lg shadow-sm bg-card">
                <div className="flex items-start gap-4">
                     <div className="p-2 bg-primary/10 rounded-full">
                        <Scale className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-headline">Lizenz</h2>
                         <p className="text-muted-foreground mt-1">
                            Dieses Werk steht unter einer Lizenz, die so kompliziert klingt, wie sie ist. Aber keine Sorge, wir haben es für Sie zusammengefasst.
                        </p>
                    </div>
                </div>

              <div className="pl-12 space-y-4 text-muted-foreground text-sm">
                <p>
                  Dieses Werk wird unter den Bedingungen der Creative Commons Attribution-Non-Commercial-ShareAlike 4.0 International Public License (nachfolgend »CC BY-NC-SA 4.0« oder »Lizenz«) zur Verfügung gestellt. Die vollständigen, authentischen und rechtsverbindlichen Lizenzbedingungen sind unter der offiziellen Webseite der Creative Commons in ihrer jeweils aktuellen Fassung abrufbar und bilden einen integralen Bestandteil dieser Lizenzvereinbarung.
                </p>
                <div className="text-center my-4">
                    <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.de" target="_blank" rel="noopener noreferrer">
                        <Badge variant="secondary" className="text-sm py-2 px-4 cursor-pointer hover:scale-105 transition-transform">
                            CC BY-NC-SA 4.0 Legal Code
                        </Badge>
                    </Link>
                </div>
                <p>
                  Die Lizenzgewährung erfolgt ausschließlich in dem Umfang und unter den Bedingungen, wie sie in der CC BY-NC-SA 4.0 expressis verbis festgelegt sind. Die vorliegenden Lizenzbestimmungen sind nicht erweiterbar, modifizierbar, einschränkbar oder auf Dritte übertragbar, es sei denn, dies ist ausdrücklich in der CC BY-NC-SA 4.0 vorgesehen. Jede Abweichung von den originären Creative Commons-Bestimmungen ist unwirksam und führt zum automatischen Erlöschen der Lizenzgewährung.
                </p>
                <p>
                  Abgeleitete Werke, Bearbeitungen oder sonstige auf diesem Werk basierende Schöpfungen unterliegen zwingend der identischen CC BY-NC-SA 4.0-Lizenzierung. Eine Lizenzierung unter kompatiblen, jedoch nicht identischen Creative Commons-Lizenzen ist ausgeschlossen.
                </p>
                <p>
                  Eine Wiederherstellung der Lizenzrechte erfolgt ausschließlich nach Maßgabe der Bestimmungen in Abschnitt 6(b) der CC BY-NC-SA 4.0. Die Haftung des Lizenzgebers ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit nicht zwingende gesetzliche Bestimmungen entgegenstehen.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
