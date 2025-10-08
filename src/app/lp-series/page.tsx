import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { HeroSeries } from "@/components/landing/hero-series";
import { BookShowcase } from "@/components/landing/book-showcase";
import { WhyBoth } from "@/components/landing/why-both";

export default function SeriesPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSeries />
        <BookShowcase />
        <WhyBoth />
      </main>
      <Footer />
    </div>
  );
}
