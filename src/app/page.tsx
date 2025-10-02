
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { TopicLPs } from "@/components/landing/topic-lps";
import { Authors } from "@/components/landing/authors";
import { Features } from "@/components/landing/features";
import { LP2Teaser } from "@/components/landing/lp2-teaser";
import { Testimonials } from "@/components/landing/testimonials";
import { Newsletter } from "@/components/landing/newsletter";
import { CtaBanner } from "@/components/landing/cta-banner";
import { HW2Teaser } from "@/components/landing/hw2-teaser";
import { Footer } from "@/components/landing/footer";
import { Product } from "@/lib/firestore";
import { CountdownBanner } from "@/components/landing/countdown-banner";
import { Separator } from "@/components/ui/separator";

const hw1: Product = {
    id: "hw1",
    title: "Hallo Welt",
    subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
    price: 10.99,
    imageSrc: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-mockup-1.png?alt=media&token=c82b73e5-76bd-490d-a65f-008a3bfac00b",
    aiHint: "book cover satire",
    amazonLink: "https://www.amazon.de/Hallo-Welt-unerh%C3%B6rten-Bildungsgang-Lernvollzugsanstalt/dp/3982548803",
    description: "Die satirische Abrechnung mit dem Schulsystem, Lehrern als Beamtenrobotern und dem täglichen Wahnsinn des Erwachsenwerdens."
};

export default async function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero product={hw1} />
        <TopicLPs />
        <HW2Teaser />
        <Authors />
        <Features />
        <LP2Teaser />
        <Testimonials />
        <CtaBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
