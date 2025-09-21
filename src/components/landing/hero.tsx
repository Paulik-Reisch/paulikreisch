import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Product } from "@/lib/firestore";

export function Hero({ product }: { product?: Product }) {
  const imageSrc = product?.imageSrc || "https://m.media-amazon.com/images/I/61hB6jTD-CL._SL1500_.jpg";
  const imageHint = product?.aiHint || "book cover";

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl xl:text-7xl/none text-balance animate-in fade-in slide-in-from-top-12 duration-1000">
                Ein Buch, das allen Konventionen trotzt.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto md:mx-0 animate-in fade-in slide-in-from-top-16 duration-1000">
                Willkommen bei "Hallo Welt". Eine literarische Reise – so tiefgründig, dass Sie alles in Frage stellen werden, was Sie über Bücher zu wissen glaubten. Und über die Realität.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center md:justify-start animate-in fade-in slide-in-from-top-20 duration-1000">
              <Link href="/buchhandlung-paulik-reisch">
                <Button size="lg" variant="secondary">Jetzt kaufen</Button>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-sm mx-auto md:max-w-none animate-in fade-in zoom-in-50 duration-1000">
             <Image
                alt="Buchcover"
                className="mx-auto overflow-hidden rounded-xl object-contain transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105 shadow-2xl"
                data-ai-hint={imageHint}
                height="974"
                src={imageSrc}
                width="640"
              />
          </div>
        </div>
      </div>
    </section>
  );
}
