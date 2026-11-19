import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wikiland – entdecke den verborgenen Artikel',
  description: 'Errate Wörter, decke den verborgenen Wikipedia-Artikel auf und finde seinen Titel. Tagesrätsel und freie Runden ohne Konto.',
  alternates: { canonical: 'https://paulikreisch.de/wikiland' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Wikiland – Paulik & Reisch Game Labs',
    description: 'Wort für Wort zum Wissen: Welcher Artikel steckt hinter den schwarzen Balken?',
    url: 'https://paulikreisch.de/wikiland',
    type: 'website',
  },
};

export default function WikilandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
