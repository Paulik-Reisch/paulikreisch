
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroInternetDeutschland } from "@/components/landing/hero-internet-deutschland";

export default function InternetDeutschlandPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <HeroInternetDeutschland />
      </main>
      <Footer />
    </div>
  );
}
