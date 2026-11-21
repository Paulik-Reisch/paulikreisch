import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import "../../../../tokens.css";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorthaftColorExplanation } from "./instruction-colors";

export const metadata: Metadata = pageMetadata({title:'Worthaft: Spielanleitung', description:'Die Regeln von Worthaft: sechs Versuche, fünf Buchstaben und farbige Hinweise. So funktioniert das tägliche Worträtsel.', path:'/worthaft/ueber'});

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
        text: 'Du hast sechs Versuche, das geheime deutsche Wort mit fünf Buchstaben zu erraten.',
        url: 'https://paulikreisch.de/worthaft/ueber#regeln',
      },
      {
        '@type': 'HowToStep',
        name: 'Hinweise erhalten',
        text: 'Nach jedem Versuch geben Dir die Farben einen Hinweis: Blau für korrekte Position, Gelb für korrekten Buchstaben an falscher Position, und Grau, wenn der Buchstabe nicht im Wort enthalten ist.',
        url: 'https://paulikreisch.de/worthaft/ueber#regeln',
      },
      {
        '@type': 'HowToStep',
        name: 'Gewinnen',
        text: 'Löse das Rätsel innerhalb von sechs Versuchen, um zu gewinnen.',
        url: 'https://paulikreisch.de/worthaft/ueber#regeln',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pr-home flex flex-col min-h-screen bg-[var(--color-paper)]">
        <Header />
        <main className="flex-1 py-12 md:py-24">
          <div className="container max-w-3xl mx-auto px-4">
            <header className="mb-12">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Spielanleitung</h1>
            </header>
            <article className="prose dark:prose-invert" id="regeln">
              <p>
                Du hast sechs Versuche, das Wort mit fünf
                Buchstaben zu erraten. Nach jedem Versuch geben Dir die Farben
                einen Hinweis:
              </p>
              <WorthaftColorExplanation />
              <h2>Welche Wörter erlauben wir?</h2>
              <ul>
                <li>Substantive (im Singular), darunter auch Namen</li>
                <li>Verben (im Infinitiv)</li>
                <li>Adjektive</li>
              </ul>
              <div className="not-prose text-center mt-12 flex flex-col items-center gap-3">
                  <Link href="/worthaft">
                      <Button size="lg" className="rounded-[10px] bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-ink)] hover:opacity-90">Verstanden!</Button>
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
