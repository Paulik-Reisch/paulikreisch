import type { Metadata } from 'next';
import { LegalPage } from "@/components/landing/legal-page";
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  title: "Widerrufsbelehrung",
  description: "Informationen zum Widerrufsrecht beim Erwerb unserer Bücher über Drittanbieter.",
  path: '/widerruf',
});

export default function WiderrufPage() {
  return (
    <>
      <LegalPage title={"Widerrufs\u00ADbelehrung"} description="Informationen zum Widerrufsrecht beim Erwerb unserer Bücher über Drittanbieter.">
          <p>Unsere Shopseite verlinkt auf externe Angebote. Welcher Händler Dein Vertragspartner ist, ergibt sich aus dem jeweiligen Angebot und Deiner Bestellbestätigung. Bitte beachte die dort bereitgestellte Widerrufsbelehrung. Die folgenden Hinweise erläutern allgemeine gesetzliche Regeln und ersetzen die Widerrufsbelehrung Deines Vertragspartners nicht.</p>

          <h2>1. Widerrufsrecht</h2>
          <p>Die gesetzliche Widerrufsfrist beträgt grundsätzlich vierzehn Tage. Bei gedruckten Büchern beginnt sie im Regelfall mit dem Erhalt der Ware durch Dich oder einen von Dir benannten Dritten, der nicht Frachtführer ist. Bei nicht auf einem körperlichen Datenträger gelieferten digitalen Inhalten beginnt sie grundsätzlich mit Vertragsschluss. Der Fristbeginn setzt außerdem die gesetzlich vorgeschriebene Unterrichtung voraus (§§ 355, 356 Abs. 2 und 3 BGB).</p>

          <h2>2. Vorzeitiger Verlust des Widerrufsrechts</h2>
          <p>Bei kostenpflichtigen digitalen Inhalten, die nicht auf einem körperlichen Datenträger bereitgestellt werden, kann das Widerrufsrecht nach § 356 Abs. 6 Nr. 2 BGB vorzeitig erlöschen. Dafür muss der Unternehmer mit der Vertragserfüllung begonnen haben, Du musst dem Beginn vor Ablauf der Widerrufsfrist ausdrücklich zugestimmt und Deine Kenntnis vom dadurch eintretenden Verlust des Widerrufsrechts bestätigt haben. Außerdem muss der Unternehmer Dir eine Bestätigung nach § 312f BGB zur Verfügung gestellt haben.</p>

          <h2>3. Widerrufsfolgen</h2>
          <p>Nach einem wirksamen Widerruf sind die empfangenen Leistungen grundsätzlich unverzüglich, spätestens nach vierzehn Tagen zurückzugewähren. Bei Waren kann der Unternehmer die Rückzahlung unter den Voraussetzungen des § 357 Abs. 4 BGB bis zum Erhalt der Ware oder eines Versandnachweises verweigern. Die unmittelbaren Rücksendekosten trägst Du, wenn der Unternehmer Dich gesetzeskonform darüber informiert hat und nicht selbst ihre Übernahme zugesagt hat (§ 357 Abs. 5 BGB).</p>

          <h2>4. Zuständige Stelle für Rücksendungen und Erklärungen</h2>
          <p>Richte Widerrufserklärungen und Rücksendungen an den in Deinem Angebot bzw. Deiner Bestellbestätigung genannten Vertragspartner. Nutze die dort angegebenen Kontakt- und Rücksendewege. Die genaue Anschrift und ein gegebenenfalls bereitgestelltes Musterformular findest Du in dessen Widerrufsbelehrung.</p>

          <p className="text-sm text-muted-foreground mt-8">Verantwortlich für diese Information: Philipp Paulik (siehe Impressum).</p>
      </LegalPage>
    </>
  );
}
