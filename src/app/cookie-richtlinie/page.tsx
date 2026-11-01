import Link from 'next/link';
import { LegalPage } from "@/components/landing/legal-page";

export const metadata = {
  title: "Cookie-Richtlinie – Paulik & Reisch",
  description: "Übersicht über eingesetzte Cookies und Consent-Verwaltung bei Paulik & Reisch.",
};

export default function CookieRichtliniePage() {
  return (
    <LegalPage title="Cookie-Richtlinie" description="Welche Cookies und vergleichbaren Technologien auf dieser Website zum Einsatz kommen.">
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
            <h3>Bits: Spielstand auf Ihrem Gerät</h3>
            <p>
              Das Spiel Bits speichert beim Spielen den aktuellen Spielstand, die Rastergröße,
              Spielzeit, Hinweise und bis zu 20 Rückgängig-Schritte im eigenen Cookie „pr_bits_v1“.
              Es gilt nur für /game-labs/bits und läuft spätestens ein Jahr nach der letzten Speicherung ab.
              Bits benötigt kein Konto und verwendet keine Analyse- oder Marketingdienste.
              Über Ihre Browser-Einstellungen können Sie den Cookie entfernen.
              Bei blockierten Cookies bleibt das Spiel für die aktuelle Sitzung spielbar.
            </p>
            <h3>Wikiland: Spielstand auf Ihrem Gerät</h3>
            <p>
              Wikiland speichert die aktuelle Runde, Rateversuche, aufgedeckte Hinweise und die Spielzeit
              in bis zu vier eigenen Cookies „pr_wikiland_v1_0“ bis „pr_wikiland_v1_3“.
              Sie gelten nur für /game-labs/wikiland und laufen spätestens ein Jahr nach der letzten Speicherung ab.
              Das Spiel benötigt kein Konto und verwendet keine Analyse- oder Marketingdienste.
              Sie können die Cookies über Ihre Browser-Einstellungen entfernen. Bei blockierten Cookies
              bleibt die Runde spielbar; der Fortschritt kann dann beim Schließen verloren gehen.
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
              <Link href="/datenschutz">Datenschutzerklärung</Link>.
            </p>
    </LegalPage>
  );
}
