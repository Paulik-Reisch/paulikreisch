
import { Check } from "lucide-react";

export function BookMosaic() {
  const points = [
    "Einzelne Episoden statt einer in sich geschlossenen Handlung – wie das echte Leben",
    "Satire, Kritik und Selbstironie im Stil einer rebellischen Generation",
    "Humorvoll, scharfzüngig und zumeist gnadenlos ehrlich",
    "Ein Buch, das Gesellschaftskritik mit Alltagskomik verwebt",
    "Voller bissiger Beobachtungen über Schule, Lehrer und Bürokratie",
    "Ein Buch, das man nicht in einem Rutsch liest – sondern immer wieder",
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-muted text-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-1 gap-12 items-center text-center">
           <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold font-headline tracking-tight">
                    Darum solltest du Hallo Welt lesen
                </h2>
            </div>
          <div className="space-y-4 max-w-3xl mx-auto text-left">
            <ul className="space-y-3">
              {points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
