import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Impressum – Paulik & Reisch",
  description: "Anbieterkennzeichnung von Paulik & Reisch gemäß §§ 5, 6 DDG.",
};

export default function ImpressumPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <article className="prose prose-lg dark:prose-invert mx-auto max-w-2xl">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Impressum</h1>
            <p className="text-sm text-muted-foreground">Angaben gemäß §§ 5, 6 des Digitale-Dienste-Gesetzes (DDG)</p>

            <h2>Anbieter</h2>
            <p>
              Paulik &amp; Reisch<br />
              Vertreten durch die Gesellschafter<br />
              Philipp Paulik und Maximilian Reisch<br />
              Mozartstraße 1<br />
              53819 Neunkirchen-Seelscheid<br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              E-Mail: philipp.l.paulik@gmail.com<br />
              E-Mail: maximilian.reisch@t-online.de
            </p>

            <h2>Verantwortlich für journalistisch-redaktionelle Angebote</h2>
            <p>
              Gemäß § 18 Abs. 2 des Medienstaatsvertrags (MStV):<br />
              Philipp Paulik<br />
              Mozartstraße 1<br />
              53819 Neunkirchen-Seelscheid<br />
              Deutschland
            </p>

            <h2>EU-Streitbeilegung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer"> https://ec.europa.eu/consumers/odr/</a>.
              Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <h2>Haftungshinweis</h2>
            <p>
              Für die Inhalte dieses Satire-Angebots gilt: Sämtliche Beiträge, Artikel und Texte verfolgen
              ausschließlich einen unterhaltsamen, satirischen Zweck und sind nicht als Tatsachenbehauptungen
              zu verstehen. Eine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der Inhalte wird
              — soweit gesetzlich zulässig — ausgeschlossen.
            </p>

            <h2>Urheberrecht</h2>
            <p>
              Die durch die Betreiber dieser Seiten erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
