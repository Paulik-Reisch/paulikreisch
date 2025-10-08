
import { Check } from "lucide-react";

export function BookMosaic() {
  const points = [
    "Fragmentarische Episoden statt linearer Handlung – wie das echte Leben",
    "Satire, Kritik und Selbstironie im Stil einer rebellischen Generation",
    "Humorvoll, scharfzüngig und manchmal gnadenlos ehrlich",
    "Ein Buch, das Gesellschaftskritik mit Alltagskomik verwebt",
    "Voller bissiger Beobachtungen über Schule, Lehrer und Bürokratie",
    "Ein Buch, das man nicht in einem Rutsch liest – sondern immer wieder",
  ];

  return (
    <section className="w-full py-12 md:py-16" style={{ backgroundColor: '#e1e1e1' }}>
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-1 gap-12 items-center text-center">
           <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold font-headline tracking-tight">
                    Hallo Welt – Ein Mosaik der Jugend
                </h2>
            </div>
          <div className="space-y-4 max-w-3xl mx-auto text-left">
             <h3 className="text-2xl font-bold font-headline tracking-tight text-center">
                Darum solltest du Hallo Welt lesen
            </h3>
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
