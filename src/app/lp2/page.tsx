import { Header } from "@/components/landing/header";
import { HeroLP2 } from "@/components/landing/hero-lp2";
import { Footer } from "@/components/landing/footer";

export default function LP2() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroLP2 />
      </main>
      <Footer />
    </div>
  );
}
