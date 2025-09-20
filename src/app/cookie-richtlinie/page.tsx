import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";

export default function CookieRichtliniePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-8">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Cookie-Richtlinie
            </h1>
            <p className="text-lg text-muted-foreground">
              Die schockierende Wahrheit über die digitalen Krümel, die wir auf Ihrem Computer hinterlassen.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">Was zum Teufel ist ein Cookie?</h2>
              <p className="text-muted-foreground">
                Ein Cookie ist eine kleine Textdatei, die eine Webseite auf Ihrem Computer oder Mobilgerät speichert, wenn Sie sie besuchen. Es ist nicht essbar, enttäuschenderweise. Es hilft der Website, sich Ihre Aktionen und Präferenzen (wie z.B. die Tatsache, dass Sie unser nerviges Cookie-Banner bereits gesehen haben) über einen bestimmten Zeitraum zu merken.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">Wie wir Cookies verwenden</h2>
              <p className="text-muted-foreground">
                Wir verwenden Cookies aus einem einzigen, existenziell wichtigen Grund:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Technisch notwendige Cookies:</strong> Wir setzen ein Cookie, um Ihre Zustimmung (oder Ablehnung) zu unserem Cookie-Banner zu speichern. Ohne dieses Cookie müssten wir Sie auf jeder einzelnen Seite erneut fragen, was selbst für unsere Verhältnisse zu sadistisch wäre. Dieses Cookie heißt `cookie_consent` und speichert nur, ob Sie zugestimmt haben oder nicht. Das war's.
                </li>
              </ul>
              <p className="text-muted-foreground">
                Wir verwenden keine Analyse-Cookies. Wir verwenden keine Marketing-Cookies. Wir tracken Sie nicht. Wir wissen nicht, wer Sie sind, und ehrlich gesagt, bei dem Humor, den Sie anscheinend haben, ist das vielleicht auch besser so.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">Wie Sie Cookies kontrollieren können</h2>
              <p className="text-muted-foreground">
                Sie können Cookies nach Belieben steuern und/oder löschen. Details finden Sie unter aboutcookies.org. Sie können alle Cookies löschen, die sich bereits auf Ihrem Computer befinden, und Sie können die meisten Browser so einstellen, dass die Ablage von Cookies verhindert wird. Wenn Sie dies tun, müssen Sie jedoch möglicherweise einige Einstellungen bei jedem Besuch einer Seite manuell anpassen und die Beeinträchtigung einiger Funktionen in Kauf nehmen.
              </p>
              <p className="text-muted-foreground">
                Für weitere Fragen, die Ihr Leben nicht einfacher machen, lesen Sie unsere <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>.
              </p>
            </div>
             <div className="space-y-4">
                 <p className="text-xs text-muted-foreground">Stand: {new Date().toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
