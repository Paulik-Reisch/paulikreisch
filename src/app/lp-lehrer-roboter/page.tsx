import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroLehrerRoboter } from "@/components/landing/hero-lehrer-roboter";

export default function LehrerRoboterPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroLehrerRoboter />
      </main>
      <Footer />
    </div>
  );
}
