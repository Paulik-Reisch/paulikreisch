import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BureaucracyGenerator } from "@/components/landing/bureaucracy-generator";

export default function BuerokratieGeneratorPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <BureaucracyGenerator />
      </main>
      <Footer />
    </div>
  );
}
