"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, Ticket, Mail, Sparkles, ArrowRight, PenSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

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
    subtitle: "Wie's Leben funktioniert",
    imageSrc: "https://placehold.co/400x600.png",
    aiHint: "book cover funny",
    amazonLink: "https://www.amazon.de/dp/B0D9L4DCMG",
    description: "Die Fortsetzung, die niemand wollte, aber jeder braucht. Eine Abrechnung mit Bürokratie, dem deutschen Internet und dem Mietenwahnsinn. Noch chaotischer, noch bissiger."
  },
};

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

    const spinDuration = 3000; // 3 seconds of spinning
    const intervalDuration = 100; // update every 100ms
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
                        <Button>Jetzt kaufen</Button>
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

  const signaturePrice = 70.99;
  const mailToBody = `Hallo Welt, und hallo liebe Autoren,

ich möchte hiermit eine Sonderbestellung für das Werk "Hallo Welt (1)" mit eurer unverkennbaren Originalsignatur beantragen.

Mit dieser Auftrags-E-Mail bin ich mir bewusst und bestätige die Folgekosten von ${signaturePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} für Buch, Signatur und den damit verbundenen logistischen Zusatzaufwand.
Ich bin mir bewusst, dass eine Stornierung nach Absenden dieser E-Mail nicht möglich ist.

Meine Lieferdaten lauten:

[Hier bitte eintragen:
- Vor- und Nachname
- Straße und Hausnummer
- PLZ und Ort
- Land]

Gez.
[Ihr Name]

---
Rechtlicher Hinweis: Mit dem Absenden dieser E-Mail gehen Sie einen verbindlichen Kaufvertrag ein. Die Zahlungsinformationen erhalten Sie in einer separaten Antwort-E-Mail.
`;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl">
            Offizieller "Hallo Welt" Shop
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl text-balance">
            Exklusiv, erlesen und garantiert frei von Vernunft. Der einzige Ort, an dem Sie literarische Katastrophen als Meisterwerke kaufen können.
          </p>
        </div>

        {/* Hallo Welt 1 */}
        <Card className="mb-12 overflow-hidden shadow-lg border-2">
            <div className="grid md:grid-cols-2">
                <div className="relative aspect-[2/3] md:aspect-auto">
                    <Image alt={`Cover von ${books.hw1.title}`} src={books.hw1.imageSrc} data-ai-hint={books.hw1.aiHint} fill className="object-cover" />
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                    <h2 className="font-headline text-3xl font-bold">{books.hw1.title}</h2>
                    <p className="text-lg text-muted-foreground">{books.hw1.subtitle}</p>
                    <div className="flex items-center gap-1 my-4">
                        {[...Array(5)].map((_,i) => <Star key={i} className={i < 4 ? "w-5 h-5 fill-primary text-primary" : "w-5 h-5 fill-muted stroke-muted-foreground"}/>)}
                         <span className="text-xs text-muted-foreground ml-2">(4.2/5 Sterne)</span>
                    </div>
                    <p className="text-base leading-relaxed text-balance my-4">{books.hw1.description}</p>
                    <div className="flex items-baseline gap-4 my-4">
                        <span className="text-4xl font-bold">{books.hw1.price}</span>
                        <span className="text-sm text-muted-foreground">inkl. MwSt. &amp; Wahnsinn</span>
                    </div>
                    <a href={books.hw1.amazonLink} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button size="lg" className="w-full">
                            <ShoppingCart className="mr-2" />
                            Jetzt bei Amazon kaufen
                        </Button>
                    </a>
                    
                    <Separator className="my-8" />
                    
                    <div className="bg-yellow-50/50 border-2 border-yellow-400 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-yellow-500"/>
                            <h3 className="font-headline text-xl font-bold text-yellow-700">Originalsignierte Auflage</h3>
                        </div>
                        <p className="text-sm text-yellow-800">Sichern Sie sich ein von den Autoren handsigniertes Exemplar – ein echtes Sammlerstück.</p>
                        <div className="my-4 text-center text-sm text-yellow-900">
                           <p>10,99 € <span className="text-xs">(Buch)</span> + 50,00 € <span className="text-xs">(Signatur)</span> + 10,00 € <span className="text-xs">(Logistik)</span></p>
                           <p className="font-bold text-lg mt-1">Gesamt: {signaturePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                        </div>
                        <a href={`mailto:hallowelt@paulik-reisch.de?subject=Sonderbestellung: Originalsignierte Ausgabe "Hallo Welt 1"&body=${encodeURIComponent(mailToBody)}`}>
                            <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950">
                                <PenSquare className="mr-2" />
                                Signierte Ausgabe per E-Mail anfragen
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
        
        <Separator className="my-12 md:my-24" />

        {/* Hallo Welt 2 */}
        <Card className="overflow-hidden shadow-lg border-2">
            <div className="grid md:grid-cols-2">
                 <div className="p-6 md:p-10 flex flex-col justify-center md:order-2">
                    <h2 className="font-headline text-3xl font-bold">{books.hw2.title}</h2>
                    <p className="text-lg text-muted-foreground">{books.hw2.subtitle}</p>
                    <p className="font-semibold text-primary my-4 animate-pulse">Erscheint bald!</p>
                    <p className="text-base leading-relaxed text-balance my-4">{books.hw2.description}</p>
                    <Link href="/lp2" className="text-sm font-semibold text-primary hover:underline inline-flex items-center group mb-4">
                        Mehr über Hallo Welt 2 erfahren <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                   
                    <div className="my-4 p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-center sm:text-left">
                                <p className="font-bold">Preis:</p>
                                <p className={cn("text-4xl font-mono font-bold transition-colors duration-300", isSpinning ? 'animate-pulse' : '', priceColor)}>{price}{price.includes('?') ? '' : ' €'}</p>
                            </div>
                            <Button variant="destructive" onClick={spinPrice} disabled={isSpinning}>
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
                </div>
                <div className="relative aspect-[2/3] md:aspect-auto md:order-1">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
                        <Sparkles className="w-16 h-16 text-white animate-ping" />
                    </div>
                    <Image alt={`Cover von ${books.hw2.title}`} src={books.hw2.imageSrc} data-ai-hint={books.hw2.aiHint} fill className="object-cover" />
                </div>
            </div>
        </Card>

      </div>
    </section>
  );
}
