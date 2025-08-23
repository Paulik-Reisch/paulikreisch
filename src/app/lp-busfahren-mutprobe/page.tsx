import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroBusfahrenMutprobe } from "@/components/landing/hero-busfahren-mutprobe";

export default function BusfahrenMutprobePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroBusfahrenMutprobe />
      </main>
      <Footer />
    </div>
  );
}
