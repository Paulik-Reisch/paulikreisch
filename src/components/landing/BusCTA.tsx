
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export function BusCTA() {
  return (
    <section className="w-full py-8 md:py-12 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <BookOpen className="w-16 h-16" />
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl text-balance">
            Überlebt? Dann sind Sie bereit für das ganze Buch!
          </h2>
          <p className="max-w-2xl mx-auto text-primary-foreground/80 md:text-lg text-balance">
            Das komplette Kapitel über den öffentlichen Nahverkehr und viele weitere Alltags-Albträume finden Sie in "Hallo Welt".
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary" className="mt-4">
              Zum Buch
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
