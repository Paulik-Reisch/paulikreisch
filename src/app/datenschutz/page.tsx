import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-8">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Datenschutzerklärung
            </h1>
            <p className="text-lg text-muted-foreground">
              So ernst wie nötig, so satirisch wie möglich. Aber ja, auch wir müssen das tun.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">1. Verantwortliche Stelle</h2>
              <p className="text-muted-foreground">
                Verantwortlich für die Datenerhebung auf dieser Website sind:
                <br />
                Philipp Paulik und Maximilian Reisch
                <br />
                [Straße und Hausnummer]
                <br />
                53819 Neunkirchen
                <br />
                Deutschland
                <br />
                E-Mail: hallowelt@paulik-reisch.de
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">2. Welche Daten wir sammeln (und warum)</h2>
              <h3 className="text-xl font-bold">Server-Log-Dateien</h3>
              <p className="text-muted-foreground">
                Unser Hoster (also der Computer, auf dem diese Website wohnt) sammelt automatisch Informationen, die Ihr Browser an uns übermittelt. Das sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL (die Seite, von der Sie kamen), Hostname des zugreifenden Rechners (Ihre IP-Adresse, aber anonymisiert) und die Uhrzeit der Serveranfrage. Diese Daten sind technisch notwendig, um die Seite anzuzeigen und um sicherzustellen, dass keine Roboter versuchen, unsere Witze zu klauen. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
              </p>

              <h3 className="text-xl font-bold">Cookies</h3>
              <p className="text-muted-foreground">
                Unsere Webseite verwendet Cookies. Das sind kleine Textdateien, die Ihr Browser speichert. Sie richten auf Ihrem Rechner keinen Schaden an, außer vielleicht seelischen, wenn Sie merken, dass Sie schon wieder auf einer Webseite mit Cookie-Banner gelandet sind. Wir verwenden sie nur, um uns zu merken, dass Sie das Cookie-Banner bereits weggeklickt haben. Mehr dazu in unserer sensationell spannenden <Link href="/cookie-richtlinie" className="underline">Cookie-Richtlinie</Link>.
              </p>

               <h3 className="text-xl font-bold">Kontaktaufnahme per E-Mail</h3>
              <p className="text-muted-foreground">
                Wenn Sie uns eine E-Mail schreiben, speichern wir Ihre Nachricht und Ihre E-Mail-Adresse, um Ihnen antworten zu können. Wir versprechen, Ihre Adresse nicht für Spam zu nutzen, es sei denn, wir haben eine wirklich, wirklich gute neue Buchidee. (Kleiner Scherz. DSGVO-konform, natürlich.)
              </p>
              
              <h3 className="text-xl font-bold">Datennutzung für KI-Funktionen</h3>
              <p className="text-muted-foreground">
                Diese Webseite bietet interaktive Funktionen (z.B. Testimonial-Generator, Kapitel-Fortsetzung), die auf generativer künstlicher Intelligenz basieren. Wenn Sie diese Funktionen nutzen, werden Ihre Eingaben (z.B. eingegebener Text) an einen externen Dienstanbieter (Google, USA) übermittelt, um eine Antwort zu generieren.
              </p>
               <p className="text-muted-foreground">
                Die Übermittlung dieser Daten ist technisch notwendig, um die Funktion auszuführen. Die Verarbeitung der Daten durch den Anbieter unterliegt dessen Datenschutzbestimmungen. Wir haben keinen Einfluss auf die weitere Verwendung Ihrer Daten durch den Anbieter.
              </p>
               <p className="font-semibold text-destructive">
                Wir weisen Sie ausdrücklich darauf hin, keine sensiblen, vertraulichen oder personenbezogenen Daten in diese Felder einzugeben. Mit der Nutzung der KI-Funktionen stimmen Sie dieser Datenübermittlung gemäß Art. 49 Abs. 1 lit. a DSGVO zu.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">3. Ihre Rechte (ja, Sie haben welche)</h2>
              <p className="text-muted-foreground">
                Sie haben das Recht, Auskunft über Ihre bei uns gespeicherten Daten zu erhalten, deren Berichtigung, Löschung oder die Einschränkung der Verarbeitung zu verlangen. Sie können auch der Verarbeitung widersprechen. Kontaktieren Sie uns einfach per E-Mail. Sie haben auch das Recht, sich bei einer Aufsichtsbehörde zu beschweren, falls Sie das Gefühl haben, wir nehmen den Datenschutz nicht ernst. (Aber das tun wir. Meistens.)
              </p>
            </div>
             <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">4. Änderungen dieser Datenschutzerklärung</h2>
              <p className="text-muted-foreground">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z. B. bei der Einführung neuer, noch absurderer Features. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
               <p className="text-xs text-muted-foreground">Stand: {new Date().toLocaleDateString('de-DE')}</p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
