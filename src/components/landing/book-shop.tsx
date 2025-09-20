"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, Ticket, Mail, Sparkles, ArrowRight, PenSquare, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignatureOrderForm } from "./signature-order-form";


const books = {
  hw1: {
    id: 1,
    title: "Hallo Welt",
    subtitle: "Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S",
    price: "10,99 €",
    imageSrc: "https://placehold.co/400x600.png",
    aiHint: "book cover",
    amazonLink: "https://www.amazon.de/-/de/Hallo-Welt-Erhebliche-Bildungsgang-Lernvollzugsanstalt/dp/B0CVXT9X4J",
    description: "Die satirische Abrechnung mit dem Schulsystem, Lehrern als Beamtenrobotern und dem täglichen Wahnsinn des Erwachsenwerdens. Ein Muss für jeden, der die Schule überlebt hat (oder es noch versucht)."
  },
  hw2: {
    id: 2,
    title: "Hallo Welt 2",
    subtitle: "Wie das Leben funktioniert",
    price: "12,99 €",
    imageSrc: "https://placehold.co/400x600.png",
    aiHint: "book cover funny",
    amazonLink: "https://www.amazon.de/dp/B0D9L4DCMG",
    description: "Die Fortsetzung, die niemand wollte, aber jeder braucht. Eine Abrechnung mit Bürokratie, dem deutschen Internet und dem Mietenwahnsinn. Noch chaotischer, noch bissiger."
  },
};

function BookCard({ book }: { book: typeof books.hw1 | typeof books.hw2 }) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <CardContent className="p-4 md:p-6 flex flex-col h-full">
                <div className="relative aspect-[2/3] w-full mb-4 rounded-md overflow-hidden">
                    <Image alt={`Cover von ${book.title}`} src={book.imageSrc} data-ai-hint={book.aiHint} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold">{book.title}</h3>
                    <p className="text-xs text-muted-foreground flex-grow mt-1">{book.subtitle}</p>
                    <div className="my-2">
                        <span className="text-2xl font-bold">{book.price}</span>
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

