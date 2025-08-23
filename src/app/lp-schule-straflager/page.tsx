import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSchuleStraflager } from "@/components/landing/hero-schule-straflager";

export default function SchuleStraflagerPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSchuleStraflager />
        {/* Weitere Sektionen können hier hinzugefügt werden */}
      </main>
      <Footer />
    </div>
  );
}
