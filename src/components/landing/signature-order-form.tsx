
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, FileText } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

const signatureSchema = z.object({
  firstName: z.string().min(1, "Vorname ist ein Pflichtfeld."),
  lastName: z.string().min(1, "Nachname ist ein Pflichtfeld."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  phone: z.string().optional(),
  street: z.string().min(1, "Straße ist ein Pflichtfeld."),
  houseNumber: z.string().min(1, "Hausnummer ist ein Pflichtfeld."),
  zip: z.string().min(4, "Bitte geben Sie eine gültige PLZ ein."),
  city: z.string().min(1, "Ort ist ein Pflichtfeld."),
  country: z.string().default("Deutschland"),
  
  hasSignature: z.boolean().default(false),
  hasDedication: z.boolean().default(false),
  provideDedication: z.boolean().default(false),
  customDedication: z.string().optional(),
});

type SignatureFormValues = z.infer<typeof signatureSchema>;

export function SignatureOrderForm({ book, isHW2Preorder = false }: { book: any, isHW2Preorder?: boolean }) {
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
      country: "Deutschland",
      hasSignature: false,
      hasDedication: false,
      provideDedication: false,
    },
  });

  const watchFields = watch();
  
  const totalPrice = useMemo(() => {
    let price = 10.99 + 7.99; // Buch + Logistik
    if (watchFields.hasSignature) price += 50;
    if (watchFields.hasDedication) price += 20;
    if (watchFields.hasDedication && watchFields.provideDedication) price += 5;
    return price;
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
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-xl font-headline font-semibold">1. Konfiguration Ihres persönlichen Unikats</h3>
                 <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Controller
                        name="hasSignature"
                        control={control}
                        render={({ field }) => <Checkbox id="hasSignature" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <Label htmlFor="hasSignature" className="font-semibold text-base cursor-pointer flex justify-between w-full">
                        <span>Originalsignatur der Autoren</span>
                        <span className="text-muted-foreground font-mono">+50,00 €</span>
                    </Label>
                </div>
                 <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Controller
                        name="hasDedication"
                        control={control}
                        render={({ field }) => <Checkbox id="hasDedication" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <Label htmlFor="hasDedication" className="font-semibold text-base cursor-pointer flex justify-between w-full">
                       <span>Persönliche Widmung</span>
                       <span className="text-muted-foreground font-mono">+20,00 €</span>
                    </Label>
                </div>
                 {watchFields.hasDedication && (
                    <div className="pl-8 space-y-4 pt-2">
                        <div className="flex items-center space-x-3 p-2 rounded-md">
                            <Controller
                                name="provideDedication"
                                control={control}
                                render={({ field }) => <Checkbox id="provideDedication" checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label htmlFor="provideDedication" className="cursor-pointer flex justify-between w-full">
                                <span>Ich möchte meine eigene Widmung vorgeben</span>
                                <span className="text-muted-foreground font-mono">+5,00 €</span>
                            </Label>
                        </div>
                        {watchFields.provideDedication && (
                             <div className="pl-2">
                                <Textarea 
                                    {...register("customDedication")} 
                                    placeholder="Ihr Wunschtext für die Nachwelt (max. 150 Zeichen)..."
                                    maxLength={150}
                                />
                             </div>
                        )}
                        {!watchFields.provideDedication && (
                             <p className="text-xs text-muted-foreground pl-2 italic">Wenn Sie nichts vorgeben, lassen wir uns etwas furchtbar Passendes für Sie einfallen.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-headline font-semibold">2. Lieferadresse des Antragstellers</h3>
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
            <h4 className="font-headline text-lg font-semibold">3. Zusammenfassung Ihrer Bestellung</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Buch: {book.title}</span>
                    <span>10,99 €</span>
                </div>
                 <div className="flex justify-between">
                    <span>Logistik & Bearbeitung</span>
                    <span>7,99 €</span>
                </div>
                {watchFields.hasSignature && (
                    <div className="flex justify-between">
                        <span>Originalsignatur</span>
                        <span>50,00 €</span>
                    </div>
                )}
                {watchFields.hasDedication && (
                    <div className="flex justify-between">
                        <span>Persönliche Widmung</span>
                        <span>20,00 €</span>
                    </div>
                )}
                {watchFields.hasDedication && watchFields.provideDedication && (
                     <div className="flex justify-between">
                        <span>Wunsch-Text für Widmung</span>
                        <span>5,00 €</span>
                    </div>
                )}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl">
                <span>Zu bezahlen:</span>
                <span>{totalPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
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
                <Button variant="secondary" className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 border-yellow-500 text-black hover:from-yellow-400/80 hover:to-yellow-500/90">
                    Ohne persönliche Signatur fortfahren
                </Button>
            </a>
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

    