export function BookShop() {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [price, setPrice] = useState<string>("???");
  const [priceColor, setPriceColor] = useState("text-foreground");
  
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    toast({
      title: "Fast geschafft!",
      description: `Wir haben eine Bestätigungs-E-Mail an ${email} gesendet. (Nicht wirklich, aber danke für's Mitmachen!)`,
    });
    e.currentTarget.reset();
  };

  const spinPrice = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const spinDuration = 3000;
    const intervalDuration = 100;
    let intervals = spinDuration / intervalDuration;

    const spinInterval = setInterval(() => {
        const randomPrice = (Math.random() * (569000 - 0.01) + 0.01).toFixed(2);
        setPrice(randomPrice.replace('.',','));
        intervals--;
        if (intervals <= 0) {
            clearInterval(spinInterval);
            const finalPrice = (Math.random() < 0.1) ? (Math.random() * (15 - 5) + 5).toFixed(2) : (Math.random() * (1000 - 15) + 15).toFixed(2);
            const finalPriceFormatted = finalPrice.replace('.', ',');
            setPrice(finalPriceFormatted);
            setIsSpinning(false);
            
            let toastTitle = "Herzlichen Glückwunsch!";
            let toastDescription = `Ihr persönlicher Preis: ${finalPriceFormatted}€! Ein echtes Schnäppchen!`;
            let showBuyButton = true;

            if(parseFloat(finalPrice) > 100) {
                toastTitle = "Pech gehabt!";
                toastDescription = `Ihr Preis: ${finalPriceFormatted}€! Vielleicht versuchen Sie es morgen nochmal.`;
                showBuyButton = false;
            } else if (parseFloat(finalPrice) <= 1) {
                toastTitle = "JACKPOT!";
                toastDescription = `Sie zahlen nur ${finalPriceFormatted}€! Das ist quasi geschenkt!`;
            }

            toast({
                title: toastTitle,
                description: toastDescription,
                action: showBuyButton ? (
                    <a href={books.hw2.amazonLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary">Jetzt kaufen</Button>
                    </a>
                ) : undefined,
            });
        }
    }, intervalDuration);
  };

  useEffect(() => {
    if (isSpinning) {
      setPriceColor("text-destructive");
    } else {
      setPriceColor("text-primary");
    }
  }, [isSpinning]);

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">Die aktuellen Meisterwerke</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                <BookCard book={books.hw1} />
                <BookCard book={books.hw2} />

                <Dialog>
                    <DialogTrigger asChild>
                    <div className="group relative col-span-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-all duration-300 hover:-translate-y-2">
                        <Sparkles className="w-10 h-10 text-primary/50 group-hover:text-primary transition-colors duration-300 transform group-hover:scale-110" />
                        <h3 className="font-headline text-xl font-bold mt-4">Signierte Sonderausgabe</h3>
                        <p className="text-muted-foreground text-sm mt-2">Sichern Sie sich ein von den Autoren persönlich gequältes und signiertes Exemplar.</p>
                         <Button variant="outline" className="mt-6">
                            <PenSquare className="mr-2 h-4 w-4"/>
                            Jetzt konfigurieren
                        </Button>
                    </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-3xl">Sonderbestellung: Originalausgabe</DialogTitle>
                        <DialogDescription>
                        Stellen Sie sich Ihre persönliche, von den Autoren gequälte Ausgabe zusammen. Ein Unikat, genau wie Ihre Probleme.
                        </DialogDescription>
                    </DialogHeader>
                    <SignatureOrderForm />
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <Separator className="my-12 md:my-24" />

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">Bald im Handel</h2>
            <Card className="overflow-hidden border-2 bg-gradient-to-tr from-blue-50 via-transparent to-transparent">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-6 md:p-10 flex flex-col justify-center order-2 md:order-1">
                        <span className="font-semibold text-primary animate-pulse mb-2">Erscheint bald!</span>
                        <h3 className="font-headline text-4xl font-bold">{books.hw2.title}</h3>
                        <p className="text-lg text-muted-foreground mb-4">{books.hw2.subtitle}</p>
                        
                        <p className="text-base leading-relaxed text-balance my-4">{books.hw2.description}</p>
                        
                        <div className="my-4 p-4 rounded-lg bg-muted/50 border">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="font-bold">Preis-Lotterie:</p>
                                    <p className={cn("text-4xl font-mono font-bold transition-colors duration-300", isSpinning ? 'animate-pulse' : '', priceColor)}>{price}{price.includes('?') ? '' : ' €'}</p>
                                </div>
                                <Button variant="destructive" onClick={spinPrice} disabled={isSpinning} className="transition-transform duration-200 hover:scale-105 active:scale-95">
                                    <Ticket className="mr-2"/> Dein Glück versuchen
                                </Button>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <p className="text-sm font-semibold mb-2">Benachrichtigung erhalten, wenn das Buch online geht:</p>
                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                               <Input type="email" name="email" placeholder="deine-email@adresse.de" required className="flex-grow"/>
                               <Button type="submit">
                                   <Mail className="mr-2"/> Abonnieren
                               </Button>
                            </form>
                        </div>
                         <Link href="/lp2" className="text-sm font-semibold text-primary hover:underline inline-flex items-center group mt-6">
                            <Info className="mr-2 h-4 w-4"/> Mehr über Hallo Welt 2 erfahren <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="relative aspect-[2/3] w-full h-full order-1 md:order-2 group">
                         <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                            <Sparkles className="w-16 h-16 text-white/80 animate-ping" />
                        </div>
                        <Image alt={`Cover von ${books.hw2.title}`} src={books.hw2.imageSrc} data-ai-hint={books.hw2.aiHint} fill className="object-cover" />
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </section>
  );
}
