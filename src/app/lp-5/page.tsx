import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function LP5Page() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hier kommt der Inhalt für die LP5 hin */}
      </main>
      <Footer />
    </div>
  );
}
