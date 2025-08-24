import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SatireTypeTest } from "@/components/landing/satire-type-test";

export default function SatireTypTestPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <SatireTypeTest />
      </main>
      <Footer />
    </div>
  );
}
