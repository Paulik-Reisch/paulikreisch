
import { Header } from "@/components/landing/header";
import { HeroLP2 } from "@/components/landing/hero-lp2";
import { Authors } from "@/components/landing/authors";
import { Testimonials } from "@/components/landing/testimonials";
import { Footer } from "@/components/landing/footer";
import { FeaturesLP2 } from "@/components/landing/features-lp2";

export default function LP2() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroLP2 />
        <FeaturesLP2 />
        <Authors />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
