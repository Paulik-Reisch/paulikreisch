import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { TopicLPs } from "@/components/landing/topic-lps";
import { Authors } from "@/components/landing/authors";
import { Features } from "@/components/landing/features";
import { LP2Teaser } from "@/components/landing/lp2-teaser";
import { Testimonials } from "@/components/landing/testimonials";
import { Newsletter } from "@/components/landing/newsletter";
import { CtaBanner } from "@/components/landing/cta-banner";
import { RandomTeaser } from "@/components/landing/random-teaser";
import { HW2Teaser } from "@/components/landing/hw2-teaser";
import { Footer } from "@/components/landing/footer";

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
        <CtaBanner />
        <RandomTeaser />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
