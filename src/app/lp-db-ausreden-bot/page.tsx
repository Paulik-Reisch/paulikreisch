import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { DbExcuseGenerator } from "@/components/landing/db-excuse-generator";

export default function DbExcuseGeneratorPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <DbExcuseGenerator />
      </main>
      <Footer />
    </div>
  );
}
