import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { PfeiferTranslator } from "@/components/landing/pfeifer-translator";

export default function PfeiferTranslatePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PfeiferTranslator />
      </main>
      <Footer />
    </div>
  );
}
