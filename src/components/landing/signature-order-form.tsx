
"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, FileText, Sparkles } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const signatureSchema = z.object({
  // HW1 Fields
  hw1_hasSignature: z.boolean().default(false),
  hw1_hasDedication: z.boolean().default(false),
  hw1_provideDedication: z.boolean().default(false),
  hw1_customDedication: z.string().optional(),
  
  // Combo Deal Field
  acceptComboDeal: z.boolean().default(false),

  // HW2 Fields
  hw2_hasSignature: z.boolean().default(true),
  hw2_hasDedication: z.boolean().default(false),
  hw2_provideDedication: z.boolean().default(false),
  hw2_customDedication: z.string().optional(),

  // Address Fields
  firstName: z.string().min(1, "Vorname ist ein Pflichtfeld."),
  lastName: z.string().min(1, "Nachname ist ein Pflichtfeld."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  street: z.string().min(1, "Straße ist ein Pflichtfeld."),
  houseNumber: z.string().min(1, "Hausnummer ist ein Pflichtfeld."),
  zip: z.string().min(4, "Bitte geben Sie eine gültige PLZ ein."),
  city: z.string().min(1, "Ort ist ein Pflichtfeld."),
});

type SignatureFormValues = z.infer<typeof signatureSchema>;

const bookPrices = {
    hw1: 10.99,
    hw2_original: 25.99,
    hw2_preorder: 17.99,
    logistics: 7.99,
    hw1_signature: 50,
    hw1_dedication: 20,
    hw1_custom_dedication: 5,
    hw2_signature_package: 35,
};


