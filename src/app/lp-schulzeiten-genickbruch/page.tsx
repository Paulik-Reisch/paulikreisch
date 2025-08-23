import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSchulzeitenGenickbruch } from "@/components/landing/hero-schulzeiten-genickbruch";

export default function SchulzeitenGenickbruchPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSchulzeitenGenickbruch />
      </main>
      <Footer />
    </div>
  );
}
