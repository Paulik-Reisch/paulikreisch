import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroCoronaSatire } from "@/components/landing/hero-corona-satire";

export default function CoronaSatirePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroCoronaSatire />
      </main>
      <Footer />
    </div>
  );
}
