"use client";

import React, { useState, useEffect, useRef } from "react";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
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
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";

function BookCarousel({ book }: { book: Product }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const plugin = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true, playOnInit: false })
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    
    const randomDelay = Math.random() * 1000;
    const timeoutId = setTimeout(() => {
        plugin.current.play();
    }, randomDelay);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    api.on("pointerDown", () => {
        plugin.current.stop();
    });
     
    api.on("settle", () => {
        plugin.current.play();
    })


    return () => clearTimeout(timeoutId);
  }, [api]);

  const images = [book.imageSrc, book.imageBackSrc].filter(Boolean) as string[];

  return (
    <div onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.play}>
      <Carousel setApi={setApi} plugins={[plugin.current]} className="w-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="overflow-hidden aspect-[2/3] relative">
                <Image
                  alt={`Cover von ${book.title}`}
                  src={src}
                  data-ai-hint={book.aiHint}
                  fill
                  className="object-contain"
                />
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

function PriceDisplay({ book }: { book: Product }) {
  const isPreorder = book.preorderPrice !== undefined;
  const [showPreorderPrice, setShowPreorderPrice] = useState(false);

  useEffect(() => {
    if (isPreorder) {
      const timer = setTimeout(() => {
        setShowPreorderPrice(true);
      }, 1500); // Increased delay for visibility
      return () => clearTimeout(timer);
    }
  }, [isPreorder]);

  const renderInitialState = () => (
    <div className="flex flex-col justify-center items-center">
        <span className="text-2xl font-bold mt-2">{book.price.toString().replace('.', ',')} €</span>
        <p className="text-xs text-muted-foreground">inkl. MwSt.</p>
    </div>
  );

  const renderFinalState = () => (
     <motion.div
        key="final"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center"
      >
        <div className="flex items-baseline justify-center gap-2 mt-2">
            <span className="text-xl font-bold text-muted-foreground line-through">
            {book.price.toString().replace('.', ',')} €
            </span>
            {book.preorderPrice && (
            <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                className="text-2xl font-bold text-destructive"
            >
                {book.preorderPrice.toString().replace('.', ',')} €
            </motion.span>
            )}
        </div>
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
            >
                <Badge variant="destructive" className="mt-1 text-xs">15 % auf die ersten 50 Exemplare!</Badge>
                <p className="text-xs text-muted-foreground">inkl. MwSt.</p>
            </motion.div>
        </AnimatePresence>
      </motion.div>
  );

  if (!isPreorder) {
    return (
      <div className="min-h-[70px] flex flex-col justify-center items-center">
        {renderInitialState()}
      </div>
    );
  }

  return (
    <div className="min-h-[70px] flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
            {!showPreorderPrice ? (
                 <motion.div
                    key="initial"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{duration: 0.3}}
                >
                    {renderInitialState()}
                </motion.div>
            ) : (
                <motion.div
                    key="final"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{duration: 0.3}}
                >
                    {renderFinalState()}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}


function BookCard({ book }: { book: Product }) {
    const isPreorder = book.preorderPrice !== undefined;

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <CardContent className="p-4 md:p-6 flex flex-col h-full items-center text-center">
                <div className="w-full max-w-[250px]">
                    <BookCarousel book={book} />
                </div>
                <div className="flex flex-col flex-grow mt-1">
                    <h3 className="font-headline text-xl font-bold">{book.title}</h3>
                    <p className="text-xs text-muted-foreground min-h-[30px]">{book.subtitle}</p>
                    
                    <PriceDisplay book={book} />

                    <div className="mt-auto pt-1 flex flex-col justify-end items-center">
                        {isPreorder ? (
                             <div className='flex flex-col items-center gap-2'>
                                <Button size="lg" disabled className="w-full max-w-[200px]">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Bald verfügbar
                                </Button>
                                <p className="text-xs text-muted-foreground px-4">Hinweis: Cover und Rückseite können bei Veröffentlichung anders aussehen.</p>
                            </div>
                        ) : (
                             <div className='flex flex-col items-center gap-2'>
                                <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
                                    <Button size="lg" variant="secondary" className="w-full max-w-[200px]">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Bei Amazon
                                    </Button>
                                </a>
                                <p className="text-xs text-muted-foreground px-4 invisible">Hinweis: Cover und Rückseite können bei Veröffentlichung anders aussehen.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function BookCardSkeleton() {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <CardContent className="p-4 md:p-6 flex flex-col h-full items-center text-center">
                <Skeleton className="relative aspect-[2/3] w-full max-w-[300px] mb-4" />
                <div className="flex flex-col flex-grow items-center">
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
    <section className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-2">
                {initialProducts.length === 0 ? (
                    <>
                        <BookCardSkeleton />
                        <BookCardSkeleton />
                    </>
                ) : (
                    <>
                        {hw1 && <BookCard book={hw1} />}
                        {hw2 && <BookCard book={hw2} />}
                    </>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
