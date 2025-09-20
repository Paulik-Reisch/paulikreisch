import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroLP5 } from "@/components/landing/hero-lp5";
import { CtaBanner } from "@/components/landing/cta-banner";

export default function LP5Page() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroLP5 />
        <div className="h-[20vh] bg-background" />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
