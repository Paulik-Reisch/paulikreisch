
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroBeamtenWartezeitenSimulator } from "@/components/landing/hero-beamten-wartezeiten-simulator";

export default function BeamtenWartezeitenSimulatorPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroBeamtenWartezeitenSimulator />
      </main>
      <Footer />
    </div>
  );
}
