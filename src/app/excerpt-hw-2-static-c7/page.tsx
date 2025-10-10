import { Header } from "@/components/landing/header";
import { Excerpt } from "@/components/landing/excerpt";
import { Footer } from "@/components/landing/footer";

export default function ExcerptPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Excerpt />
      </main>
      <Footer />
    </div>
  );
}
