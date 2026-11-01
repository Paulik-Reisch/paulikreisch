import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bits – das Logikspiel mit 0 und 1',
  description: 'Zwei Zeichen, drei Regeln: Spiele Bits in 4×4, 6×6 oder 8×8. Kostenlos, ohne Konto, mit Spielstand im eigenen Cookie.',
  alternates: { canonical: 'https://paulikreisch.de/game-labs/bits' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Bits – Paulik & Reisch Game Labs',
    description: 'Eine kleine Denkpause mit Nullen und Einsen. Drei Regeln. Ein eindeutiges Rätsel.',
    url: 'https://paulikreisch.de/game-labs/bits',
    type: 'website',
  },
};

export default function BitsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
