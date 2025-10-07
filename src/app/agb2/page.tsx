
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function Agb2Page() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <article className="prose prose-lg dark:prose-invert mx-auto">
                <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
                
                <h2>§ 1 Geltungsbereich</h2>
                <p>Für die Geschäftsbeziehung zwischen Paulik & Reisch (nachfolgend "Anbieter") und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>

                <h2>§ 2 Vertragsschluss</h2>
                <p>Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Abgabe einer Bestellung dar. Durch Anklicken des Buttons "Jetzt kaufen" geben Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab. Der Kaufvertrag kommt zustande, wenn wir Ihre Bestellung durch eine Auftragsbestätigung per E-Mail unmittelbar nach dem Erhalt Ihrer Bestellung annehmen.</p>

                <h2>§ 3 Widerrufsrecht</h2>
                <p>Verbrauchern steht grundsätzlich ein Widerrufsrecht zu. Nähere Informationen zum Widerrufsrecht ergeben sich aus der Widerrufsbelehrung des Anbieters.</p>
                <p>Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind (z.B. Bücher mit persönlicher Widmung).</p>

                <h2>§ 4 Preise und Zahlungsbedingungen</h2>
                <p>Alle Preise, die auf der Website des Anbieters angegeben sind, verstehen sich einschließlich der jeweils gültigen gesetzlichen Umsatzsteuer.</p>
                <p>Die Zahlung erfolgt per Vorkasse, Kreditkarte oder PayPal. Die Belastung Ihres Kreditkartenkontos erfolgt mit Abschluss der Bestellung.</p>

                <h2>§ 5 Lieferung</h2>
                <p>Sofern nicht anders vereinbart, erfolgt die Lieferung an die vom Kunden angegebene Lieferadresse. Die Lieferzeit beträgt in der Regel 3-5 Werktage nach Vertragsschluss.</p>

                <h2>§ 6 Eigentumsvorbehalt</h2>
                <p>Bis zur vollständigen Bezahlung bleibt die gelieferte Ware im Eigentum des Anbieters.</p>

                <h2>§ 7 Gewährleistung</h2>
                <p>Es gelten die gesetzlichen Gewährleistungsregelungen.</p>

                <h2>§ 8 Haftung</h2>
                <p>Für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen Pflichtverletzung des Anbieters beruhen, haftet der Anbieter unbeschränkt.</p>
                <p>Bei den satirischen Inhalten der angebotenen Werke handelt es sich um fiktionale Darstellungen. Eine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der dargestellten Inhalte ist ausgeschlossen.</p>
                
                <h2>§ 9 Schlussbestimmungen</h2>
                <p>Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden oder eine Lücke enthalten, so bleiben die übrigen Bestimmungen hiervon unberührt.</p>
            </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
