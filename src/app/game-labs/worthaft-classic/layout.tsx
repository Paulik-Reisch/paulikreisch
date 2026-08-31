import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worthaft Classic – Paulik & Reisch Game Labs',
  description: 'Die originale Worthaft-Version — ohne Joker, Animationen & Settings. Puristisches Worträtsel.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Worthaft Classic – Paulik & Reisch Game Labs',
    description: 'Original Worthaft ohne Extras. Alpha-Version.',
    type: 'website',
  },
};

export default function WorthaftClassicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}