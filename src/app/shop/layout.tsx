import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buch „Hallo Welt" — 106 Seiten Schulsatire für 10,99 € | Paulik & Reisch',
  description: '„Hallo Welt" — erhebliche Kritik am Bildungsgang der Lernvollzugsanstalt SK-S. 106 Seiten, 10,99 € statt 20,99 € auf Amazon. Leseprobe + 5★ Rezensionen. Jetzt sichern.',
  alternates: { canonical: 'https://paulikreisch.de/shop' },
  openGraph: {
    title: 'Buch „Hallo Welt" — Schulsatire, die sitzt',
    description: '106 Seiten Premium-Zynismus über die Lernvollzugsanstalt. 10,99 € auf Amazon — Aktion bis Monatsende.',
    url: 'https://paulikreisch.de/shop',
    type: 'website',
    images: [{ url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=11face52-02a0-49d8-9f2f-12e2fe8d28115', width: 900, height: 1200, alt: 'Hallo Welt — Buch von Paulik & Reisch' }],
  },
  robots: { index: true, follow: true },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
