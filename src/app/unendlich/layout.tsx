
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unendlich - Das 2048-Spiel von Paulik & Reisch',
  description: 'Spielen Sie Unendlich, das 2048-Spiel mit einem satirischen Twist. Kombinieren Sie Ideen zu einem Meisterwerk. Einmal täglich, eine neue Herausforderung.',
  keywords: ['Unendlich', '2048', 'Spiel', 'Rätsel', 'Logikspiel', 'Paulik & Reisch', 'Kachelspiel'],
  openGraph: {
    title: 'Unendlich - Das 2048-Spiel von Paulik & Reisch',
    description: 'Fordern Sie Ihr logisches Denken heraus. Können Sie die "Hallo Welt"-Kachel erreichen?',
    url: 'https://paulik-reisch.de/unendlich',
    siteName: 'Paulik & Reisch',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unendlich: Das 2048-Spiel mit satirischem Twist',
    description: 'Kombinieren Sie Kacheln von der Idee bis zum Bestseller. Täglich eine neue Herausforderung von Paulik & Reisch.',
    creator: '@paulikreisch',
  },
  alternates: {
    canonical: '/unendlich',
  },
};

export default function UnendlichLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
