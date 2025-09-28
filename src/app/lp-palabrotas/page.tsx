import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Palabrotas } from "@/components/landing/palabrotas";

export default function PalabrotasPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Palabrotas />
      </main>
      <Footer />
    </div>
  );
}
