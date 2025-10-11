
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroBusfahrenMutprobe } from "@/components/landing/hero-busfahren-mutprobe";
import { BusRidersGallery } from "@/components/landing/BusRidersGallery";
import { DelayCalculator } from "@/components/landing/DelayCalculator";
import { BusRules } from "@/components/landing/BusRules";
import { BusCTA } from "@/components/landing/BusCTA";
import { BusAnatomyChart } from "@/components/landing/BusAnatomyChart";
import { BusStopNames } from "@/components/landing/BusStopNames";
import { BusStatistics } from "@/components/landing/BusStatistics";

export default function BusfahrenMutprobePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroBusfahrenMutprobe />
        <BusRidersGallery />
        <BusAnatomyChart />
        <DelayCalculator />
        <BusStopNames />
        <BusRules />
        <BusStatistics />
        <BusCTA />
      </main>
      <Footer />
    </div>
  );
}
