import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Barrierefreiheit – Paulik & Reisch",
  description: "Erklärung zur Barrierefreiheit gemäß BITV 2.0 und EU-Richtlinie 2016/2102.",
};

export default function BarrierefreiheitPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-headline text-4xl md:text-5xl mb-8">Erklärung zur Barrierefreiheit</h1>

        <div className="prose prose-lg space-y-6 text-foreground/80">
          <p>
            Die vorliegende Erklärung zur Barrierefreiheit verpflichtet sich der Erfüllung der Anforderungen,
            welche sich aus der Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) in Verbindung mit der
            Richtlinie (EU) 2016/2102 des Europäischen Parlaments und des Rates ergeben. Die nachfolgenden
            Ausführungen verstehen sich als wahrheitsgemäße Selbsteinschätzung der Zugänglichkeit dieser
            Webpräsenz im Sinne des § 12 Abs. 1 BITV 2.0.
          </p>

          <h2>1. Geltungsbereich</h2>
          <p>
            Diese Erklärung erfasst die Webpräsenz unter der Domain paulikreisch.de einschließlich der
            integrierten Unterangebote, mithin insbesondere des Worträtsels &bdquo;Worthaft&rdquo; sowie der
            redaktionellen Beiträge. Mobile Applikationen im Sinne des § 1 Abs. 2 Nr. 2 BITV 2.0 bleiben von
            dieser Erklärung ausdrücklich unberührt.
          </p>

          <h2>2. Stand der Vereinbarkeit</h2>
          <p>
            Die Webpräsenz ist mit den Anforderungen der BITV 2.0, welche die Richtlinie (EU) 2016/2102 in
            deutsches Recht transformiert, im Wesentlichen vereinbar. Die Konformität wird auf Basis der
            Erfolgskriterien der Richtlinie zur Barrierefreiheit von Webinhalten (WCAG) 2.1 in der
            Konformitätsstufe AA erstrebt und fortlaufend evaluiert.
          </p>

          <h2>3. Nicht vollständig barrierefreie Inhalte</h2>
          <p>
            Ungeachtet der Bemühungen um weitestgehende Zugänglichkeit können einzelne Inhalte den
            Anforderungen vorübergehend nicht in vollem Umfang genügen. Hierzu zählen namentlich:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Die vollständige maschinelle Erfassbarkeit sämtlicher satirischer Bild- und Tongestaltungen.</li>
            <li>Die durchgängige Fehlervermeidung bei der Eingabe innerhalb des Spielmodus &bdquo;Worthaft&rdquo;.</li>
            <li>Die vollständige Kontrastwahrung sämtlicher dekorativer Übergangselemente.</li>
          </ul>

          <h2>4. Erstellung dieser Erklärung</h2>
          <p>
            Diese Erklärung wurde am heutigen Tage auf Grundlage einer selbst durchgeführten Prüfung nach den
            Maßgaben des § 12 Abs. 2 BITV 2.0 erstellt. Eine Überprüfung durch eine nach § 11 BITV 2.0
            anerkannte Stelle ist bislang nicht erfolgt.
          </p>

          <h2>5. Rückmeldung und Kontaktstelle</h2>
          <p>
            Im Sinne des § 13 BITV 2.0 wird eine kontinuierliche Rückmeldung zu etwaigen
            Zugänglichkeitsbarrieren ermöglicht. Beanstandungen, Anregungen sowie der Wunsch nach
            barrierefreier Bereitstellung nicht zugänglicher Inhalte im Wege einer alternativen
            Kommunikationsform sind zu richten an:
          </p>
          <p>
            Philipp Paulik<br />
            Mozartstraße 1<br />
            53819 Neunkirchen-Seelscheid<br />
            E-Mail: philipp.l.paulik@gmail.com
          </p>

          <h2>6. Durchsetzungsverfahren</h2>
          <p>
            Sollte auf eine entsprechende Rückmeldung hin keine befriedigende Antwort erfolgen, besteht die
            Möglichkeit, sich an die in § 14 BITV 2.0 benannte Schlichtungsstelle zu wenden:
            Schlichtungsstelle nach § 16 BITV 2.0 beim Beauftragten der Bundesregierung für die Belange
            von Menschen mit Behinderungen, Mauerstraße 76, 10117 Berlin, E-Mail: info@schlichtungsstelle-bbitv.de.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Verantwortlich für diese Erklärung: Philipp Paulik (siehe Impressum).
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
