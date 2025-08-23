import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { FootnoteGenerator } from "@/components/landing/footnote-generator";

export default function FootnoteGeneratorPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-6 text-center">
                <div className="space-y-4">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
                    Der offizielle "Hallo Welt" Fußnoten-Generator
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
                    Erfinden Sie zu jedem beliebigen Thema eine pseudo-wissenschaftliche Fußnote im unverkennbaren Stil des Buches.
                    </p>
                </div>
                </div>
                <div className="max-w-2xl mx-auto mt-12">
                    <FootnoteGenerator />
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
