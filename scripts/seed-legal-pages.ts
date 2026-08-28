/**
 * SEED-SKRIPT: Legal-Seiten in Firestore anlegen
 * -------------------------------------------------
 * Legt die Legal-Page-Dokumente in der Collection "legal" an (Dokument-ID = slug),
 * damit /impressum, /cookie-richtlinie, /transparenz nicht 404 werfen.
 *
 * WICHTIG:
 * - Das Skript überschreibt NICHT vorhandene Dokumente (nur fehlende werden angelegt).
 * - Die Inhalte enthalten <<Platzhalter>> — diese MÜSSEN vor dem Live-Betrieb
 *   durch die echten Stammdaten ersetzt werden (keine anwaltliche Prüfung ersetzt).
 * - Ausführung nur mit Firebase-Umgebungsvariablen (firebaseConfig aus src/firebase/config.ts).
 *
 * Ausführen (lokal, mit Service-Account oder emuliertem Auth):
 *   npx tsx scripts/seed-legal-pages.ts
 *   (benötigt: npm i -D tsx)
 *
 * Alternativ: Inhalt manuell im Admin-CMS / Firestore-Konsole als Dokument
 * mit ID = slug und Feldern { title, content (HTML), lastUpdated, showTitle, showDate } eintragen.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "../src/firebase/config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type LegalSeed = {
  slug: string;
  title: string;
  content: string;
};

const seeds: LegalSeed[] = [
  {
    slug: "impressum",
    title: "Impressum",
    content: `<h2>Angaben gemäß §§ 5, 6 des Digitale-Dienste-Gesetzes (DDG)</h2>
<p>Verantwortlich für den Inhalt dieser Telemedien im Sinne der Anbieterkennzeichnungspflicht nach § 5 Abs. 1 DDG:</p>
<p><strong>Paulik &amp; Reisch</strong><br/>Vertreten durch die Gesellschafter<br/>&lt;Vorname Nachname&gt; (Philipp Paulik) und &lt;Vorname Nachname&gt; (Maximilian Reisch)<br/>&lt;Straße und Hausnummer&gt;<br/>&lt;PLZ&gt; &lt;Ort&gt;<br/>Deutschland</p>
<p><b>Kontakt:</b><br/>Telefon: &lt;Telefonnummer zum Basistarif&gt;<br/>E-Mail: &lt;kontakt@paulikreisch.de&gt;</p>
<p><b>Umsatzsteueridentifikationsnummer</b> gemäß § 27 a Umsatzsteuergesetz:<br/>&lt;USt-IdNr., sofern vorhanden; ansonsten Satz entfernen&gt;</p>
<p><b>Verantwortlich für journalistisch-redaktionelle Angebote</b> im Sinne des § 18 Abs. 2 MStV:<br/>&lt;Name der redaktionell verantwortlichen Person, ständiger Aufenthalt inländisch&gt;</p>
<p><b>EU-Streitschlichtung:</b> Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
<p><b>Urheberrecht:</b> Die durch die Betreiber dieser Seiten erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.</p>`,
  },
  {
    slug: "cookie-richtlinie",
    title: "Cookie-Richtlinie",
    content: `<h2>Cookie-Richtlinie</h2>
<p>Diese Cookie-Richtlinie erläutert, welche Cookies und vergleichbaren Technologien (z. B. Local Storage, Pixel) auf paulikreisch.de eingesetzt werden und auf welcher Rechtsgrundlage (Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 Abs. 1 TDDDG).</p>
<h3>Notwendige Cookies</h3><p>Dienen dem Betrieb der Seite (z. B. Speicherung Ihrer Consent-Entscheidung). Sie können nicht deaktiviert werden und werden ohne Einwilligung gesetzt, soweit zwingend erforderlich.</p>
<h3>Analyse &amp; Leistung</h3><p>Ermöglichen die anonymisierte Reichweitenmessung. Gesetzt nur nach Ihrer Einwilligung. Beispiel: Firebase Analytics.</p>
<h3>Marketing</h3><p>Werden eingesetzt, um Ihnen relevante Inhalte anzuzeigen. Gesetzt nur nach Ihrer Einwilligung.</p>
<h3>Verwaltung Ihrer Einwilligung</h3><p>Sie können Ihre Auswahl jederzeit über den „Einstellungen"-Link im Cookie-Banner anpassen oder die im Browser gespeicherte Consent-Datei löschen.</p>`,
  },
  {
    slug: "transparenz",
    title: "Transparenzhinweise",
    content: `<h2>Transparenzhinweise gemäß Art. 50 der Verordnung (EU) 2024/1689 (EU AI Act)</h2>
<p>Die nachfolgenden Hinweise erfolgen im Bewusstsein der Transparenzpflichten gemäß Art. 50 der Verordnung (EU) 2024/1689 („KI-Verordnung" / „AI Act") sowie des hierzu ergangenen Verhaltenskodex zur Kennzeichnung KI-generierter Inhalte. Sie dienen dem Zweck, natürlichen Personen die Einordnung und Herkunft der auf diesem Angebot bereitgestellten Inhalte zu ermöglichen.</p>
<h3>1. Geltungsbereich und Rechtsnatur</h3><p>Die Kennzeichnungspflichten des Art. 50 KI-Verordnung entfalten ihre Wirkung für die hier in Rede stehenden Inhaltekategorien vorbehaltlich der dort normierten Ausnahmen, insbesondere der Ausnahme für Inhalte, die einer tatsächlichen menschlichen Überprüfung sowie redaktionellen Kontrolle unterlegen haben (Art. 50 Abs. 4 Satz 4 KI-Verordnung).</p>
<h3>2. KI-generierte und KI-unterstützte Inhalte</h3><p>Die auf diesem Angebot veröffentlichten satirischen Beiträge, literarischen Texte sowie illustrativen und/oder audiovisuellen Darstellungen können ganz oder teilweise mittels Systemen künstlicher Intelligenz erzeugt, bearbeitet oder wesentlich beeinflusst worden sein. Sofern derartige Inhalte — insbesondere solche mit Bezug zu realen Personen, Objekten, Orten, Entitäten oder Ereignissen — geeignet sind, als authentisch erschcheinend wahrgenommen zu werden, werden dieselben als künstlichen Ursprungs gekennzeichnet.</p>
<h3>3. Maschinenlesbare Kennzeichnung</h3><p>Im Rahmen des technisch Machbaren bemühen wir uns, synthetische Inhalte zusätzlich in einem maschinenlesbaren Format als KI-erzeugt zu kennzeichnen (Art. 50 Abs. 2 KI-Verordnung).</p>
<h3>4. Interaktion mit KI-Systemen</h3><p>Sofern auf diesem Angebot interaktive KI-Systeme zum Einsatz gelangen, werden Nutzer darüber informiert, dass sie mit einem System künstlicher Intelligenz interagieren (Art. 50 Abs. 3 KI-Verordnung).</p>
<h3>5. Redaktionelle Verantwortung und Ausnahmen</h3><p>Bei offensichtlich künstlerischen, kreativen, satirischen oder fiktionalen Werken beschränken sich die Transparenzpflichten auf eine Offenlegung in geeigneter Weise, die die Darstellung nicht behindert.</p>`,
  },
  {
    slug: "datenschutz",
    title: "Datenschutzerklärung",
    content: `<h2>Datenschutzerklärung</h2>
<p>Diese Datenschutzerklärung informiert Sie gemäß DSGVO, BDSG sowie TDDDG über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener Daten.</p>
<h3>1. Verantwortlicher</h3><p>Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO ist die unter „Impressum" genannte Person/Personengesellschaft.</p>
<h3>2. Newsletter</h3><p>Bei Anmeldung verarbeiten wir die E-Mail-Adresse auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</p>
<h3>3. Firestore / Analyse</h3><p>Zur Reichweitenauswertung setzen wir Firebase/Firestore ein. Soweit personenbezogene Daten verarbeitet werden, erfolgt dies auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO bzw. Ihrer Einwilligung.</p>
<h3>4. Cookies und Einwilligung</h3><p>Wir setzen Cookies nur nach Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 TDDDG).</p>
<h3>5. Betroffenenrechte</h3><p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie ein Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO).</p>
<h3>6. Worthaft-Spieldaten</h3><p>Spielstände werden ausschließlich lokal im Browser (localStorage) gespeichert; keine serverseitige Auswertung.</p>`,
  },
  {
    slug: "agb",
    title: "Allgemeine Geschäftsbedingungen",
    content: `<h2>Allgemeine Geschäftsbedingungen</h2>
<h3>§ 1 Geltungsbereich</h3><p>Diese AGB gelten für Verträge über die auf paulikreisch.de angebotenen Waren und digitalen Inhalte zwischen uns und Verbrauchern (§ 13 BGB).</p>
<h3>§ 2 Vertragsschluss</h3><p>Der Kauf erfolgt über verlinkte Drittanbieter (Amazon, Google Play, 11Reader); der Vertrag kommt auf deren Plattformen zustande.</p>
<h3>§ 3 Widerruf</h3><p>Bei digitalen Inhalten erlischt das Widerrufsrecht mit Beginn der Ausführung, sofern Sie vorher ausdrücklich zugestimmt haben.</p>
<h3>§ 4 Haftung</h3><p>Für unsere Vermittlungstätigkeit haften wir nur bei Vorsatz und grober Fahrlässigkeit.</p>
<h3>§ 5 Anwendbares Recht</h3><p>Es gilt das Recht der Bundesrepublik Deutschland.</p>`,
  },
];

async function seed() {
  for (const s of seeds) {
    const ref = doc(db, "legal", s.slug);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      console.log(`[skip] ${s.slug} existiert bereits — nicht überschrieben.`);
      continue;
    }
    await setDoc(ref, {
      title: s.title,
      content: s.content,
      components: [],
      lastUpdated: serverTimestamp(),
      showTitle: true,
      showDate: true,
    });
    console.log(`[ok] ${s.slug} angelegt.`);
  }
  console.log("Fertig. Platzhalter <<>> in den Inhalten vor Live-Betrieb ersetzen!");
}

seed().then(() => process.exit(0)).catch((e) => {
  console.error("Fehler:", e);
  process.exit(1);
});
