"use client";

import { useState, useEffect } from "react";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Product } from "@/lib/firestore";
import { ChevronDown } from "lucide-react";
import SplitText from "../ui/SplitText";

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
  const [textIndex, setTextIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setKey(prev => prev + 1); // This will re-mount the SplitText component
        setTextIndex(prevIndex => (prevIndex + 1) % heroTexts.length);
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, [heroTexts.length]);

  const imageSrc = product?.imageSrc || "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-mockup-1.png?alt=media&token=c736447b-585c-410e-b2c9-b3fd9c726c58";
  const imageHint = product?.aiHint || "book cover";
  const bookTitle = product?.title || 'Hallo Welt';
  const fullBookTitle = product?.subtitle ? `${bookTitle}: ${product.subtitle}` : bookTitle;

  return (
    <section 
      aria-labelledby="main-hero-heading" 
      className="relative w-full flex items-center justify-center min-h-[calc(100vh-100px)] py-20 md:py-24 lg:py-32"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col-reverse md:grid items-center gap-6 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
            <div className="space-y-4 min-h-[12rem] flex flex-col justify-center animate-in fade-in slide-in-from-top-12 duration-1000">
                <h1 id="main-hero-heading" className="font-headline text-3xl sm:text-4xl md:text-5xl xl:text-7xl/none text-balance">
                    <SplitText
                        key={key} // Use key to force re-render and re-animate
                        text={heroTexts[textIndex]}
                        splitType="words"
                        duration={0.8}
                        ease="power3.out"
                        from={{ opacity: 0, y: 30 }}
                        to={{ opacity: 1, y: 0 }}
                        delay={60}
                        tag="span" 
                        textAlign="inherit"
                    />
                </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-in fade-in slide-in-from-top-20 duration-1000">
              <Link href="/shop">
                <Button size="lg" variant="secondary">Jetzt kaufen</Button>
              </Link>
              <Link href="/a">
                <Button size="lg" variant="default">Lustige Artikel</Button>
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
