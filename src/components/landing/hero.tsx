import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Product } from "@/lib/firestore";

export function Hero({ product }: { product?: Product }) {
  const imageSrc = product?.imageSrc || "https://placehold.co/550x550.png";
  const imageHint = product?.aiHint || "book cover";

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl xl:text-7xl/none text-balance animate-in fade-in slide-in-from-top-12 duration-1000">
                Ein Buch, das allen Konventionen trotzt.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl animate-in fade-in slide-in-from-top-16 duration-1000">
                Willkommen bei "Hallo Welt". Eine literarische Reise, so tiefgründig, dass Sie alles in Frage stellen werden, was Sie über Bücher zu wissen glaubten. Und die Realität.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row animate-in fade-in slide-in-from-top-20 duration-1000">
              <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg" variant="secondary">Jetzt kaufen (Sie wissen, Sie wollen es)</Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in-50 duration-1000">
             <Image
                alt="Buchcover"
                className="mx-auto aspect-[1/1] overflow-hidden rounded-xl object-contain sm:w-full lg:order-last transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105 shadow-2xl"
                data-ai-hint={imageHint}
                height="550"
                src={imageSrc}
                width="550"
              />
          </div>
        </div>
      </div>
    </section>
  );
}
