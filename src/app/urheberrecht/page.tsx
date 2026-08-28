import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Urheberrecht – Paulik & Reisch",
  description: "Urheberrechtliche Hinweise zu sämtlichen Inhalten von Paulik & Reisch.",
};

export default function UrheberrechtPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-headline text-4xl md:text-5xl mb-8">Urheberrecht</h1>

        <div className="prose prose-lg space-y-6 text-foreground/80">
          <p>
            Sämtliche auf dieser Webpräsenz bereitgestellten Inhalte – darunter, jedoch nicht abschließend,
            textliche Darstellungen, satirische Artikel, Buchauszüge, das Spiel &bdquo;Worthaft&rdquo; samt
            zugrundeliegender Programmierroutine, klangliche und bildliche Erzeugnisse sowie die getroffene
            gestalterische Anordnung – unterliegen dem Schutz des Urheberrechtsgesetzes (UrhG) sowie
            ergänzenden leistungsschutzrechtlichen Bestimmungen. Die ausschließlichen Nutzungsrechte an den
            originären Schöpfungen stehen, soweit nicht ausdrücklich anderweitig gekennzeichnet, den im
            Impressum benannten Anbietern zu.
          </p>

          <h2>1. Urheberrechtsschutz</h2>
          <p>
            Die Werke werden als persönliche geistige Schöpfungen im Sinne des § 2 Abs. 2 UrhG qualifiziert.
            Jede Verwertung – mithin die Vervielfältigung, die Verbreitung, die öffentliche Wiedergabe, die
            Bearbeitung sowie die öffentliche Zugänglichmachung – bedarf der vorherigen schriftlichen
            Einwilligung des jeweiligen Rechteinhabers. Dies gilt gleichermaßen für die entgeltliche wie für
            die unentgeltliche Nutzung und erstreckt sich auf sämtliche Bekanntmachungsformen, einschließlich
            der Reproduktion in digitalen Netzwerken und der Speicherung auf privaten oder fremden
            Datenträgern.
          </p>

          <h2>2. Zulässige private Nutzung</h2>
          <p>
            Unbeschadet der vorstehenden Regelung bleibt die Vervielfältigung und Wiedergabe zu ausschließlich
            privaten, nicht kommerziellen Zwecken im Rahmen des § 53 UrhG unberührt, sofern die betroffenen
            Werke nicht offensichtlich rechtswidrig hergestellt oder zugänglich gemacht wurden. Eine darüber
            hinausgehende, insbesondere gewerbliche, Nutzung ist ohne ausdrückliche Lizenzgewährung untersagt.
          </p>

          <h2>3. Kennzeichnung fremder Rechte</h2>
          <p>
            Sofern auf dieser Webpräsenz Werke Dritter integriert werden, erfolgt deren Benennung grundsätzlich
            an der jeweiligen Stelle der Einbindung. Sollte eine solche Kennzeichnung gleichwohl unterblieben
            sein, wird um eine entsprechende Mitteilung ersucht, damit etwaige Rechte Dritter im Wege einer
            redaktionellen Korrektur berücksichtigt werden können.
          </p>

          <h2>4. Hinweis gemäß § 109 des Urheberrechts-Diensteanbieter-Gesetzes (UrhDaG)</h2>
          <p>
            Der Anbieter tritt als Diensteanbieter im Sinne des § 109 UrhDaG auf. Die Vermutung der
            Rechtsinhaberschaft gemäß § 4 Abs. 1 UrhDaG wird für die hier öffentlich zugänglich gemachten,
            eigenurheberrechtlich geschützten Inhalte in Anspruch genommen. Berechtigte Personen im Sinne des
            § 14 UrhDaG werden gebeten, Beanstandungen ausschließlich über die im Impressum ausgewiesenen
            Kontaktwege zu richten; einem Übermittlungsweg gemäß § 14 Abs. 2 UrhDaG wird für die Entgegennahme
            von Hinweisen nach § 17 UrhDaG entsprochen.
          </p>

          <h2>5. Rechtswidrige Inhalte &amp; Kontakt</h2>
          <p>
            Sollten einzelne Inhalte den Verdacht der Rechtsverletzung begründen, wird um unverzügliche
            Mitteilung unter der im Impressum genannten E-Mail-Adresse gebeten, damit die betroffene Stelle
            alsdann einer alsbaldigen Prüfung sowie gegebenenfalls einer Entfernung zugeführt werden kann.
            Ein vorgebliches Auskunftsbegehren gemäß § 19 UrhDaG wird nur unter den gesetzlichen Voraussetzungen
            und im Rahmen der datenschutzrechtlichen Bestimmungen beantwortet.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Verantwortlich für diese Seite: Philipp Paulik (siehe Impressum).
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
