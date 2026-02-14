import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function BookShowcase() {
  return (
    <section id="book-showcase" className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Hallo Welt 1 */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-2">Hallo Welt</h2>
            <p className="text-muted-foreground text-lg mb-6">Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S</p>
            <div className="relative transform-gpu transition-transform duration-500 hover:scale-105 hover:-rotate-2">
                <Image
                    alt="Buchcover Hallo Welt 1"
                    className="mx-auto aspect-[3/4] overflow-hidden rounded-xl object-cover shadow-2xl"
                    data-ai-hint="book cover"
                    height="400"
                    src="https://placehold.co/300x400.png"
                    width="300"
                />
            </div>
            <p className="max-w-md mt-6 text-muted-foreground text-balance">
                Die satirische Abrechnung mit dem Schulsystem – Lehrer als Beamtenroboter und der tägliche Wahnsinn in der Lernvollzugsanstalt.
            </p>
            <Link href="/shop" className="mt-6">
                <Button variant="secondary">Band 1 kaufen</Button>
            </Link>
          </div>
          
          {/* Hallo Welt 2 */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-2">Hallo Welt 2</h2>
            <p className="text-muted-foreground text-lg mb-6">Wie das Leben funktioniert</p>
             <div className="relative transform-gpu transition-transform duration-500 hover:scale-105 hover:rotate-2">
                <Image
                    alt="Buchcover Hallo Welt 2"
                    className="mx-auto aspect-[3/4] overflow-hidden rounded-xl object-cover shadow-2xl"
                    data-ai-hint="book cover funny"
                    height="400"
                    src="https://placehold.co/300x400.png"
                    width="300"
                />
            </div>
            <p className="max-w-md mt-6 text-muted-foreground text-balance">
                Die Fortsetzung, die niemand wollte. Eine Abrechnung mit Bürokratie, deutschem Internet und Mietenchaos.
            </p>
             <Link href="/shop" className="mt-6">
                <Button variant="secondary">Band 2 kaufen</Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
