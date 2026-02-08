import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Product } from "@/lib/firestore";
import { ChevronDown } from "lucide-react";
import { Typewriter } from "../ui/typewriter";

const heroTexts = [
    "Eine Abrechnung mit der Schule.",
    "Die Wahrheit über den Lehreralltag.",
    "Satire, die den Unterricht trifft.",
    "Überleben in der Lernanstalt.",
    "Kritik am Bildungssystem.",
    "Der Albtraum namens Schule.",
    "Von Lehrern und anderen Robotern.",
    "Die Hölle sind die Hausaufgaben.",
    "Schulsatire in Reinform.",
    "Ein Buch gegen den Schulstress.",
    "Flucht aus dem Klassenzimmer.",
    "Der tägliche Kampf mit der Bürokratie.",
    "Genervt von Noten und Klausuren?",
    "Die ungeschönte Realität der Schulzeit.",
    "Für alle, die es überlebt haben.",
    "Ein literarischer Aufstand.",
    "Widerstand im Klassenzimmer.",
    "Die Schule: Ein satirisches Meisterwerk.",
    "Lachen über den Schulwahnsinn.",
    "Das Manifest einer verlorenen Generation.",
];


export function Hero({ product }: { product?: Product }) {
  const imageSrc = product?.imageSrc || "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-mockup-1.png?alt=media&token=c82b73e5-76bd-490d-a65f-008a3bfac00b";
  const imageHint = product?.aiHint || "book cover";
  const bookTitle = product?.title || 'Hallo Welt';
  const fullBookTitle = product?.subtitle ? `${bookTitle}: ${product.subtitle}` : bookTitle;

  return (
    <section 
      aria-labelledby="main-hero-heading" 
      className="relative w-full flex items-center justify-center min-h-[calc(100vh-100px)] py-12"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col-reverse md:grid items-center gap-6 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
            <div className="space-y-4 min-h-[12rem] flex flex-col justify-center animate-in fade-in slide-in-from-top-12 duration-1000">
                <h1 id="main-hero-heading" className="font-headline text-3xl sm:text-4xl md:text-5xl xl:text-7xl/none text-balance">
                    <Typewriter texts={heroTexts} />
                </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-in fade-in slide-in-from-top-20 duration-1000">
              <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg" variant="secondary">Jetzt kaufen</Button>
              </Link>
              <Link href="/lp-series">
                <Button size="lg" variant="outline">Mehr Satirewerke</Button>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-sm mx-auto md:max-w-none animate-in fade-in zoom-in-50 duration-1000">
             <Image
                alt={`Buchcover von '${fullBookTitle}'`}
                className="mx-auto overflow-hidden rounded-xl object-contain transform transition-transform duration-500 hover:rotate-0 hover:scale-105"
                data-ai-hint={imageHint}
                height="974"
                src={imageSrc}
                width="640"
                priority
              />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <a href="#articles" aria-label="Nach unten scrollen">
          <ChevronDown className="h-8 w-8 text-muted-foreground animate-bounce" />
        </a>
      </div>
    </section>
  );
}
