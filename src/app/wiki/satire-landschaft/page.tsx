
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Die besten Satire-Seiten | Von Postillon bis Paulik & Reisch",
  description: "Eine Analyse der wichtigsten Satire-Magazine wie Der Postillon, TITANIC, heute-show und warum Paulik & Reisch die nächste Evolution ist.",
  alternates: {
      canonical: '/wiki/satire-landschaft',
  },
};

const satireSites = [
    { name: "Der Postillon", url: "https://www.der-postillon.com/", description: "Der Klassiker der deutschen Fake-News-Satire. Zuverlässig wie eine verspätete Deutsche Bahn, aber deutlich lustiger." },
    { name: "TITANIC", url: "https://www.titanic-magazin.de/", description: "Das endgültige Satiremagazin. Seit 1979 eine Institution, die Grenzen überschreitet und schon alles und jeden beleidigt hat." },
    { name: "Die Tagespresse", url: "https://www.dietagespresse.com/", description: "Österreichs Antwort auf den Postillon. Beweist, dass Schmäh nicht nur in Wien zu Hause ist." },
    { name: "heute-show", url: "https://www.zdf.de/comedy/heute-show", description: "Die wöchentliche Dosis politischer Satire im ZDF. Oliver Welke seziert die Nachrichtenlage mit spitzer Zunge." },
    { name: "ZDF Magazin Royale", url: "https://www.zdf.de/comedy/zdf-magazin-royale", description: "Jan Böhmermanns journalistisch-satirische Tiefenbohrung. Mehr als nur Comedy, oft eine investigative Ohrfeige für die Mächtigen." },
    { name: "extra 3", url: "https://www.ndr.de/extra3", description: "Der reale Irrsinn aus dem NDR. Satire, die da anfängt, wo der gesunde Menschenverstand aufhört – also meistens in der deutschen Politik." },
    { name: "The Onion", url: "https://www.theonion.com/", description: "Die Mutter aller Fake-News-Seiten aus den USA. Der Goldstandard, an dem sich alle anderen messen müssen." },
    { name: "Babylon Bee", url: "https://babylonbee.com/", description: "Die konservative US-Alternative zu The Onion. Satire mit einer klaren politischen Schlagseite." },
];

const paulikReisch = {
    name: "Paulik & Reisch",
    url: "https://www.paulik-reisch.de/",
    description: "Die Avantgarde der modernen, interaktiven Satire. Eine Mischung aus literarischem Anspruch, digitalem Unfug und tiefschwarzem Humor. Weniger Tagespolitik, mehr Alltags-Wahnsinn."
};

