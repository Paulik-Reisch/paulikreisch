import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroMensaTodesfalle } from "@/components/landing/hero-mensa-todesfalle";
import { MensaGuessingGame } from "@/components/landing/mensa-guessing-game";
import { MensaAnatomy } from "@/components/landing/MensaAnatomy";
import { MensaRules } from "@/components/landing/MensaRules";
import { MensaFAQ } from "@/components/landing/MensaFAQ";
import { MensaCTA } from "@/components/landing/MensaCTA";

export default function MensaTodesfallePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroMensaTodesfalle />
        <MensaGuessingGame />
        <MensaAnatomy />
        <MensaRules />
        <MensaFAQ />
        <MensaCTA />
      </main>
      <Footer />
    </div>
  );
}
