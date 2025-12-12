
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
    title: "Seien Sie spezifisch (Specific)",
    description: `Statt "ändere das Layout" formulieren Sie präzise: "Ändere das 3-spaltige Layout der 'Stimmen'-Sektion auf mobilen Geräten zu einer einzelnen Spalte und sorge dafür, dass die Elemente zentriert sind."`,
    example: `Gut: "Ändere die Hintergrundfarbe des Buttons in der Komponente 'BookCTA' zu 'hsl(var(--primary))'."\nSchlecht: "Mach den Button blau."`
  },
  {
    title: "Geben Sie Kontext (Contextual)",
    description: `Referenzieren Sie explizit Dateien, Komponenten oder UI-Abschnitte. "In 'src/components/landing/WhyBoth.tsx', ersetze das Icon 'CheckCircle' durch 'BookCopy'." ist unmissverständlich.`,
    example: `Gut: "In der 'Hero'-Komponente ('src/components/landing/hero.tsx'), vergrößere die Schrift der h1-Überschrift auf 'text-6xl'."\nSchlecht: "Die Überschrift ist zu klein."`
  },
  {
    title: "Formulieren Sie atomar (Atomic)",
    description: `Zerlegen Sie komplexe Änderungen in kleinere, logische Anweisungen. Anstatt "Überarbeite das ganze Design", geben Sie schrittweise Anweisungen: 1. Ändere die Primärfarbe in globals.css. 2. Passe die Schriftart für Überschriften an. 3. Ändere die Eckenradien der Karten.`,
    example: `Gut: "1. Füge einen Schatten 'shadow-lg' zur Card-Komponente in 'src/components/ui/card.tsx' hinzu. 2. Erhöhe den Innenabstand auf 'p-8'."\nSchlecht: "Die Karte soll mehr hervorstechen."`
  },
  {
    title: "Beschreiben Sie das 'Warum' (Intentional)",
    description: `Erklären Sie das Ziel Ihrer Änderung. "Ich möchte den CTA-Button stärker hervorheben, um die Konversionsrate zu erhöhen. Mach ihn größer und verwende eine Kontrastfarbe." Dies gibt der KI einen 'Vibe' und ermöglicht bessere Design-Entscheidungen.`,
    example: `Gut: "Die Seite wirkt zu unruhig. Reduziere die Anzahl der Schriftarten auf zwei: eine für Überschriften, eine für Text."\nSchlecht: "Die Schriftarten gefallen mir nicht."`
  },
];

const NoGoList = [
  {
    title: "Vage und subjektive Anweisungen",
    description: `Anweisungen wie "mach das schöner", "verbessere das UI" oder "sieht komisch aus" sind nicht quantifizierbar und führen zu zufälligen Ergebnissen. Beschreiben Sie stattdessen, was Sie als "schöner" empfinden (z.B. "Verwende einen größeren Abstand zwischen den Elementen", "harmonisiere die Farbpalette").`,
    example: `Schlecht: "Die Navigation ist langweilig."\nBesser: "Füge einen leichten Schatten und einen Hover-Effekt zur Navigation in 'src/components/landing/header.tsx' hinzu."`
  },
  {
    title: "Mehrdeutigkeit und fehlende Referenzen",
    description: `Vermeiden Sie Sätze wie "Ändere den Button". Welcher der zehn Buttons auf der Seite ist gemeint? Seien Sie präzise: "Ändere den 'Jetzt Kaufen'-Button in der Hero-Sektion."`,
    example: `Schlecht: "Entferne das Bild."\nBesser: "Entferne das Bild mit der 'src' 'https://placehold.co/1920x1080.png' aus der 'HeroSeries'-Komponente."`
  },
  {
    title: "Implizites Wissen voraussetzen",
    description: `Gehen Sie nicht davon aus, dass die KI weiß, was Sie "meinen" oder welche Design-Trends gerade angesagt sind. Die KI operiert ausschließlich auf Basis der von Ihnen bereitgestellten Informationen und des bestehenden Codes.`,
    example: `Schlecht: "Mach das im 'neuen Apple-Stil'."\nBesser: "Implementiere einen Glasmorphismus-Effekt für die Card-Komponente, indem du einen 'backdrop-blur-sm' und einen halbtransparenten Hintergrund hinzufügst."`
  },
  {
    title: "Widersprüchliche Anweisungen",
    description: `Vermeiden Sie widersprüchliche Befehle wie "Mach den Text größer und sorge gleichzeitig dafür, dass er weniger Platz einnimmt." Definieren Sie klare Prioritäten.`,
    example: `Schlecht: "Die Box soll unauffällig, aber auch ein Blickfang sein."\nBesser: "Die Box soll einen dezenten Rahmen haben, aber der Text darin soll durch eine kräftige Farbe auffallen."`
  },
];

