import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game Labs – Paulik & Reisch',
  description: 'Experimentelle Mini-Games und Rätsel von Paulik & Reisch. Alpha-Stage — nicht für Produktion.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Game Labs – Paulik & Reisch',
    description: 'Experimentelle Mini-Games und Rätsel. Alpha-Version.',
    type: 'website',
  },
};

export default function GameLabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}