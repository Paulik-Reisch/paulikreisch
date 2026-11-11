import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import '../../../tokens.css';
import { ExcerptSlideshow } from './excerpt-slideshow';
import styles from './leseprobe.module.css';

export const metadata: Metadata = {
  title: 'Leseprobe „Hallo Welt“ — Ausgewählte Seiten',
  description: 'Blättere durch ausgewählte Seiten aus „Hallo Welt“ und wirf einen ersten Blick ins Buch.',
  alternates: { canonical: 'https://paulikreisch.de/leseprobe' },
};

const slides = [
  { src: '/leseprobe/seite-58.png', type: 'pdf' as const, alt: 'Seite 58 aus Hallo Welt, hochwertig aus dem PDF gerendert' },
  { src: '/leseprobe/seite-72.png', type: 'pdf' as const, alt: 'Seite 72 aus Hallo Welt, hochwertig aus dem PDF gerendert' },
  { src: '/leseprobe/seite-91.png', type: 'pdf' as const, alt: 'Seite 91 aus Hallo Welt, hochwertig aus dem PDF gerendert' },
  { src: '/leseprobe/seite-96.png', type: 'pdf' as const, alt: 'Seite 96 aus Hallo Welt, hochwertig aus dem PDF gerendert' },
];

export default function LeseprobePage() {
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <section className={styles.readingSample} aria-labelledby="leseprobe-title">
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Hallo Welt · Leseprobe</p>
            <h1 id="leseprobe-title">Ein Blick ins Buch.</h1>
            <p className={styles.description}>
              Hier kannst Du durch ausgewählte Seiten blättern und Dir einen Eindruck verschaffen, was Dir in „Hallo Welt“ alles geboten wird.
            </p>
            <Link href="/shop" className={styles.bookLink}>
              Zum Buch <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <ExcerptSlideshow slides={slides} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
