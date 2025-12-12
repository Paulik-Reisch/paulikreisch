
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  MessageSquareQuote,
  Layers,
  FileCode,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GoList = [
  {
    title: "Seien Sie spezifisch",
    description: `Statt "ändere das Layout" formulieren Sie präzise: "Ändere das 3-spaltige Layout der 'Stimmen'-Sektion auf mobilen Geräten zu einer einzelnen Spalte."`,
  },
  {
    title: "Geben Sie Kontext",
    description: `Erwähnen Sie die Komponente oder den Abschnitt. "Im 'Warum Sie beide Bücher brauchen'-Abschnitt..." ist besser als "ändere das da unten".`,
  },
  {
    title: "Schritt für Schritt",
    description: `Bei komplexen Änderungen, teilen Sie diese in kleinere, logische Anweisungen auf. Erstens: Ändere die Farbe. Zweitens: Füge einen Rahmen hinzu.`,
  },
  {
    title: "Referenzieren Sie den Code",
    description: `Am besten ist es, wenn Sie den genauen Dateinamen und Code-Ausschnitt nennen: "Ändere in 'book-grid.tsx' die Klasse 'bg-blue-100' zu 'bg-blue-300'."`,
  },
];

const NoGoList = [
  {
    title: "Vage Anfragen",
    description: `Anweisungen wie "mach das schöner" oder "sieht komisch aus" sind subjektiv und nicht umsetzbar. Beschreiben Sie, was genau Sie als "schöner" empfinden (z.B. "größere Schrift", "mehr Abstand").`,
  },
  {
    title: "Mehrdeutigkeit",
    description: `Vermeiden Sie Sätze wie "Ändere den Button". Welcher von den zehn Buttons auf der Seite ist gemeint? Seien Sie präzise: "Ändere den 'Jetzt Kaufen'-Button in der Hero-Sektion."`,
  },
  {
    title: "Falsche Annahmen",
    description: `Gehen Sie nicht davon aus, dass die KI weiß, was Sie "meinen". Die KI versteht nur, was Sie explizit "sagen".`,
  },
  {
    title: "Widersprüchliche Anweisungen",
    description: `Vermeiden Sie widersprüchliche Befehle wie "Mach den Text größer und sorge dafür, dass er weniger Platz einnimmt."`,
  },
];

export default function AnleitungPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <header className="text-center mb-16">
            <Badge>Anleitung</Badge>
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mt-4">
              Effektive Kommunikation mit einem KI-Assistenten
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ein Leitfaden für präzise, umsetzbare Anweisungen zur
              Webseiten-Entwicklung.
            </p>
          </header>

          <div className="space-y-16">
            {/* Go's Section */}
            <section>
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3 mb-8">
                <CheckCircle2 className="text-green-600 w-8 h-8" />
                Die Do's: Empfohlene Vorgehensweisen
              </h2>
              <div className="grid gap-6">
                {GoList.map((item, index) => (
                  <Card key={index} className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* No-Go's Section */}
            <section>
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3 mb-8">
                <XCircle className="text-red-600 w-8 h-8" />
                Die Don'ts: Zu vermeidende Fehler
              </h2>
              <div className="grid gap-6">
                {NoGoList.map((item, index) => (
                  <Card key={index} className="bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Pro-Tipps Section */}
            <section>
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3 mb-8">
                <Lightbulb className="text-yellow-500 w-8 h-8" />
                Pro-Tipps für maximale Effizienz
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Verwenden Sie Beispiele:</strong> Anstatt eine Farbe zu beschreiben,
                  geben Sie einen Hex-Code an (`#FF5733`) oder referenzieren Sie
                  eine bestehende Farbe ("das Blau aus dem Logo").
                </p>
                <p>
                  <strong className="text-foreground">Nutzen Sie Zitate:</strong> Wenn Sie Text ändern möchten, zitieren Sie
                  den exakten alten Text und geben Sie den exakten neuen Text an.
                  Das verhindert Missverständnisse.
                </p>
                <p>
                  <strong className="text-foreground">Denken Sie in Komponenten:</strong> Moderne Webentwicklung ist
                  komponentenbasiert. Wenn Sie eine Änderung an einem wiederkehrenden
                  Element (wie einem Button oder einer Karte) wünschen, erwähnen Sie,
                  dass es sich um die Komponente handelt.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
