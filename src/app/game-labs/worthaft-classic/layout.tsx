import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worthaft Classic – Paulik & Reisch Game Labs',
  description: 'Die originale Worthaft-Version — ohne Joker, Animationen & Settings. Puristisches Wordle-Erlebnis.',
  robots: 'noindex',
};

export default function WorthaftClassicLayout({ children }: { children: React.ReactNode }) {
  return children;
}