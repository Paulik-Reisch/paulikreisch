import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSportIstMord } from "@/components/landing/hero-sport-ist-mord";
import { DeathDevices } from "@/components/landing/DeathDevices";

export default function SportIstMordPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSportIstMord />
        <DeathDevices />
      </main>
      <Footer />
    </div>
  );
}
