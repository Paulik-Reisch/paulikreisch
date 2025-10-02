
import { Palabrotas } from "@/components/landing/palabrotas";
import { getPalabrotas } from "@/lib/firestore";
import { unstable_noStore as noStore } from 'next/cache';
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default async function PalabrotasPage() {
  noStore();
  const vocabulary = await getPalabrotas();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Palabrotas vocabulary={vocabulary} />
      </main>
      <Footer />
    </div>
  );
}