export default function AnleitungPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <header className="text-center mb-16">
            <Badge>Dokumentation</Badge>
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mt-4">
              Effektive Kommunikation mit einem KI-Assistenten
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Ein Leitfaden für präzise, umsetzbare Anweisungen in der KI-gestützten Web-Entwicklung. Von den Grundlagen des Promptings bis zum fortgeschrittenen Context Engineering.
            </p>
          </header>

          <article className="prose dark:prose-invert prose-lg max-w-none">
            <section>
                <h2>1. Einleitung: Die neue Ära des "Vibecoding"</h2>
                <p>
                    Wir treten in eine neue Phase der Softwareentwicklung ein. Die Interaktion mit einem KI-Assistenten ist kein reiner Befehl-Antwort-Zyklus mehr. Es ist ein Dialog, eine Kollaboration. Wir nennen diesen Prozess <strong>"Vibecoding"</strong>: die Fähigkeit, nicht nur eine Anweisung, sondern eine Intention, eine Ästhetik – einen "Vibe" – zu kommunizieren. Dieses Dokument dient als Ihr Handbuch, um diese neue Sprache fließend zu beherrschen.
                </p>
            </section>

            <section>
                <h2>2. Die Grundpfeiler erfolgreicher KI-Kollaboration</h2>
                <p>Jede erfolgreiche Interaktion mit einem KI-Entwicklungsassistenten basiert auf zwei fundamentalen Prinzipien:</p>
                <ul>
                    <li><strong>Kontext-Integrität (Context Integrity):</strong> Die KI kennt nur, was Sie ihr sagen und was im bereitgestellten Code steht. Ein vollständiger und präziser Kontext ist die absolute Voraussetzung für ein qualitativ hochwertiges Ergebnis. Fehlender Kontext führt zu Annahmen, und Annahmen führen zu Fehlern.</li>
                    <li><strong>Anweisungs-Präzision (Instructional Precision):</strong> Die KI interpretiert Ihre Anweisungen wörtlich. Mehrdeutigkeit, Subjektivität und Umgangssprache sind die Hauptursachen für unerwartete Ergebnisse. Präzision ist kein "Nice-to-have", sondern eine Notwendigkeit.</li>
                </ul>
            </section>
            
            <section>
                <h2>3. Deep Context Engineering: Die Kunst, der KI ein Gehirn zu geben</h2>
                <p>
                    Bevor Sie eine einzige Zeile Anweisung schreiben, müssen Sie sicherstellen, dass die KI über denselben Wissensstand verfügt wie Sie. Diesen Prozess nennen wir "Deep Context Engineering".
                </p>
                
                <h3>3.1 Projekt-Kontext</h3>
                <p>Die KI muss das "Big Picture" verstehen. Dazu gehören:</p>
                <ul>
                    <li><strong>Tech-Stack:</strong> "Wir verwenden Next.js mit dem App Router, TypeScript und Tailwind CSS."</li>
                    <li><strong>Design-System:</strong> "Das Design basiert auf ShadCN-Komponenten. Primärfarben und Radien sind in `tailwind.config.ts` und `globals.css` definiert."</li>
                    <li><strong>Zielgruppe & Tonalität:</strong> "Die Zielgruppe ist jung und technikaffin. Die Tonalität ist humorvoll und satirisch, ähnlich dem Stil des Buches 'Hallo Welt'."</li>
                </ul>

                <h3>3.2 Aufgaben-Kontext</h3>
                <p>Für jede spezifische Aufgabe benötigt die KI detaillierte Informationen:</p>
                <ul>
                    <li><strong>Dateipfade:</strong> Immer den vollständigen Pfad zur relevanten Datei angeben (z.B. `src/components/landing/hero.tsx`).</li>
                    <li><strong>Komponentennamen:</strong> Nennen Sie die exakten Namen von React-Komponenten, die Sie ändern möchten (`<Hero />`, `<CtaBanner />`).</li>
                    <li><strong>Code-Ausschnitte:</strong> Um Missverständnisse auszuschließen, zitieren Sie den exakten Code, den Sie ändern möchten, und stellen Sie den neuen Code bereit.</li>
                </ul>

                <h3>3.3 Negativer Kontext</h3>
                <p>Genauso wichtig wie das, was die KI tun soll, ist das, was sie NICHT tun soll.</p>
                <ul>
                    <li><strong>Einschränkungen:</strong> "Ändere das Layout, aber fasse die `package.json` nicht an."</li>
                    <li><strong>Tabus:</strong> "Füge keine neuen Farbtöne hinzu, sondern verwende ausschließlich die in `globals.css` definierten CSS-Variablen wie `hsl(var(--primary))`."</li>
                </ul>
            </section>


            <section>
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3 mb-8 mt-16">
                <CheckCircle2 className="text-green-600 w-8 h-8" />
                4. Die Anatomie eines perfekten Prompts: Do's
              </h2>
              <div className="grid gap-6 not-prose">
                {GoList.map((item, index) => (
                  <Card key={index} className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                      <pre className="mt-4 p-3 bg-black/70 text-white rounded-md text-xs whitespace-pre-wrap"><code className="language-diff">{item.example}</code></pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3 mb-8 mt-16">
                <XCircle className="text-red-600 w-8 h-8" />
                5. Häufige Fehlerquellen: Don'ts
              </h2>
              <div className="grid gap-6 not-prose">
                {NoGoList.map((item, index) => (
                  <Card key={index} className="bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                       <pre className="mt-4 p-3 bg-black/70 text-white rounded-md text-xs whitespace-pre-wrap"><code className="language-diff">{item.example}</code></pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

             <section>
                <h2 className="mt-16">6. Fallstudie: Von einer vagen Idee zur konkreten Umsetzung</h2>
                <p>Analysieren wir eine typische, aber problematische Anfrage und transformieren sie in einen perfekten Prompt.</p>
                
                <h4>Szenario 1: Der "fade Button"</h4>
                <p><strong>Ursprüngliche Anfrage (Schlecht):</strong></p>
                <blockquote>"Der 'Jetzt kaufen'-Button ist langweilig. Pepp den mal auf."</blockquote>
                <p><strong>Analyse des Problems:</strong> "Langweilig" und "aufpeppen" sind subjektiv. Die KI hat keine Ahnung, was das bedeutet. Handelt es sich um Farbe, Größe, Animation oder alles zusammen? Welcher der vielen "Jetzt kaufen"-Buttons ist gemeint?</p>

                <p><strong>Optimierter Prompt (Gut):</strong></p>
                <blockquote>
                    <p>Führe folgende Änderungen in der Datei `src/components/landing/hero.tsx` durch:</p>
                    <p>1. Finde den `Button`, der zum Link `/buchhandlung-paulik-reisch` gehört.</p>
                    <p>2. Ändere seine `variant` von "secondary" auf "default", um unsere primäre Markenfarbe zu verwenden.</p>
                    <p>3. Füge dem Button die Tailwind-Klasse `animate-pulse` hinzu, um eine subtile, aufmerksamkeitsstarke Animation zu erzeugen.</p>
                    <p>Ziel ist es, den primären Call-to-Action auf der Startseite visuell stärker zu betonen.</p>
                </blockquote>
                <p><strong>Ergebnis:</strong> Die KI hat eine klare, unmissverständliche und atomare Anweisung erhalten. Sie kennt den genauen Ort (`hero.tsx`), das Ziel (`Button`), die spezifischen Änderungen (Variante, CSS-Klasse) und sogar die Intention dahinter. Das Ergebnis ist vorhersagbar und qualitativ hochwertig.</p>
            </section>

            <section>
                <h2 className="mt-16">7. Schlussfolgerung: Sie sind der Dirigent</h2>
                <p>
                    Betrachten Sie den KI-Assistenten als ein extrem talentiertes, aber absolut gehorsames Orchester. Es kann jede Symphonie spielen, aber nur, wenn Sie die Partitur liefern. Ihre Fähigkeit, präzisen Kontext und klare Anweisungen zu geben – also "Vibecoding" zu beherrschen – ist der Taktstock, der aus bloßem Lärm eine meisterhafte Komposition macht.
                </p>
            </section>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
