
"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import FallingText from "@/components/landing/FallingText";
import { Cake } from "lucide-react";

export default function PastelPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl text-balance flex items-center justify-center gap-4">
                <Cake className="w-12 h-12 text-primary" />
                ¡Toma, un pastel 3D!
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4 text-balance">
                Du wolltest einen Kuchen in 3D. Hier ist er. Physisch korrekt und kalorienfrei. Du kannst ihn sogar mit der Maus herumwerfen. Zufrieden?
            </p>
        </div>
        <div className="w-full h-[50vh] max-w-4xl mt-8">
            <FallingText 
                text="PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL PASTEL"
                highlightWords={["PASTEL"]}
                highlightClass="text-primary font-bold text-4xl"
                fontSize="2rem"
                className="font-headline"
            />
        </div>
      </main>
      <Footer />
    </div>
  );
}
