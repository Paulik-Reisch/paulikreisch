
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/firestore";
import { Skeleton } from "../ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

function BookCarousel({ book }: { book: Product }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const images = [book.imageSrc, book.imageBackSrc].filter(Boolean) as string[];

  return (
    <div>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="mb-4">
                <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden">
                    <Image
                      alt={`Cover von ${book.title}`}
                      src={src}
                      data-ai-hint={book.aiHint}
                      fill
                      className="object-contain"
                    />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                current === index ? "bg-primary" : "bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function HW2BookCard({ book }: { book: Product }) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <CardContent className="p-4 md:p-6 flex flex-col h-full">
                <BookCarousel book={book} />
                <div className="flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold">{book.title}</h3>
                    <p className="text-xs text-muted-foreground flex-grow mt-1">{book.subtitle}</p>
                    <div className="my-2 h-20">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-muted-foreground line-through">
                                {book.price.toString().replace('.', ',')} €
                            </span>
                             {book.preorderPrice && (
                                <span className="text-2xl font-bold text-destructive animate-in fade-in zoom-in-50 duration-500">
                                    {book.preorderPrice.toString().replace('.', ',')} €
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground">inkl. MwSt.</span>
                    </div>
                     <Button size="lg" className="w-full mt-auto" disabled>
                        Noch nicht verfügbar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function BookCard({ book }: { book: Product }) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <CardContent className="p-4 md:p-6 flex flex-col h-full">
                <BookCarousel book={book} />
                <div className="flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold">{book.title}</h3>
                    <p className="text-xs text-muted-foreground flex-grow mt-1">{book.subtitle}</p>
                    <div className="my-2 h-20">
                         <span className="text-2xl font-bold">{book.price.toString().replace('.', ',')} €</span>
                        <span className="text-xs text-muted-foreground ml-2">inkl. MwSt.</span>
                    </div>
                     <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
                        <Button size="lg" className="w-full" variant="secondary">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                           Bei Amazon kaufen
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}

function BookCardSkeleton() {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <CardContent className="p-4 md:p-6 flex flex-col h-full">
                <Skeleton className="relative aspect-[2/3] w-full mb-4 rounded-md" />
                <div className="flex flex-col flex-grow">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-1/2 mb-4" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export function BookGrid({ initialProducts }: { initialProducts: Product[]}) {
  const hw1 = initialProducts.find(p => p.id === 'hw1');
  const hw2 = initialProducts.find(p => p.id === 'hw2');

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
                {initialProducts.length === 0 ? (
                    <>
                        <BookCardSkeleton />
                        <BookCardSkeleton />
                    </>
                ) : (
                    <>
                        {hw1 && <BookCard book={hw1} />}
                        {hw2 && <HW2BookCard book={hw2} />}
                    </>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
