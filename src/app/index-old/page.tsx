import { Header } from "@/components/landing/header";
import { HeroAb } from "@/components/landing/hero-ab";
import { Authors } from "@/components/landing/authors";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Newsletter } from "@/components/landing/newsletter";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";
import { Product, getSeoMetadata } from "@/lib/firestore";
import { CountdownBanner } from "@/components/landing/countdown-banner";
import type { Metadata, ResolvingMetadata } from 'next'
import { WorthaftTeaser } from '@/components/landing/worthaft-teaser';
import { WorthaftPopup } from "@/components/landing/WorthaftPopup";

export const metadata: Metadata = {
  title: { absolute: 'Archiv der Startseite | Paulik & Reisch' },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: '/' },
};

const hw1: Product = {
    id: "hw1",
    title: "Hallo Welt",
    subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
    price: 10.99,
    imageSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-mockup-1.png?alt=media&token=c736447b-585c-410e-b2c9-b3fd9c726c58",
    aiHint: "book cover satire",
    amazonLink: "https://www.amazon.de/Hallo-Welt-unerh%C3%B6rten-Bildungsgang-Lernvollzugsanstalt/dp/3982548803",
    description: "Die satirische Abrechnung mit dem Schulsystem, Lehrern als Beamtenrobotern und dem täglichen Wahnsinn des Erwachsenwerdens."
};

export default async function Home() {
  // A4: Kein zweites Organization-Objekt — globale @id aus layout.tsx wiederverwenden
  // Nur WebPage-Anreicherung (hasPart) auf der Homepage, keine Duplikat-Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://paulikreisch.de/#homepage",
    url: "https://paulikreisch.de",
    name: "Hallo Welt — Das satirische Buch über Schule | Paulik & Reisch",
    isPartOf: { "@id": "https://paulikreisch.de/#website" },
    about: { "@id": "https://paulikreisch.de/#organization" },
    hasPart: [
        {
          "@type": "WebPage",
          "@id": "https://paulikreisch.de/autoren",
          name: "Unsere Autoren",
          url: "https://paulikreisch.de/autoren",
          description: "Lernen Sie die kreativen Köpfe hinter den Büchern von Paulik & Reisch kennen."
        }
      ]
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1" suppressHydrationWarning>
        <HeroAb product={hw1} />
        <WorthaftTeaser />
        <Features />
        <Authors />
        <Testimonials />
        <CtaBanner />
        <Newsletter />
      </main>
      <Footer />
      <WorthaftPopup />
    </div>
  );
}
