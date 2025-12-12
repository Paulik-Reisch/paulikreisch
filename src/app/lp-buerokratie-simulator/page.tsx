
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroBuerokratieSimulator } from "@/components/landing/hero-buerokratie-simulator";

export default function BuerokratieSimulatorPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroBuerokratieSimulator />
      </main>
      <Footer />
    </div>
  );
}
