import Link from 'next/link';
import { LegalPage } from "@/components/landing/legal-page";

export const metadata = {
  title: "Cookie-Richtlinie",
  description: "Übersicht über eingesetzte Cookies und Consent-Verwaltung bei Paulik & Reisch.",
};

export default function CookieRichtliniePage() {
  return (
    <LegalPage title="Cookie-Richtlinie" description="Welche Cookies und vergleichbaren Technologien auf dieser Website zum Einsatz kommen.">
            <p className="text-sm text-muted-foreground">Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}</p>

            <h2>1. Was sind Cookies?</h2>
            <p>
              Cookies sind kleine Textdateien, die auf Deinem Gerät gespeichert werden. Sie dienen dazu,
              unsere Webseite nutzerfreundlich zu gestalten, Reichweiten zu messen und, sofern Du
              einwilligst, Inhalte zu personalisieren.
            </p>

            <h2>2. Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung personenbezogener Daten durch Cookies erfolgt auf Grundlage Deiner Einwilligung
              gemäß Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG. Technisch notwendige Cookies werden
              ohne Einwilligung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gesetzt.
            </p>

            <h2>3. Eingesetzte Kategorien</h2>
            <h3>Notwendig</h3>
            <p>
              Diese Cookies sind für den Betrieb der Seite erforderlich (z. B. Speicherung Deiner
              Consent-Entscheidung). Sie können nicht deaktiviert werden.
            </p>
            <h3>Bits: Spielstand auf Deinem Gerät</h3>
            <p>
              Das Spiel Bits speichert beim Spielen den aktuellen Spielstand, die Rastergröße,
              Spielzeit, Hinweise und bis zu 20 Rückgängig-Schritte im eigenen Cookie „pr_bits_v1“.
              Es gilt nur für /game-labs/bits und läuft spätestens ein Jahr nach der letzten Speicherung ab.
              Bits benötigt kein Konto und verwendet keine Analyse- oder Marketingdienste.
              Über Deine Browser-Einstellungen kannst Du den Cookie entfernen.
              Bei blockierten Cookies bleibt das Spiel für die aktuelle Sitzung spielbar.
            </p>
            <h3>Wikiland: Spielstand auf Deinem Gerät</h3>
            <p>
              Wikiland speichert die aktuelle Runde, Rateversuche, aufgedeckte Hinweise und die Spielzeit
              in bis zu vier eigenen Cookies „pr_wikiland_v1_0“ bis „pr_wikiland_v1_3“.
              Sie gelten nur für /game-labs/wikiland und laufen spätestens ein Jahr nach der letzten Speicherung ab.
              Das Spiel benötigt kein Konto und verwendet keine Analyse- oder Marketingdienste.
              Du kannst die Cookies über Deine Browser-Einstellungen entfernen. Bei blockierten Cookies
              bleibt die Runde spielbar; der Fortschritt kann dann beim Schließen verloren gehen.
            </p>
            <h3>Analyse &amp; Leistung</h3>
            <p>
              Nur mit Deiner vorherigen Zustimmung zur Kategorie „Analyse &amp; Leistung“ speichern wir
              unter „pr_analytics_visitor_v1“ eine zufällige Besucher-ID mit Ablaufzeit im localStorage
              Deines Browsers. Die ID gilt höchstens 90 Tage und hilft uns, Seitenaufrufe und
              wiederkehrende Besuche auszuwerten. Sie erstellt kein Firebase-Anmeldekonto und enthält
              weder Deinen Namen noch Deine E-Mail-Adresse. Die ID wird zusammen mit Nutzungsereignissen
              an unsere bestehende Firebase-Datenbank übermittelt. Es handelt sich um eine pseudonyme,
              nicht um garantiert anonyme Kennung. Verschiedene Browser und Geräte zählen getrennt.
              Ohne Zustimmung wird keine Analytics-ID angelegt und werden keine solchen Ereignisse gesendet.
              Bei Widerruf entfernen wir die ID aus diesem Browser; bereits gespeicherte Ereignisse werden
              dadurch nicht rückwirkend gelöscht. Weitere Angaben zur Verarbeitung und zu Deinen Rechten
              stehen in der Datenschutzerklärung.
            </p>
            <h3>Marketing</h3>
            <p>
              Derzeit setzen wir keine Marketing-Tracker ein.
            </p>

            <h2>4. Verwaltung Deiner Einwilligung</h2>
            <p>
              Du kannst Deine Auswahl jederzeit über den Link „Cookie-Einstellungen“ im Footer anpassen oder die im
              Browser gespeicherte Consent-Datei löschen. Ein Widerruf berührt die Rechtmäßigkeit der bis zum
              Widerruf erfolgten Verarbeitung nicht.
            </p>

            <h2>5. Weitere Informationen</h2>
            <p>
              Ausführliche Hinweise zur Datenverarbeitung findest Du in unserer
              <Link href="/datenschutz">Datenschutzerklärung</Link>.
            </p>
    </LegalPage>
  );
}
