import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#686868',
};

export const metadata: Metadata = {
  title: 'Worthaft',
  description: 'Worthaft: Das tägliche deutsche Worträtsel',
  applicationName: 'Worthaft | Paulik & Reisch',
  alternates: { canonical: '/worthaft' },
  openGraph: {
    title: 'Worthaft',
    description: 'Worthaft: Das tägliche Worträtsel',
    url: 'https://paulikreisch.de/worthaft',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Worthaft%2Fworthaft-2-0-beta.png?alt=media&token=ed5089ce-3117-4ad1-8e9e-6b2f1f6e31d6',
        width: 1200,
        height: 630,
        alt: 'Worthaft – Das Paulik & Reisch Worträtsel',
      },
    ],
  },
  twitter: {
    title: 'Worthaft',
    description: 'Worthaft: Das tägliche Worträtsel',
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
