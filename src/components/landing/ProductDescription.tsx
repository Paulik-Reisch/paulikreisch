import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function ProductDescription() {
  return (
    <section className="w-full py-12 md:py-16 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl grid gap-12">
          <div>
            <h2 className="text-3xl font-bold font-headline tracking-tight">
              Produktbeschreibung des Verlags
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p className="font-semibold text-lg">
                Hallo Welt – Stimmen einer Generation
              </p>
              <p>Zwischen Euphorie und Überforderung: Fragmente des Erwachsenwerdens</p>
              <p>
                „Hallo Welt“ ist ein Buch, das die Perspektiven junger Menschen in einer besonderen Übergangsphase einfängt – zwischen Schule und Erwachsenenwelt, zwischen vertrauter Heimat und der großen, oft chaotischen Wirklichkeit da draußen. Es ist keine lineare Erzählung, kein Roman mit fester Handlung, sondern eine Sammlung von Fragmenten, Eindrücken und Episoden, die wie Mosaiksteine zusammengesetzt werden. Dadurch entsteht ein Panorama des jugendlichen Daseins, in dem das Alltägliche und das Außergewöhnliche nebeneinanderstehen.
              </p>
              <p>
                Immer wieder schimmert das Spannungsfeld durch: die Euphorie des Aufbruchs auf der einen Seite, die Überforderung durch die Vielschichtigkeit der Welt auf der anderen.
              </p>
              <p>
                „Hallo Welt“ ist ein wie ein Zeitdokument: Es fängt die Sichtweise einer Generation ein, die in einer mediatisierten, globalisierten Welt erwachsen wird, und zeigt, wie sich die großen Themen – Klimawandel, Migration, Ungleichheit – ins Private einschreiben.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-headline tracking-tight mb-4">
              Produktinformation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="space-y-4">
                    <InfoItem label="ASIN" value="B0CVXT9X4J" />
                    <InfoItem label="Herausgeber" value="Independently published" />
                    <InfoItem label="Erscheinungstermin" value="17. Februar 2024" />
                    <InfoItem label="Sprache" value="Deutsch" />
                    <InfoItem label="Seitenzahl der Print-Ausgabe" value="106 Seiten" />
                </div>
                 <div className="space-y-4">
                    <InfoItem label="ISBN-13" value="979-8879791693" />
                    <InfoItem label="Abmessungen" value="12.5 x 0.61 x 19 cm" />
                    <InfoItem label="Buch 1 von 1" value="Hallo Welt" />
                    <InfoItem label="Amazon Bestseller-Rang">
                        <span>Nr. 4.695.821 in Bücher</span>
                        <ul className="list-disc pl-5 text-xs text-muted-foreground/80">
                            <li>Nr. 1.267 in Schreibkunst (Bücher)</li>
                            <li>Nr. 6.441 in Satire (Bücher)</li>
                            <li>Nr. 29.214 in Humoristisch</li>
                        </ul>
                    </InfoItem>
                    <InfoItem label="Kundenrezensionen">
                        <div className="flex items-center gap-2">
                             <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span>5,0 von 5 Sternen (5 Sternebewertungen)</span>
                        </div>
                    </InfoItem>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ label, value, children }: { label: string; value?: string, children?: React.ReactNode }) {
    return (
        <div>
            <p className="font-semibold">{label}</p>
            {value && <p className="text-muted-foreground">{value}</p>}
            {children && <div className="text-muted-foreground">{children}</div>}
        </div>
    )
}
