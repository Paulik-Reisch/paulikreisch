import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#686868',
};

export const metadata: Metadata = {
  title: 'Worthaft',
  description: 'Das tägliche Worträtsel',
  applicationName: 'Worthaft | Paulik & Reisch',
  alternates: { canonical: '/worthaft' },
  openGraph: {
    title: 'Worthaft',
    description: 'Das tägliche Worträtsel',
    url: 'https://paulikreisch.de/worthaft',
  },
  twitter: {
    title: 'Worthaft',
    description: 'Das tägliche Worträtsel',
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
