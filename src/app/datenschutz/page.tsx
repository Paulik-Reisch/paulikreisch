import Link from 'next/link';
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Datenschutz – Paulik & Reisch",
  description: "Datenschutzerklärung von Paulik & Reisch nach DSGVO, BDSG und TDDDG.",
};

export default function DatenschutzPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <article className="prose prose-lg dark:prose-invert mx-auto max-w-2xl">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Datenschutzerklärung</h1>
            <p className="text-sm text-muted-foreground">Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}</p>

            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO ist:<br />
              Philipp Paulik<br />
              Mozartstraße 1<br />
              53819 Neunkirchen-Seelscheid<br />
              E-Mail: philipp.l.paulik@gmail.com<br />
              Bei Fragen zum Datenschutz erreichen Sie uns unter der genannten E-Mail-Adresse.
            </p>

            <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
            <h3>2.1 Server-Logfiles</h3>
            <p>
              Beim Aufruf unserer Seiten erheben wir automatisch Informationen, die Ihr Browser übermittelt
              (IP-Adresse, Datum und Uhrzeit, abgerufene Seite, Referrer-URL, Browsertyp). Die Verarbeitung
              erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
              störungsfreien Betrieb). Eine Zusammenführung mit anderen Datenquellen findet nicht statt.
            </p>

            <h3>2.2 Newsletter</h3>
            <p>
              Wenn Sie unseren Newsletter abonnieren, verarbeiten wir Ihre E-Mail-Adresse sowie die freiwillig
              angegebenen Daten auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Eine
              Übertragung an Dritte erfolgt nicht. Sie können den Newsletter jederzeit über den Abmeldelink
              in jeder E-Mail widerrufen.
            </p>

            <h3>2.3 Firebase / Firestore</h3>
            <p>
              Für Reichweitenmessung und zur Speicherung von Spieldständen (Worthaft) setzen wir Dienste der
              Google Ireland Limited („Firebase", „Firestore") ein. Soweit hierbei personenbezogene Daten
              verarbeitet werden, beruht dies auf Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
              Produktverbesserung) oder Ihrer Einwilligung. Einzelheiten entnehmen Sie der
              Datenschutzerklärung von Google.
            </p>

            <h3>2.4 Lokale Speicherung (Worthaft)</h3>
            <p>
              Ihre Worthaft-Spielstände werden ausschließlich lokal im Browser (localStorage) gespeichert.
              Eine serverseitige Auswertung dieser Daten findet nicht statt.
            </p>

            <h2>3. Cookies und Einwilligung</h2>
            <p>
              Wir setzen Cookies und vergleichbare Technologien nur nach Ihrer Einwilligung ein
              (Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 25 TDDDG). Notwendige Cookies, die für den Betrieb der
              Seite erforderlich sind, werden ohne Einwilligung gesetzt. Ihre Auswahl können Sie jederzeit über
              den Consent-Dialog anpassen. Details entnehmen Sie der <Link href="/cookie-richtlinie">Cookie-Richtlinie</Link>.
            </p>

            <h2>4. Betroffenenrechte</h2>
            <p>
              Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung
              (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit
              (Art. 20 DSGVO) sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Zudem steht Ihnen ein
              Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO) zu.
            </p>

            <h2>5. KI-generierte Inhalte</h2>
            <p>
              Einzelne Inhalte dieser Seite können mithilfe Künstlicher Intelligenz erzeugt oder bearbeitet
              worden sein. Eine Kennzeichnung erfolgt gemäß Art. 50 der Verordnung (EU) 2024/1689 (EU AI Act)
              in den <Link href="/transparenz">Transparenzhinweisen</Link>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
