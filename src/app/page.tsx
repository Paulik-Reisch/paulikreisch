import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { TopicLPs } from "@/components/landing/topic-lps";
import { Authors } from "@/components/landing/authors";
import { Features } from "@/components/landing/features";
import { LP2Teaser } from "@/components/landing/lp2-teaser";
import { Testimonials } from "@/components/landing/testimonials";
import { Newsletter } from "@/components/landing/newsletter";
import { Footer } from "@/components/landing/footer";
import { CtaBanner } from "@/components/landing/cta-banner";
import { LP4Teaser } from "@/components/landing/lp4-teaser";
import { RandomTeaser } from "@/components/landing/random-teaser";
import { CountdownTeaser } from "@/components/landing/countdown-teaser";
import { HW2Teaser } from "@/components/landing/hw2-teaser";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <TopicLPs />
        <HW2Teaser />
        <Authors />
        <Features />
        <LP2Teaser />
        <Testimonials />
        <LP4Teaser />
        <CtaBanner />
        <RandomTeaser />
        <CountdownTeaser />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
