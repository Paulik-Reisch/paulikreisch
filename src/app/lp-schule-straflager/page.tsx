import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSchuleStraflager } from "@/components/landing/hero-schule-straflager";
import { InmateTestimonials } from "@/components/landing/inmate-testimonials";
import { VisitingHours } from "@/components/landing/visiting-hours";
import { CanteenMenu } from "@/components/landing/canteen-menu";
import { GuardsGallery } from "@/components/landing/guards-gallery";
import { EscapeAttempt } from "@/components/landing/escape-attempt";

export default function SchuleStraflagerPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSchuleStraflager />
        <InmateTestimonials />
        <GuardsGallery />
        <CanteenMenu />
        <EscapeAttempt />
        <VisitingHours />
      </main>
      <Footer />
    </div>
  );
}
