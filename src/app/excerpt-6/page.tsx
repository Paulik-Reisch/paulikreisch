import { Header } from "@/components/landing/header";
import { Excerpt } from "@/components/landing/excerpt";
import { Footer } from "@/components/landing/footer";
import { HW2Teaser } from "@/components/landing/hw2-teaser";

export default function ExcerptPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Excerpt />
        <HW2Teaser />
      </main>
      <Footer />
    </div>
  );
}
