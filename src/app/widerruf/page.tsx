import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Widerrufsbelehrung – Paulik & Reisch",
  description: "Informationen zum Widerrufsrecht beim Erwerb unserer Bücher über Drittanbieter.",
};

export default function WiderrufPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-headline text-4xl md:text-5xl mb-8">Widerrufsbelehrung</h1>

        <div className="prose prose-lg space-y-6 text-foreground/80">
          <p>
            Der Vertrieb der Buchprodukte &bdquo;Hallo Welt&rdquo; und verwandter Publikationen erfolgt
            ausschließlich über die Distributionsplattformen Amazon (Kindle Direct Publishing / Amazon Media
            EU S.à r.l.) sowie Google Play Books. Einzelhändler im Sinne dieser Hinweise ist mithin der
            jeweilige Plattformbetreiber, nicht der Anbieter dieser Webpräsenz. Die nachfolgende
            Widerrufsinformation dient der transparenzfördernden Aufklärung und verweist hinsichtlich der
            vertraglichen Abwicklung auf die jeweilige Plattform.
          </p>

          <h2>1. Widerrufsrecht</h2>
          <p>
            Ihnen steht grundsätzlich ein Widerrufsrecht gemäß § 355 BGB zu. Die Widerrufsfrist beträgt
            vierzehn Tage ab dem Tag des Vertragsschlusses. Im Falle von digitalen Inhalten, die nicht auf
            einem körperlichen Datenträger geliefert werden, beginnt die Frist mit dem Tag des Vertragsschlusses,
            sofern Sie zuvor ausdrücklich zugestimmt haben, dass mit der Ausführung vor Ablauf der
            Widerrufsfrist begonnen wird, und Ihre Kenntnis davon bestätigt haben, dass Sie durch die
            Zustimmung mit dem Beginn der Ausführung Ihr Widerrufsrecht verlieren (§ 356 Abs. 3, § 357 Abs. 6 BGB).
          </p>

          <h2>2. Vorzeitiger Verlust des Widerrufsrechts</h2>
          <p>
            Bei der Lieferung von digitalen Inhalten, die nicht auf einem körperlichen Datenträger
            bereitgestellt werden, erlischt Ihr Widerrufsrecht vorzeitig, sobald der Anbieter mit der
            Ausführung des Vertrages begonnen hat, nachdem Sie hierzu ausdrücklich Ihre Zustimmung erteilt
            und gleichzeitig Ihre Kenntnisnahme davon bestätigt haben, dass Sie mit der Ausführung den
            Verlust des Widerrufsrechts bewirken (§ 356 Abs. 3 Nr. 3 BGB). Dies betrifft insbesondere den
            unmittelbaren Download oder das Streaming der digitalen Ausgabe.
          </p>

          <h2>3. Widerrufsfolgen</h2>
          <p>
            Im Falle eines wirksamen Widerrufs sind die empfangenen Leistungen unverzüglich, spätestens
            binnen vierzehn Tagen, zurückzugewähren. Etwaige Zahlungen werden nach Maßgabe der jeweiligen
            Plattformbedingungen zurückerstattet. Die Rücksendekosten trägt bei wirksamem Widerruf grundsätzlich
            der Unternehmer, sofern nicht über die gesetzliche Informationspflicht hinausgehend anders
            vereinbart.
          </p>

          <h2>4. Zuständige Stelle für Rücksendungen &amp; Erklärungen</h2>
          <p>
            Widerrufserklärungen und Rücksendungen richten Sie bitte an den jeweiligen Plattformbetreiber,
            über dessen Intermediär Sie die Bestellung aufgegeben haben:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Amazon Media EU S.à r.l. (Kindle Direct Publishing) – über Ihr Amazon-Kundenkonto</li>
            <li>Google Play Books (Google Commerce Limited) – über Ihr Google-Konto</li>
          </ul>
          <p>
            Eine Muster-Widerrufsformular stellt die jeweilige Plattform in ihrem Bestellbereich zur Verfügung.
            Der Anbieter dieser Webpräsenz nimmt selbst keine Bestellungen entgegen und ist folglich nicht
            Vertragspartner im Sinne des § 312g BGB.
          </p>

          <h2>5. Ausschluss des Widerrufsrechts</h2>
          <p>
            Das Widerrufsrecht ist ausgeschlossen bei Verträgen zur Lieferung von nicht auf einem körperlichen
            Datenträger befindlichen digitalen Inhalten, die zum sofortigen Download oder zur sofortigen
            Ausführung bereitgestellt werden, sofern Sie zuvor ausdrücklich zugestimmt haben und bestätigt
            haben, dass Sie hierdurch Ihr Widerrufsrecht verlieren (§ 356 Abs. 3 Nr. 3 BGB).
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Verantwortlich für diese Information: Philipp Paulik (siehe Impressum).
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
