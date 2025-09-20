
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
import { HW2PreorderPopup } from "./hw2-preorder-popup";


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
    price: "25,99 €",
    preorderPrice: "17,99 €",
    imageSrc: "https://placehold.co/400x600.png",
    aiHint: "book cover funny",
    amazonLink: "https://www.amazon.de/dp/B0D9L4DCMG",
    description: "Die Fortsetzung, die niemand wollte, aber jeder braucht. Eine Abrechnung mit Bürokratie, dem deutschen Internet und dem Mietenwahnsinn. Noch chaotischer, noch bissiger."
  },
};

function HW2BookCard({ book }: { book: typeof books.hw2 }) {
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
                                {book.price}
                            </span>
                            {showDiscount && (
                                <span className="text-2xl font-bold text-destructive animate-in fade-in zoom-in-50 duration-500">
                                    {book.preorderPrice}
                                </span>
                            )}
                        </div>
                        {showDiscount && <p className="text-xs text-destructive font-semibold mt-1 animate-in fade-in duration-500">{Math.round((1 - 17.99 / 25.99) * 100)}% auf die ersten 50 Exemplare</p>}
                        <span className="text-xs text-muted-foreground">inkl. MwSt.</span>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" className="w-full mt-auto">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {book.preorderPrice ? "Jetzt vorbestellen" : "Bei Amazon kaufen"}
                            </Button>
                        </DialogTrigger>
                        <HW2PreorderPopup />
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}


function BookCard({ book }: { book: (typeof books.hw1 | typeof books.hw2) & {preorderPrice?: string} }) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <CardContent className="p-4 md:p-6 flex flex-col h-full">
                <div className="relative aspect-[2/3] w-full mb-4 rounded-md overflow-hidden">
                    <Image alt={`Cover von ${book.title}`} src={book.imageSrc} data-ai-hint={book.aiHint} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold">{book.title}</h3>
                    <p className="text-xs text-muted-foreground flex-grow mt-1">{book.subtitle}</p>
                    <div className="my-2 h-14">
                         <span className="text-2xl font-bold">{book.price}</span>
                        <span className="text-xs text-muted-foreground ml-2">inkl. MwSt.</span>
                    </div>
                     <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
                        <Button size="lg" className="w-full" variant="secondary">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {book.preorderPrice ? "Jetzt vorbestellen" : "Bei Amazon kaufen"}
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}

export function BookShop() {
  const { toast } = useToast();
  
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    toast({
      title: "Fast geschafft!",
      description: `Wir haben eine Bestätigungs-E-Mail an ${email} gesendet. (Nicht wirklich, aber danke für's Mitmachen!)`,
    });
    e.currentTarget.reset();
  };

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                <BookCard book={books.hw1} />
                <HW2BookCard book={books.hw2} />

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
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="flex flex-col justify-center items-center p-8 text-center bg-muted/50">
                     <div className="p-3 bg-primary/10 rounded-full mb-4">
                         <Info className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold">Hallo Welt 2 kommt</h3>
                    <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-balance">
                       Die Fortsetzung, die niemand wollte, aber jeder braucht. Noch chaotischer, noch bissiger.
                    </p>
                    <Link href="/lp2">
                        <Button variant="outline">
                            Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </Card>
                 <Card className="flex flex-col justify-center items-center p-8 text-center bg-muted/50">
                     <div className="p-3 bg-primary/10 rounded-full mb-4">
                         <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold">Nichts verpassen</h3>
                    <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-balance">
                        Erhalten Sie eine Benachrichtigung, wenn das Buch online geht. Kein Spam, nur die wichtigen Katastrophen.
                    </p>
                     <form onSubmit={handleNewsletterSubmit} className="w-full max-w-sm flex gap-2">
                        <Input type="email" name="email" placeholder="deine-email@adresse.de" required className="flex-grow"/>
                        <Button type="submit">
                           Abonnieren
                        </Button>
                    </form>
                </Card>
            </div>
        </div>

      </div>
    </section>
  );
}

    
