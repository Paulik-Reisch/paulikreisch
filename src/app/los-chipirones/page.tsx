import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function LosChipironesPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl">
              Los Chipirones
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Inhalt für diese Seite kommt hierher.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
