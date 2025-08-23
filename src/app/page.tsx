import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Authors } from "@/components/landing/authors";
import { Features } from "@/components/landing/features";
import { LP2Teaser } from "@/components/landing/lp2-teaser";
import { Testimonials } from "@/components/landing/testimonials";
import { Newsletter } from "@/components/landing/newsletter";
import { Footer } from "@/components/landing/footer";
import { ExcerptTeaser } from "@/components/landing/excerpt-teaser";
import { CtaBanner } from "@/components/landing/cta-banner";
import { LP4Teaser } from "@/components/landing/lp4-teaser";
import { SocialShare } from "@/components/landing/social-share";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <Authors />
        <Features />
        <ExcerptTeaser />
        <LP2Teaser />
        <Testimonials />
        <LP4Teaser />
        <CtaBanner />
        <SocialShare />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
