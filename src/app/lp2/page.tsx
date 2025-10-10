
import { Header } from "@/components/landing/header";
import { HeroLP2 } from "@/components/landing/hero-lp2";
import { Footer } from "@/components/landing/footer";
import { FeaturesLP2 } from "@/components/landing/features-lp2";
import { CountdownTeaser } from "@/components/landing/countdown-teaser";
import { HW2Teaser } from "@/components/landing/hw2-teaser";
import { AboutAuthorsLP2 } from "@/components/landing/about-authors-lp2";

export default function LP2() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroLP2 />
        <FeaturesLP2 />
        <AboutAuthorsLP2 />
        <CountdownTeaser />
        <HW2Teaser />
      </main>
      <Footer />
    </div>
  );
}
