
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Timer, CheckCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

const COUNTDOWN_SECONDS = (11 * 60) + 32;

const PRICES = {
  book: 17.99, // HW2 price
  signature: 35.0,
  dedication: 15.0, // Let's make this a bit more reasonable
  customDedication: 10.0,
};

const preorderSchema = z.object({
  firstName: z.string().min(1, "Vorname ist ein Pflichtfeld."),
  lastName: z.string().min(1, "Nachname ist ein Pflichtfeld."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: z.string().optional(),
  street: z.string().min(1, "Straße ist ein Pflichtfeld."),
  houseNumber: z.string().min(1, "Hausnummer ist ein Pflichtfeld."),
  zip: z.string().min(4, "Bitte geben Sie eine gültige PLZ ein."),
  city: z.string().min(1, "Ort ist ein Pflichtfeld."),
  country: z.string().default("Deutschland"),
  
  quantity: z.number().min(1, "Mindestens 1 Exemplar.").max(10, "Maximal 10 Exemplare.").default(1),
  hasSignature: z.boolean().default(false),
  signaturePlacement: z.enum(["front", "back", "inside"]).optional(),
  signaturePage: z.string().optional(),
  hasDedication: z.boolean().default(false),
  provideDedication: z.boolean().default(false),
  customDedication: z.string().optional(),
});

type PreorderFormValues = z.infer<typeof preorderSchema>;


export function HW2PreorderPopup() {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PreorderFormValues>({
    resolver: zodResolver(preorderSchema),
    defaultValues: {
      country: "Deutschland",
      quantity: 1,
      hasSignature: true, // Pre-selected for the special offer
      hasDedication: false,
      provideDedication: false,
    },
  });

  const watchFields = watch();

  const totalSignaturePrice = useMemo(() => {
    let total = PRICES.signature;
     if (watchFields.hasDedication) {
      total += PRICES.dedication;
    }
    if (watchFields.hasDedication && watchFields.provideDedication) {
      total += PRICES.customDedication;
    }
    return total;
  }, [watchFields]);
  
  const totalBookPrice = PRICES.book * (watchFields.quantity || 1);
  const totalPrice = totalSignaturePrice + totalBookPrice;


  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const onSubmit = async (data: PreorderFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Vorbestelldaten:", data);
    toast({
        title: "Herzlichen Glückwunsch (oder Beileid?)",
        description: "Ihre unverbindliche, aber moralisch verpflichtende Vorbestellung wurde registriert.",
    });
  };

  return (
    <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-center">Ihre EXKLUSIVE Vorbesteller-Chance!</DialogTitle>
            <DialogDescription className="text-center text-base">
                Dieses Angebot ist so flüchtig wie die Motivation eines Beamten am Freitagnachmittag.
            </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 my-4 border-2 border-dashed border-destructive rounded-xl bg-destructive/10">
            <div className="flex items-center text-destructive font-bold text-lg">
                <Timer className="mr-2 h-6 w-6"/>
                Angebot endet in:
            </div>
            <div className={cn("font-mono text-5xl font-bold", timeLeft < 60 && "text-destructive")}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
        </div>

        <div className="my-8 space-y-6">
            
            {/* Konfiguration */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-xl font-headline font-semibold">1. Konfiguration des Unikats</h3>
                <div>
                    <Label htmlFor="quantity">Stückzahl "Hallo Welt 2"</Label>
                    <Input id="quantity" type="number" min="1" max="10" {...register("quantity", { valueAsNumber: true })} className="w-24 mt-1"/>
                    {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>}
                </div>
                 <div className="flex items-center space-x-2">
                    <Controller
                        name="hasSignature"
                        control={control}
                        render={({ field }) => <Checkbox id="hasSignature" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <Label htmlFor="hasSignature" className="font-semibold">Originalsignatur der Autoren</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Controller
                        name="hasDedication"
                        control={control}
                        render={({ field }) => <Checkbox id="hasDedication" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <Label htmlFor="hasDedication" className="font-semibold">Persönliche Widmung</Label>
                </div>
                 {watchFields.hasDedication && (
                    <div className="pl-6 space-y-4">
                        <div className="flex items-center space-x-2">
                            <Controller
                                name="provideDedication"
                                control={control}
                                render={({ field }) => <Checkbox id="provideDedication" checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label htmlFor="provideDedication">Eigene Widmung vorgeben</Label>
                        </div>
                        {watchFields.provideDedication && (
                            <Textarea 
                                {...register("customDedication")} 
                                placeholder="Ihr Wunschtext für die Nachwelt..."
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Persönliche Daten */}
            <div className="space-y-4">
              <h3 className="text-xl font-headline font-semibold">2. Lieferadresse</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="email">E-Mail Adresse</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="phone">Telefon (optional)</Label>
                    <Input id="phone" type="tel" {...register("phone")} />
                </div>
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

        <div className="p-4 bg-muted/50 rounded-lg space-y-4 mb-6">
            <h4 className="font-headline text-lg font-semibold">Zusammenfassung</h4>
            <div className="space-y-3 text-sm">
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>Signiertes Vorbesteller-Exemplar</span>
                        <span className="line-through text-muted-foreground">90,00€</span>
                    </div>
                     <div className="flex justify-between text-destructive">
                        <span>Zeitlich begrenzter Rabatt</span>
                        <span>-55,00€</span>
                    </div>
                    <div className="flex justify-between font-medium">
                        <span>Zwischensumme</span>
                        <span>35,00€</span>
                    </div>
                </div>
                <Separator/>
                 <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>Hallo Welt 2</span>
                        <span className="line-through text-muted-foreground">25,99€</span>
                    </div>
                     <div className="flex justify-between text-destructive">
                        <span>Mengenbegrenzter Rabatt (31%)</span>
                        <span>-8,00€</span>
                    </div>
                    <div className="flex justify-between font-medium">
                        <span>Zwischensumme</span>
                        <span>17,99€</span>
                    </div>
                </div>
                <Separator />
                <div className="space-y-1">
                    <div className="flex justify-between text-destructive font-bold">
                        <span>Totale Ersparnis:</span>
                        <span>-63,00€</span>
                    </div>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl">
                <span>Zu bezahlen:</span>
                <span>52,99€</span>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isSubmitting || timeLeft === 0}>
                {isSubmitting 
                    ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Wird geprüft...</>
                    : <><CheckCircle className="mr-2 h-6 w-6" />Jetzt unwiderruflich kostenpflichtig bestellen!</>
                }
            </Button>

            <Separator className="my-4 w-2/3" />
            
            <DialogClose asChild>
                <a href="https://www.amazon.de/dp/B0D9L4DCMG" target="_blank" rel="noopener noreferrer" className="w-full">
                   <Button variant="secondary" className="w-full">
                     Ohne persönliche Signatur fortfahren
                   </Button>
                </a>
            </DialogClose>
        </div>


        <div className="mt-8 text-xs text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-bold flex items-center"><FileText className="mr-2 h-4 w-4"/>Rechtliche Hinweise zur Sonderbestellung</h4>
            <p>1. Bei diesem Angebot handelt es sich um eine zeitlich begrenzte Vorbestellaktion für eine signierte Sonderausgabe. Mit dem Klick auf "Jetzt unwiderruflich kostenpflichtig bestellen" geben Sie ein verbindliches Angebot zum Kauf des Produkts ab.</p>
            <p>2. Gemäß § 312g Abs. 2 Nr. 1 BGB besteht für Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist (wie bei personalisierten Widmungen oder Signaturen), kein gesetzliches Widerrufsrecht.</p>
            <p>3. Eine Stornierung oder Rückerstattung nach Abschluss der Bestellung ist daher ausgeschlossen. Alle Verkäufe im Rahmen dieser Aktion sind endgültig.</p>
            <p>4. Die angegebenen Preise sind Endpreise zzgl. Versandkosten. Die Zahlung wird zum Zeitpunkt der Bestellung fällig. Ihre Daten werden ausschließlich zur Abwicklung dieser Bestellung verwendet.</p>
            <p>5. Die Unterschriften der Autoren sind ein künstlerischer Akt und können in Form und Lesbarkeit variieren. Dies stellt keinen Mangel dar.</p>
        </div>
      </form>
    </DialogContent>
  );
}

    