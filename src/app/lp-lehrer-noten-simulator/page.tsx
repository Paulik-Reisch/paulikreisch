import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroLehrerNotenSimulator } from "@/components/landing/hero-lehrer-noten-simulator";

export default function LehrerNotenSimulatorPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroLehrerNotenSimulator />
      </main>
      <Footer />
    </div>
  );
}
