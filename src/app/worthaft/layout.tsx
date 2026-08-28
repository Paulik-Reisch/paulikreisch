import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worthaft – Paulik & Reisch Satire',
  description: 'Das tägliche Worträtsel von Paulik & Reisch: knackige Rätsel, deutsche Wörter und ein Hauch Satire. Probier Worthaft und werde zum Wort-Meister!',
  applicationName: 'Worthaft – Paulik & Reisch Satire',
  themeColor: '#686868',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  openGraph: {
    title: 'Worthaft – Das Paulik & Reisch Worträtsel',
    description: 'Ein tägliches Worträtsel mit deutschen Wörtern und satirischem Charme. Wie viele Versuche brauchst du? Jetzt spielen!',
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
