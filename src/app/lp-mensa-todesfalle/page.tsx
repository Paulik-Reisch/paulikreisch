import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroMensaTodesfalle } from "@/components/landing/hero-mensa-todesfalle";

export default function MensaTodesfallePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroMensaTodesfalle />
      </main>
      <Footer />
    </div>
  );
}
