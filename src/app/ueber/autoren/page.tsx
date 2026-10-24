
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Authors } from "@/components/landing/authors";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Über die Autoren | Paulik & Reisch",
    description: "Lernen Sie die kreativen und chaotischen Köpfe hinter der 'Hallo Welt'-Buchreihe kennen: Philipp Paulik, Maximilian Reisch und den Illustrator Luin Schiffbauer.",
    alternates: {
      canonical: '/ueber/autoren',
    },
  };
}

export default function UeberAutorenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "@id": "https://www.paulikreisch.de/#organization",
        "name": "Paulik & Reisch",
        "url": "https://www.paulikreisch.de",
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
              "@id": "https://www.paulikreisch.de/a",
              "name": "Paulik & Reisch Satire-Magazin",
              "url": "https://www.paulikreisch.de/a",
              "description": "Eine kuratierte Sammlung satirischer Meisterwerke, die den alltäglichen Wahnsinn auf die Schippe nehmen."
            },
            {
              "@type": "WebPage",
              "@id": "https://www.paulikreisch.de/autoren",
              "name": "Unsere Autoren",
              "url": "https://www.paulikreisch.de/autoren",
              "description": "Lernen Sie die kreativen Köpfe hinter den satirischen Artikeln und Büchern von Paulik & Reisch kennen."
            }
          ]
      },
      {
        "@type": "Article",
        "@id": "https://www.paulikreisch.de/ratgeber/satire-schreiben/#article",
        "headline": "Die deutsche Satire-Landschaft: Von Postillon bis Paulik & Reisch",
        "description": "Eine Analyse der wichtigsten Satire-Magazine wie Der Postillon, TITANIC, heute-show und warum Paulik & Reisch die nächste Evolution ist.",
        "author": {
          "@id": "https://www.paulikreisch.de/#organization"
        },
        "publisher": {
          "@id": "https://www.paulikreisch.de/#organization"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Satire",
            "sameAs": "https://de.wikipedia.org/wiki/Satire"
          }
        ],
        "mentions": [
          {
            "@type": "NewsMediaOrganization",
            "name": "Der Postillon",
            "sameAs": "https://www.wikidata.org/wiki/Q1196263"
          },
          {
            "@type": "NewsMediaOrganization",
            "name": "Titanic",
            "sameAs": "https://www.wikidata.org/wiki/Q314545"
          },
          {
            "@type": "TVSeries",
            "name": "heute-show",
            "sameAs": "https://www.wikidata.org/wiki/Q1616442"
          },
          {
            "@type": "NewsMediaOrganization",
            "name": "Die Tagespresse",
            "sameAs": "https://www.wikidata.org/wiki/Q15805565"
          },
          {
            "@type": "NewsMediaOrganization",
            "name": "The Onion",
            "sameAs": "https://www.wikidata.org/wiki/Q1185031"
          },
          {
            "@type": "NewsMediaOrganization",
            "name": "ZDF Magazin Royale",
            "sameAs": "https://www.wikidata.org/wiki/Q98748118"
          }
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
      <main className="flex-1">
        <Authors variant="editorial" />
      </main>
      <Footer />
    </div>
  );
}
