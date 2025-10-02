
import { Chistes } from "@/components/landing/chistes";
import { getChistes } from "@/lib/firestore";
import { unstable_noStore as noStore } from 'next/cache';
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default async function ChistesPage() {
  noStore();
  const chistes = await getChistes();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Chistes chistes={chistes} />
      </main>
      <Footer />
    </div>
  );
}
