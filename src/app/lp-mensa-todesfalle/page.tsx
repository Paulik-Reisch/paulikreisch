import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroMensaTodesfalle } from "@/components/landing/hero-mensa-todesfalle";
import { MensaGuessingGame } from "@/components/landing/mensa-guessing-game";

export default function MensaTodesfallePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroMensaTodesfalle />
        <MensaGuessingGame />
      </main>
      <Footer />
    </div>
  );
}
