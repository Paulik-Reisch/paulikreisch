import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hangman – Paulik & Reisch Game Labs',
  description: 'Klassisches Galgenmännchen mit deutschen Wörtern. Errate das Wort bevor der Strichmännchen komplett ist!',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Hangman – Paulik & Reisch Game Labs',
    description: 'Galgenmännchen auf Deutsch. Alpha-Version im Game Labs.',
    type: 'website',
  },
};

export default function HangmanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}