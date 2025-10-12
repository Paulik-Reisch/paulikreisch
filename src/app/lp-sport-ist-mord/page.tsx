import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSportIstMord } from "@/components/landing/hero-sport-ist-mord";
import { DeathDevices } from "@/components/landing/DeathDevices";
import { DodgeballGuide } from "@/components/landing/DodgeballGuide";
import { Soundboard } from "@/components/landing/Soundboard";
import { QuotesGallery } from "@/components/landing/QuotesGallery";

export default function SportIstMordPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSportIstMord />
        <DeathDevices />
        <DodgeballGuide />
        <Soundboard />
        <QuotesGallery />
      </main>
      <Footer />
    </div>
  );
}
