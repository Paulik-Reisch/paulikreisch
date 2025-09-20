import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function AGBPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-8">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Allgemeine Geschäftsbedingungen (Das Kleingedruckte, das Sie nie lesen)
            </h1>
            <p className="text-lg text-muted-foreground">
              Herzlichen Glückwunsch zum Erwerb eines unserer Produkte. Mit dem Lesen dieser Zeile haben Sie Ihre Seele an uns verkauft. Hier sind die Details.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 1 Geltungsbereich</h2>
              <p className="text-muted-foreground">
                Diese AGB gelten für alles. Immer. Überall. Auch auf dem Mars. Sollten Sie versuchen, sie zu ignorieren, wird ein Team speziell trainierter Eichhörnchen entsandt, um Ihre Schnürsenkel zu zerkauen.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 2 Vertragsabschluss</h2>
              <p className="text-muted-foreground">
                Ein Vertrag kommt zustande, sobald Sie auch nur daran denken, unser Buch zu kaufen. Ihre Gedanken sind nicht privat. Wir haben ein Budget für telepathische Praktikanten.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 3 Haftungsausschluss</h2>
              <p className="text-muted-foreground">
                Wir haften für nichts. Absolut nichts. Sollte das Buch spontan in Flammen aufgehen, Ihnen schlechte Laune bereiten oder eine existenzielle Krise auslösen, ist das Ihr Problem. Wir haften auch nicht für Lachkrämpfe, die zu Muskelkater führen.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 4 Geistiges Eigentum</h2>
              <p className="text-muted-foreground">
                Alle Witze, absurden Ideen und Rechtschreibfehler in diesem Buch sind unser geistiges Eigentum. Jegliche unautorisierte Weiterverwendung wird mit der Pflicht bestraft, eine Woche lang nur Behördenformulare zu lesen.
              </p>
            </div>
             <div className="space-y-4">
                 <p className="text-xs text-muted-foreground">Stand: {new Date().toLocaleDateString('de-DE')}, wahrscheinlich schon wieder veraltet.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}