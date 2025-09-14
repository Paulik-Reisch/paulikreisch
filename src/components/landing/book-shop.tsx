"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const books = [
  {
    id: 1,
    title: "Hallo Welt",
    subtitle: "Der Anfang allen Übels.",
    price: "10,99 €",
    imageSrc: "https://placehold.co/400x600.png",
    aiHint: "book cover",
    amazonLink: "https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J",
  },
  {
    id: 2,
    title: "Hallo Welt 2",
    subtitle: "Erneut Hallo, wir müssen reden!",
    price: "10,99 €",
    imageSrc: "https://placehold.co/400x600.png",
    aiHint: "book cover funny",
    amazonLink: "https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J",
  },
];

export function BookShop() {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLAnchorElement>, title: string) => {
    e.preventDefault();
    toast({
      title: `${title} im Warenkorb!`,
      description: "Fast geschafft! Sie werden nun sicher zu Amazon weitergeleitet, um den Kauf abzuschließen.",
    });

    const targetUrl = e.currentTarget.href;
    setTimeout(() => {
        window.open(targetUrl, '_blank');
    }, 2000);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl">
            Buchhandlung Paulik & Reisch
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl text-balance">
            Exklusiv, erlesen und garantiert frei von Vernunft. Der einzige Ort, an dem Sie literarische Katastrophen als Meisterwerke kaufen können.
          </p>
        </div>

        <div className="mx-auto grid max-w-sm grid-cols-1 gap-8 py-12 sm:max-w-none sm:grid-cols-2 lg:gap-12">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    alt={`Cover von ${book.title}`}
                    className="aspect-[2/3] w-full object-cover"
                    height={600}
                    src={book.imageSrc}
                    data-ai-hint={book.aiHint}
                    width={400}
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-headline text-2xl font-bold">{book.title}</h2>
                  <p className="text-sm text-muted-foreground">{book.subtitle}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold">{book.price}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-5 h-5 fill-primary" />
                      <Star className="w-5 h-5 fill-primary" />
                      <Star className="w-5 h-5 fill-primary" />
                      <Star className="w-5 h-5 fill-primary" />
                      <Star className="w-5 h-5 fill-muted stroke-muted-foreground" />
                    </div>
                  </div>
                  <a
                    href={book.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleAddToCart(e, book.title)}
                    className="w-full"
                  >
                    <Button size="lg" className="w-full mt-6">
                      <ShoppingCart className="mr-2" />
                      In den Warenkorb
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
