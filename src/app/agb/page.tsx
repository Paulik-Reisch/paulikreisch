import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";

export default function AGBPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-8">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Allgemeine Geschäftsbedingungen (AGB)
            </h1>
            <p className="text-lg text-muted-foreground">
              Nutzungsbedingungen für die Website und die darauf angebotenen Dienste
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 1 Geltungsbereich und Anbieter</h2>
              <p className="text-muted-foreground">
                Die Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Webseite www.paulik-reisch.de und aller darauf angebotenen Dienste, insbesondere der interaktiven KI-Generatoren. Betreiber der Website und Vertragspartner sind Philipp Paulik und Maximilian Reisch (nachfolgend "Betreiber" genannt).
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 2 Leistungsgegenstand</h2>
              <p className="text-muted-foreground">
                Die Betreiber stellen auf dieser Website Informationen zu ihren literarischen Werken sowie interaktive, auf künstlicher Intelligenz basierende, Unterhaltungsfunktionen (nachfolgend "KI-Dienste") zur Verfügung. Die Nutzung der Website und der KI-Dienste ist unentgeltlich. Die KI-Dienste dienen reinen Unterhaltungszwecken. Die generierten Inhalte sind satirisch und erheben keinen Anspruch auf Richtigkeit, Genauigkeit oder Angemessenheit.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 3 Nutzung der KI-Dienste und Datenverarbeitung</h2>
               <p className="text-muted-foreground">
                Die Nutzung der KI-Dienste erfordert die Eingabe von Texten oder die Auswahl von Optionen durch den Nutzer. Mit der Nutzung dieser Dienste erklären Sie sich damit einverstanden, dass Ihre Eingaben an externe KI-Dienstleister (z.B. Google) zur Verarbeitung und zur Generierung einer Antwort übermittelt werden.
              </p>
              <p className="font-semibold text-destructive">
                Geben Sie keine sensiblen, vertraulichen oder personenbezogenen Daten Dritter in die KI-Dienste ein.
              </p>
              <p className="text-muted-foreground">
                Der Nutzer ist allein für die von ihm eingegebenen Inhalte verantwortlich. Die Betreiber übernehmen keine Haftung für die vom Nutzer eingegebenen Daten oder die daraus generierten Ergebnisse. Weitere Informationen zur Datenverarbeitung finden Sie in unserer <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 4 Haftungsausschluss</h2>
              <p className="text-muted-foreground">
                Die Betreiber haften nicht für die von den KI-Diensten generierten Inhalte. Die Inhalte sind fiktiv, können ungenau, unangemessen oder beleidigend sein und spiegeln nicht die Meinung der Betreiber wider. Die Haftung für Schäden, die aus der Nutzung oder Nichtnutzung der angebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, ist grundsätzlich ausgeschlossen, sofern seitens der Betreiber kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 5 Urheberrecht</h2>
              <p className="text-muted-foreground">
                Alle auf dieser Website veröffentlichten Inhalte, insbesondere Texte, Bilder und die Gestaltung, unterliegen dem deutschen Urheberrecht. Die durch die KI-Dienste generierten Texte dürfen im Rahmen der unter <Link href="/lizenz" className="underline">Lizenz</Link> genannten Bedingungen weiterverwendet werden.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline">§ 6 Schlussbestimmungen</h2>
              <p className="text-muted-foreground">
                Sollten einzelne Bestimmungen der AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Die Betreiber behalten sich das Recht vor, die AGB jederzeit zu ändern.
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
