import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Cookie-Richtlinie – Paulik & Reisch",
  description: "Übersicht über eingesetzte Cookies und Consent-Verwaltung bei Paulik & Reisch.",
};

export default function CookieRichtliniePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <article className="prose prose-lg dark:prose-invert mx-auto max-w-2xl">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Cookie-Richtlinie</h1>
            <p className="text-sm text-muted-foreground">Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}</p>

            <h2>1. Was sind Cookies?</h2>
            <p>
              Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Sie dienen dazu,
              unsere Webseite nutzerfreundlich zu gestalten, Reichweiten zu messen und — sofern Sie
              einwilligen — Inhalte zu personalisieren.
            </p>

            <h2>2. Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung personenbezogener Daten durch Cookies erfolgt auf Grundlage Ihrer Einwilligung
              gemäß Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG. Technisch notwendige Cookies werden
              ohne Einwilligung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gesetzt.
            </p>

            <h2>3. Eingesetzte Kategorien</h2>
            <h3>Notwendig</h3>
            <p>
              Diese Cookies sind für den Betrieb der Seite erforderlich (z. B. Speicherung Ihrer
              Consent-Entscheidung). Sie können nicht deaktiviert werden.
            </p>
            <h3>Analyse &amp; Leistung</h3>
            <p>
              Ermöglichen eine anonymisierte Reichweitenmessung (z. B. Firebase Analytics). Gesetzt nur nach
              Ihrer Einwilligung.
            </p>
            <h3>Marketing</h3>
            <p>
              Dienen dazu, Ihnen relevante Inhalte anzuzeigen. Gesetzt nur nach Ihrer Einwilligung.
            </p>

            <h2>4. Verwaltung Ihrer Einwilligung</h2>
            <p>
              Sie können Ihre Auswahl jederzeit über den Consent-Dialog („Einstellungen") anpassen oder die im
              Browser gespeicherte Consent-Datei löschen. Ein Widerruf berührt die Rechtmäßigkeit der bis zum
              Widerruf erfolgten Verarbeitung nicht.
            </p>

            <h2>5. Weitere Informationen</h2>
            <p>
              Ausführliche Hinweise zur Datenverarbeitung finden Sie in unserer
              <a href="/datenschutz">Datenschutzerklärung</a>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
