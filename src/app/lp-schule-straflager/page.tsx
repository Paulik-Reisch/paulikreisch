import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSchuleStraflager } from "@/components/landing/hero-schule-straflager";
import { InmateTestimonials } from "@/components/landing/inmate-testimonials";
import { VisitingHours } from "@/components/landing/visiting-hours";

export default function SchuleStraflagerPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSchuleStraflager />
        <InmateTestimonials />
        <VisitingHours />
      </main>
      <Footer />
    </div>
  );
}
