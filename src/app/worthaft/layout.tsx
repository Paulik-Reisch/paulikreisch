import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worthaft - Das tägliche Wortspiel von Paulik & Reisch',
  description: 'Spielen Sie Worthaft, das deutsche Worträtsel im Stil von Wordle. Erraten Sie täglich ein neues Wort mit fünf Buchstaben. Kostenlos und herausfordernd. Eine Hommage von Paulik & Reisch.',
  keywords: ['Worthaft', 'Wordle', 'Wortspiel', 'Rätsel', 'Deutsch', 'Worträtsel', 'täglich', 'kostenlos', 'Paulik & Reisch', 'Wördle', 'Wortspiel online'],
  openGraph: {
    title: 'Worthaft - Das tägliche Wortspiel von Paulik & Reisch',
    description: 'Fordern Sie Ihren Wortschatz heraus! Erraten Sie das tägliche Wort mit fünf Buchstaben.',
    url: 'https://paulik-reisch.de/worthaft',
    siteName: 'Paulik & Reisch',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/og-image-worthaft.png?alt=media&token=8d2e85a6-3823-45c1-92e1-4560d2b51f0f',
        width: 1200,
        height: 630,
        alt: 'Worthaft Spielbrett mit dem Logo von Paulik & Reisch',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Worthaft: Können Sie das Wort des Tages erraten?',
    description: 'Das süchtig machende Wortspiel von Paulik & Reisch. Täglich neu, täglich eine Herausforderung.',
    images: ['https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/og-image-worthaft.png?alt=media&token=8d2e85a6-3823-45c1-92e1-4560d2b51f0f'],
    creator: '@paulikreisch',
  },
  alternates: {
    canonical: '/worthaft',
  },
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/logos%2Fworthaft.svg?alt=media&token=c63037f9-af2e-4fac-94b5-0679e776a14f',
  },
};

export default function WorthaftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
