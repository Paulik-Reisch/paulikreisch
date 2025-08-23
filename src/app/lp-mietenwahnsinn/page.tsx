import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroMietenwahnsinn } from "@/components/landing/hero-mietenwahnsinn";

export default function MietenwahnsinnPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroMietenwahnsinn />
      </main>
      <Footer />
    </div>
  );
}
