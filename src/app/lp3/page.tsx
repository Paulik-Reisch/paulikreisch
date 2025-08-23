import { Header } from "@/components/landing/header";
import { HeroLP3 } from "@/components/landing/hero-lp3";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Reviews } from "@/components/landing/reviews";
import { ExcerptsTabs } from "@/components/landing/excerpts-tabs";
import { LP2Teaser } from "@/components/landing/lp2-teaser";
import { Footer } from "@/components/landing/footer";

export default function LP3() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroLP3 />
        <CtaBanner />
        <Reviews />
        <ExcerptsTabs />
        <LP2Teaser />
      </main>
      <Footer />
    </div>
  );
}
