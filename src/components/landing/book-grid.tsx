
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Sparkles, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/firestore";
import { Skeleton } from "../ui/skeleton";

function HW2BookCard({ book }: { book: Product }) {
    const [showDiscount, setShowDiscount] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowDiscount(true);
        }, 1000); // Delay for the animation to start
        return () => clearTimeout(timer);
    }, []);

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <CardContent className="p-4 md:p-6 flex flex-col h-full">
                <div className="relative aspect-[2/3] w-full mb-4 rounded-md overflow-hidden">
                    <Image alt={`Cover von ${book.title}`} src={book.imageSrc} data-ai-hint={book.aiHint} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold">{book.title}</h3>
                    <p className="text-xs text-muted-foreground flex-grow mt-1">{book.subtitle}</p>
                    <div className="my-2 h-20">
                        <div className="flex items-baseline gap-2">
                            <span
                                className={cn(
                                    "text-2xl font-bold transition-all duration-500",
                                    showDiscount ? "text-muted-foreground line-through text-lg" : "text-foreground"
                                )}
                            >
                                {book.price.toString().replace('.', ',')} €
                            </span>
                            {showDiscount && book.preorderPrice && (
                                <span className="text-2xl font-bold text-destructive animate-in fade-in zoom-in-50 duration-500">
                                    {book.preorderPrice.toString().replace('.', ',')} €
                                </span>
                            )}
                        </div>
                        {showDiscount && <p className="text-xs text-destructive font-semibold mt-1 animate-in fade-in duration-500">{book.price && book.preorderPrice ? Math.round((1 - book.preorderPrice / book.price) * 100) : 0}% auf die ersten 50 Exemplare</p>}
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
                <div className="relative aspect-[2/3] w-full mb-4 rounded-md overflow-hidden">
                    <Image alt={`Cover von ${book.title}`} src={book.imageSrc} data-ai-hint={book.aiHint} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 justify-center">
                {initialProducts.length === 0 ? (
                    <>
                        <BookCardSkeleton />
                        <BookCardSkeleton />
                    </>
                ) : (
                    <>
                        {hw1 && <div className="max-w-xs w-full"><BookCard book={hw1} /></div>}
                        {hw2 && <div className="max-w-xs w-full"><HW2BookCard book={hw2} /></div>}
                    </>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
