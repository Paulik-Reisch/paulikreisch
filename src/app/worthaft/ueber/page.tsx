import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutWorthaftPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Wie spielt man Worthaft?',
    description: 'Eine Anleitung zum täglichen Rätsel "Worthaft".',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Raten',
        text: 'Sie haben sechs Versuche, das geheime deutsche Wort mit fünf Buchstaben zu erraten.',
        url: 'https://paulik-reisch.de/worthaft/ueber#regeln',
      },
      {
        '@type': 'HowToStep',
        name: 'Hinweise erhalten',
        text: 'Nach jedem Versuch geben Ihnen die Farben einen Hinweis: Blau für korrekte Position, Gelb für korrekten Buchstaben an falscher Position, und Grau, wenn der Buchstabe nicht im Wort enthalten ist.',
        url: 'https://paulik-reisch.de/worthaft/ueber#regeln',
      },
      {
        '@type': 'HowToStep',
        name: 'Gewinnen',
        text: 'Lösen Sie das Rätsel innerhalb von sechs Versuchen, um zu gewinnen.',
        url: 'https://paulik-reisch.de/worthaft/ueber#regeln',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 py-12 md:py-24">
          <div className="container max-w-3xl mx-auto px-4">
            <header className="mb-12">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Spielanleitung</h1>
            </header>
            <article className="prose dark:prose-invert" id="regeln">
              <p>
                Sie haben sechs Versuche, das Wort mit fünf
                Buchstaben zu erraten. Nach jedem Versuch geben Ihnen die Farben
                einen Hinweis:
              </p>
              <ul>
                <li>
                  <span className="p-2 rounded-md font-bold text-primary-foreground mr-2 inline-block" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                    Blau
                  </span>
                    Der Buchstabe ist korrekt und an der richtigen Stelle.
                </li>
                <li>
                  <span className="p-2 rounded-md font-bold text-secondary-foreground mr-2 inline-block" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                    Gelb
                  </span>
                    Der Buchstabe ist im Wort enthalten, aber an der falschen
                  Stelle.
                </li>
                <li>
                  <span className="p-2 rounded-md font-bold mr-2 inline-block" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                    Grau
                  </span>
                    Der Buchstabe kommt im Wort nicht vor.
                </li>
              </ul>
              <h2>Welche Wörter erlauben wir?</h2>
              <ul>
                <li>Substantive (im Singular), darunter auch Namen</li>
                <li>Verben (im Infinitiv)</li>
                <li>Adjektive</li>
              </ul>
              <div className="not-prose text-center mt-12 flex flex-col items-center gap-3">
                  <Link href="/worthaft">
                      <Button size="lg">Genug gelesen!</Button>
                  </Link>
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