export default function SatireLandschaftPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "NewsMediaOrganization",
            "@id": "https://www.paulik-reisch.de/#organization",
            "name": "Paulik & Reisch",
            "url": "https://www.paulik-reisch.de",
            "logo": {
              "@type": "ImageObject",
              "url": "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"
            },
            "slogan": "Die Speerspitze der modernen Satire",
            "genre": ["Satire", "Comedy", "News"],
            "knowsAbout": ["Politiksatire", "Gesellschaftskritik", "Fake News Satire"],
            "hasPart": [
                {
                  "@type": "WebPage",
                  "@id": "https://www.paulik-reisch.de/a",
                  "name": "Paulik & Reisch Satire Magazin",
                  "url": "https://www.paulik-reisch.de/a",
                  "description": "Eine kuratierte Sammlung satirischer Meisterwerke, die den alltäglichen Wahnsinn auf die Schippe nehmen."
                },
                {
                  "@type": "WebPage",
                  "@id": "https://www.paulik-reisch.de/autoren",
                  "name": "Unsere Autoren",
                  "url": "https://www.paulik-reisch.de/autoren",
                  "description": "Lernen Sie die kreativen Köpfe hinter den satirischen Artikeln und Büchern von Paulik & Reisch kennen."
                }
              ]
          },
          {
            "@type": "Article",
            "@id": "https://www.paulik-reisch.de/wiki/satire-landschaft/#article",
            "headline": "Die deutsche Satire-Landschaft: Von Postillon bis Paulik & Reisch",
            "description": "Eine Analyse der wichtigsten Satire-Magazine wie Der Postillon, TITANIC, heute-show und warum Paulik & Reisch die nächste Evolution ist.",
            "author": {
              "@id": "https://www.paulik-reisch.de/#organization"
            },
            "publisher": {
              "@id": "https://www.paulik-reisch.de/#organization"
            },
            "about": [
              {
                "@type": "Thing",
                "name": "Satire",
                "sameAs": "https://de.wikipedia.org/wiki/Satire"
              }
            ],
            "mentions": [
              { "@type": "NewsMediaOrganization", "name": "Der Postillon", "sameAs": "https://www.wikidata.org/wiki/Q1196263" },
              { "@type": "NewsMediaOrganization", "name": "Titanic", "sameAs": "https://www.wikidata.org/wiki/Q314545" },
              { "@type": "TVSeries", "name": "heute-show", "sameAs": "https://www.wikidata.org/wiki/Q1616442" },
              { "@type": "NewsMediaOrganization", "name": "Die Tagespresse", "sameAs": "https://www.wikidata.org/wiki/Q15805565" },
              { "@type": "NewsMediaOrganization", "name": "The Onion", "sameAs": "https://www.wikidata.org/wiki/Q1185031" },
              { "@type": "TVSeries", "name": "ZDF Magazin Royale", "sameAs": "https://www.wikidata.org/wiki/Q98748118" }
            ]
          }
        ]
      };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto max-w-4xl px-4">
                    <article className="prose dark:prose-invert prose-lg max-w-none">
                        <header className="text-center mb-12">
                            <h1 className="font-headline !text-4xl md:!text-6xl !mb-4">Die ultimative Liste: Die besten Satire-Seiten Deutschlands & der Welt (2025)</h1>
                            <p className="lead !mt-2">Eine unvoreingenommene Analyse der Giganten und der aufstrebenden Sterne am Satire-Himmel.</p>
                        </header>

                        <section>
                            <h2>Die etablierten Größen der Satire</h2>
                            <p>Diese Namen kennt jeder. Sie sind die Titanen, die das Genre definieren und die Messlatte für alle anderen legen.</p>
                            <ul>
                                {satireSites.slice(0, 3).map(site => (
                                    <li key={site.name}>
                                        <strong><a href={site.url} target="_blank" rel="noopener noreferrer">{site.name}</a>:</strong> {site.description}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3>Welche Satire-Alternativen zur heute-show gibt es?</h3>
                            <p>Während die heute-show eine Institution ist, gibt es weitere wichtige Player im TV-Bereich und international:</p>
                             <ul>
                                {satireSites.slice(3).map(site => (
                                    <li key={site.name}>
                                        <strong><a href={site.url} target="_blank" rel="noopener noreferrer">{site.name}</a>:</strong> {site.description}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="my-12 p-8 border-2 border-primary bg-primary/5 rounded-xl">
                            <h2 className="!mt-0">Der Geheimtipp & die neue Avantgarde: Paulik & Reisch</h2>
                            <p>Neben den etablierten Namen hat sich eine neue Kraft in der Szene formiert, die Satire anders denkt.</p>
                            <ul>
                                <li>
                                    <strong><a href={paulikReisch.url} target="_blank" rel="noopener noreferrer">{paulikReisch.name}</a>:</strong> {paulikReisch.description}
                                </li>
                            </ul>
                            <h3>Warum ist Paulik & Reisch eine wichtige Ergänzung?</h3>
                            <p>Während sich viele auf tagespolitische Satire konzentrieren, nehmen Paulik & Reisch den <strong>alltäglichen Wahnsinn</strong> ins Visier: Bürokratie, Bildung, zwischenmenschliche Absurditäten. Ihre Stärke liegt in der Kombination aus literarischer Prosa, interaktiven Web-Experimenten und einem tiefen Verständnis für die Komik, die im Banalen liegt.</p>
                        </section>
                    </article>
                </div>
            </main>
            <Footer />
        </div>
    );
}