export function SignatureOrderForm({ book }: { book: any }) {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignatureFormValues>({
    resolver: zodResolver(signatureSchema),
    defaultValues: {
        hw1_hasSignature: true,
        acceptComboDeal: false,
    },
  });

  const watchFields = watch();
  
 const { totalPrice, originalPrice, totalDiscount } = useMemo(() => {
    let price = 0;
    const book1Price = bookPrices.hw1;
    const logisticsPrice = bookPrices.logistics;

    let hw1SignaturePrice = 0;
    if (watchFields.hw1_hasSignature) hw1SignaturePrice += bookPrices.hw1_signature;
    if (watchFields.hw1_hasDedication) hw1SignaturePrice += bookPrices.hw1_dedication;
    if (watchFields.hw1_hasDedication && watchFields.hw1_provideDedication) hw1SignaturePrice += bookPrices.hw1_custom_dedication;

    price += book1Price + logisticsPrice + hw1SignaturePrice;
    
    let originalTotalPrice = price;
    let finalDiscount = 0;

    if (watchFields.acceptComboDeal) {
        const hw1Discount = book1Price * 0.8;
        price -= hw1Discount;
        finalDiscount += hw1Discount;

        const hw2Price = bookPrices.hw2_preorder;
        const hw2SignaturePrice = bookPrices.hw2_signature_package;
        const hw2OriginalBookPrice = bookPrices.hw2_original;
        const hw2BookDiscount = hw2OriginalBookPrice - hw2Price;
        
        price += hw2Price + hw2SignaturePrice;
        finalDiscount += hw2BookDiscount;

        originalTotalPrice += hw2OriginalBookPrice + hw2SignaturePrice;
    }

    return { totalPrice: price, originalPrice: originalTotalPrice, totalDiscount: finalDiscount };

  }, [watchFields]);


  const onSubmit = async (data: SignatureFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Bestelldaten:", data);
    toast({
        title: "Herzlichen Glückwunsch (oder Beileid?)",
        description: "Ihre unverbindliche, aber moralisch verpflichtende Bestellung wurde registriert.",
    });
  };

  return (
    <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-center">
                Sonderbestellung: {book.title}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
                Stellen Sie sich Ihre persönliche, von den Autoren gequälte Ausgabe zusammen. Ein Unikat, genau wie Ihre Probleme.
            </DialogDescription>
        </DialogHeader>

        <div className="my-8 space-y-8">
            {/* Konfiguration HW1 */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-xl font-headline font-semibold">1. Konfiguration für "Hallo Welt 1"</h3>
                 <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Controller
                        name="hw1_hasSignature"
                        control={control}
                        render={({ field }) => <Checkbox id="hw1_hasSignature" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <Label htmlFor="hw1_hasSignature" className="font-semibold text-base cursor-pointer flex justify-between w-full">
                        <span>Originalsignatur der Autoren</span>
                        <span className="text-muted-foreground font-mono">+{bookPrices.hw1_signature.toFixed(2)} €</span>
                    </Label>
                </div>
                 <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Controller
                        name="hw1_hasDedication"
                        control={control}
                        render={({ field }) => <Checkbox id="hw1_hasDedication" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <Label htmlFor="hw1_hasDedication" className="font-semibold text-base cursor-pointer flex justify-between w-full">
                       <span>Persönliche Widmung</span>
                       <span className="text-muted-foreground font-mono">+{bookPrices.hw1_dedication.toFixed(2)} €</span>
                    </Label>
                </div>
                 {watchFields.hw1_hasDedication && (
                    <div className="pl-8 space-y-4 pt-2">
                        <div className="flex items-center space-x-3 p-2 rounded-md">
                            <Controller
                                name="hw1_provideDedication"
                                control={control}
                                render={({ field }) => <Checkbox id="hw1_provideDedication" checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label htmlFor="hw1_provideDedication" className="cursor-pointer flex justify-between w-full">
                                <span>Ich möchte meine eigene Widmung vorgeben</span>
                                <span className="text-muted-foreground font-mono">+{bookPrices.hw1_custom_dedication.toFixed(2)} €</span>
                            </Label>
                        </div>
                        {watchFields.hw1_provideDedication && (
                             <div className="pl-2">
                                <Textarea 
                                    {...register("hw1_customDedication")} 
                                    placeholder="Ihr Wunschtext für die Nachwelt (max. 150 Zeichen)..."
                                    maxLength={150}
                                />
                             </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Combo Deal Offer */}
            <Alert className={cn("border-2 border-primary text-primary transition-all duration-500", watchFields.acceptComboDeal && "bg-primary/10")}>
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="font-headline text-xl">KRISE? Sparen Sie jetzt!</AlertTitle>
                <AlertDescription className="text-primary/90 text-base">
                    Aktivieren Sie dieses Angebot und sparen Sie <span className="font-bold">80% auf "Hallo Welt 1"</span>, indem Sie "Hallo Welt 2" (inkl. Signatur & Widmung) für nur {bookPrices.hw2_signature_package + bookPrices.hw2_preorder}€ VORBESTELLEN!
                </AlertDescription>
                 <div className="flex items-center space-x-3 p-2 rounded-md mt-4">
                    <Controller
                        name="acceptComboDeal"
                        control={control}
                        render={({ field }) => <Checkbox id="acceptComboDeal" checked={field.value} onCheckedChange={field.onChange} className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"/>}
                    />
                    <Label htmlFor="acceptComboDeal" className="font-semibold text-lg cursor-pointer">
                        Ja, ich will den Wahnsinn verdoppeln!
                    </Label>
                </div>
            </Alert>
            
            {/* Konfiguration HW2 (Conditional) */}
            {watchFields.acceptComboDeal && (
                 <div className="space-y-4 p-4 border rounded-lg bg-muted/50 animate-in fade-in slide-in-from-top-5 duration-500">
                    <h3 className="text-xl font-headline font-semibold">2. Konfiguration für "Hallo Welt 2" (Vorbestellung)</h3>
                     <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                        <Checkbox id="hw2_hasSignature" checked={true} disabled />
                        <Label htmlFor="hw2_hasSignature" className="font-semibold text-base flex justify-between w-full">
                            <span>Originalsignatur der Autoren</span>
                            <span className="text-muted-foreground font-mono">Inklusive</span>
                        </Label>
                    </div>
                     <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                        <Controller
                            name="hw2_hasDedication"
                            control={control}
                            render={({ field }) => <Checkbox id="hw2_hasDedication" checked={field.value} onCheckedChange={field.onChange} />}
                        />
                        <Label htmlFor="hw2_hasDedication" className="font-semibold text-base cursor-pointer flex justify-between w-full">
                           <span>Persönliche Widmung</span>
                           <span className="text-muted-foreground font-mono">Inklusive</span>
                        </Label>
                    </div>
                     {watchFields.hw2_hasDedication && (
                        <div className="pl-8 space-y-4 pt-2">
                            <div className="flex items-center space-x-3 p-2 rounded-md">
                                <Controller
                                    name="hw2_provideDedication"
                                    control={control}
                                    render={({ field }) => <Checkbox id="hw2_provideDedication" checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label htmlFor="hw2_provideDedication" className="cursor-pointer flex justify-between w-full">
                                    <span>Ich möchte meine eigene Widmung vorgeben</span>
                                </Label>
                            </div>
                            {watchFields.hw2_provideDedication && (
                                 <div className="pl-2">
                                    <Textarea 
                                        {...register("hw2_customDedication")} 
                                        placeholder="Ihr Wunschtext für die Nachwelt (max. 150 Zeichen)..."
                                        maxLength={150}
                                    />
                                 </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Address Form */}
            <div className="space-y-4">
              <h3 className="text-xl font-headline font-semibold">{watchFields.acceptComboDeal ? '3.' : '2.'} Lieferadresse des Antragstellers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input id="firstName" {...register("firstName")} />
                      {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input id="lastName" {...register("lastName")} />
                      {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>}
                  </div>
              </div>
                <div>
                    <Label htmlFor="email">E-Mail Adresse</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                  <div>
                      <Label htmlFor="street">Straße</Label>
                      <Input id="street" {...register("street")} />
                      {errors.street && <p className="text-sm text-destructive mt-1">{errors.street.message}</p>}
                  </div>
                  <div>
                      <Label htmlFor="houseNumber">Hausnr.</Label>
                      <Input id="houseNumber" {...register("houseNumber")} className="w-24"/>
                      {errors.houseNumber && <p className="text-sm text-destructive mt-1">{errors.houseNumber.message}</p>}
                  </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
                  <div>
                      <Label htmlFor="zip">PLZ</Label>
                      <Input id="zip" {...register("zip")} className="w-28"/>
                      {errors.zip && <p className="text-sm text-destructive mt-1">{errors.zip.message}</p>}
                  </div>
                  <div>
                      <Label htmlFor="city">Ort</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
                  </div>
              </div>
            </div>
        </div>

        {/* Price Summary */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-4 mb-6">
            <h4 className="font-headline text-lg font-semibold">{watchFields.acceptComboDeal ? '4.' : '3.'} Zusammenfassung Ihrer Bestellung</h4>
            <div className="space-y-2 text-sm">
                {/* HW1 Summary */}
                <div className="flex justify-between">
                    <span>{book.title}</span>
                    <span>{bookPrices.hw1.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Logistik & Bearbeitung</span>
                    <span>{bookPrices.logistics.toFixed(2)} €</span>
                </div>
                {watchFields.hw1_hasSignature && <div className="flex justify-between"><span>Originalsignatur (HW1)</span><span>{bookPrices.hw1_signature.toFixed(2)} €</span></div>}
                {watchFields.hw1_hasDedication && <div className="flex justify-between"><span>Persönliche Widmung (HW1)</span><span>{bookPrices.hw1_dedication.toFixed(2)} €</span></div>}
                {watchFields.hw1_hasDedication && watchFields.hw1_provideDedication && <div className="flex justify-between"><span>Wunsch-Text (HW1)</span><span>{bookPrices.hw1_custom_dedication.toFixed(2)} €</span></div>}
                
                {watchFields.acceptComboDeal && (
                    <>
                        <div className="flex justify-between text-destructive">
                            <span>Rabatt (80% auf HW1)</span>
                            <span>-{(bookPrices.hw1 * 0.8).toFixed(2)} €</span>
                        </div>
                        <Separator className="my-2"/>
                        <div className="flex justify-between font-semibold">
                            <span>"Hallo Welt 2" Vorbesteller-Paket</span>
                            <span>{(bookPrices.hw2_preorder + bookPrices.hw2_signature_package).toFixed(2)} €</span>
                        </div>
                         <div className="flex justify-between pl-4 text-xs">
                            <span>Originalpreis Buch</span>
                            <span className="line-through text-muted-foreground">{bookPrices.hw2_original.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between pl-4 text-xs text-destructive">
                            <span>Mengenbegrenzter Rabatt (31%)</span>
                            <span>-{(bookPrices.hw2_original - bookPrices.hw2_preorder).toFixed(2)} €</span>
                        </div>
                    </>
                )}
            </div>
            <Separator />
            {watchFields.acceptComboDeal && totalDiscount > 0 && (
                 <div className="space-y-1 text-sm">
                     <div className="flex justify-between items-baseline">
                        <span className="font-bold text-destructive">Totale Ersparnis:</span>
                        <div className="flex items-baseline gap-2 font-mono">
                            <span className="text-muted-foreground line-through">{originalPrice.toFixed(2)}€</span>
                            <span className="font-bold text-destructive">-{totalDiscount.toFixed(2)}€</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-between font-bold text-xl">
                <span>Zu bezahlen:</span>
                <span className={cn(watchFields.acceptComboDeal ? 'animate-pulse' : '')}>{totalPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isSubmitting}>
                {isSubmitting 
                    ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Wird geprüft...</>
                    : <><CheckCircle className="mr-2 h-6 w-6" />Jetzt unwiderruflich kostenpflichtig bestellen!</>
                }
            </Button>
            <Separator className="my-4 w-2/3" />
             <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button type="button" variant="secondary" className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 border-yellow-500 text-black hover:from-yellow-400/80 hover:to-yellow-500/90">
                    Ohne persönliche Signatur fortfahren
                </Button>
            </a>
        </div>

        <div className="mt-8 text-xs text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-bold flex items-center"><FileText className="mr-2 h-4 w-4"/>Rechtliche Hinweise zur Sonderbestellung</h4>
            <p>1. Mit dem Klick auf "Jetzt unwiderruflich kostenpflichtig bestellen" geben Sie ein verbindliches Angebot zum Kauf der ausgewählten Produkte ab.</p>
            <p>2. Gemäß § 312g Abs. 2 Nr. 1 BGB besteht für Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist (wie bei personalisierten Widmungen oder Signaturen), kein gesetzliches Widerrufsrecht.</p>
            <p>3. Eine Stornierung oder Rückerstattung nach Abschluss der Bestellung ist daher ausgeschlossen. Alle Verkäufe sind endgültig.</p>
            <p>4. Die angegebenen Preise sind Endpreise zzgl. Versandkosten. Die Zahlung wird zum Zeitpunkt der Bestellung fällig. Ihre Daten werden ausschließlich zur Abwicklung dieser Bestellung verwendet.</p>
        </div>
      </form>
    </DialogContent>
  );
}
