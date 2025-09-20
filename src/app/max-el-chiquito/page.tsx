import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function MaxElChiquitoPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="font-headline text-8xl md:text-9xl font-extrabold tracking-tighter text-center text-destructive animate-pulse">
          max el tonto
        </h1>
      </main>
      <Footer />
    </div>
  );
}
