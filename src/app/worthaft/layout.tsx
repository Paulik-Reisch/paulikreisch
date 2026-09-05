import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#686868',
};

export const metadata: Metadata = {
  title: 'Worthaft – Paulik & Reisch Satire',
  description: 'Das tägliche Worträtsel von Paulik & Reisch: knackige Rätsel, deutsche Wörter und ein Hauch Satire. Probier Worthaft und werde zum Wort-Meister!',
  applicationName: 'Worthaft – Paulik & Reisch Satire',
  openGraph: {
    title: 'Worthaft – Das Paulik & Reisch Worträtsel',
    description: 'Ein tägliches Worträtsel mit deutschen Wörtern und satirischem Charme. Wie viele Versuche brauchst du? Jetzt spielen!',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Worthaft%2Fworthaft-2-0-beta.png?alt=media&token=ed5089ce-3117-4ad1-8e9e-6b2f1f6e31d6',
        width: 1200,
        height: 630,
        alt: 'Worthaft – Das Paulik & Reisch Worträtsel',
      },
    ],
  },
  icons: {
    icon: '/worthaft_favicon.ico',
  },
};

export default function WorthaftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
