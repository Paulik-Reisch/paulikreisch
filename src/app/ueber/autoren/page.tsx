
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Authors } from "@/components/landing/authors";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Über die Autoren",
    description: "Lerne die kreativen und chaotischen Köpfe hinter der „Hallo Welt“-Buchreihe kennen: Philipp Paulik, Maximilian Reisch und den Illustrator Luin Schiffbauer.",
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
        "@type": "Organization",
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
              "@id": "https://www.paulikreisch.de/autoren",
              "name": "Unsere Autoren",
              "url": "https://www.paulikreisch.de/autoren",
              "description": "Lerne die kreativen Köpfe hinter den Büchern und Projekten von Paulik & Reisch kennen."
            }
          ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-[oklch(21%_0.012_85)]">
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
