import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroPfeifer } from "@/components/landing/hero-pfeifer";

export default function PfeiferPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroPfeifer />
      </main>
      <Footer />
    </div>
  );
}
