"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const PRICES = {
  book: 10.99,
  signature: 35.0,
  dedication: 35.0,
  customDedication: 15.0,
};

const orderSchema = z.object({
  firstName: z.string().min(1, "Vorname ist ein Pflichtfeld."),
  lastName: z.string().min(1, "Nachname ist ein Pflichtfeld."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  street: z.string().min(1, "Straße ist ein Pflichtfeld."),
  houseNumber: z.string().min(1, "Hausnummer ist ein Pflichtfeld."),
  addressExtra: z.string().optional(),
  zip: z.string().min(4, "Bitte geben Sie eine gültige PLZ ein."),
  city: z.string().min(1, "Ort ist ein Pflichtfeld."),
  country: z.string().min(1, "Land ist ein Pflichtfeld."),
  quantity: z.number().min(1, "Mindestens 1 Exemplar.").max(10, "Maximal 10 Exemplare."),
  hasSignature: z.boolean().default(false),
  signaturePlacement: z.enum(["front", "back", "inside"]).optional(),
  signaturePage: z.string().optional(),
  hasDedication: z.boolean().default(false),
  provideDedication: z.boolean().default(false),
  customDedication: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export function SignatureOrderForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      country: "Deutschland",
      quantity: 1,
      hasSignature: false,
      hasDedication: false,
      provideDedication: false,
    },
  });

  const watchFields = watch();

  const totalPrice = useMemo(() => {
    let total = PRICES.book;
    if (watchFields.hasSignature) {
      total += PRICES.signature;
    }
    if (watchFields.hasDedication) {
      total += PRICES.dedication;
    }
    if (watchFields.hasDedication && watchFields.provideDedication) {
      total += PRICES.customDedication;
    }
    return total * (watchFields.quantity || 1);
  }, [watchFields]);

  const onSubmit = (data: OrderFormValues) => {
    setIsSubmitting(true);
    console.log("Bestelldaten:", data);
    setTimeout(() => {
        toast({
            title: "Antrag (fast) angenommen!",
            description: "Ihre exklusive Bestellung wurde zur bürokratischen Prüfung weitergeleitet. Sie hören in 3-5 Geschäftsjahren von uns.",
        });
        setIsSubmitting(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Persönliche Daten */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">1. Lieferadresse des Antragstellers</h3>
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
        <div>
          <Label htmlFor="addressExtra">Adresszusatz (optional)</Label>
          <Input id="addressExtra" {...register("addressExtra")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-4">
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
             <div>
                <Label htmlFor="country">Land</Label>
                <Input id="country" {...register("country")} />
                {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
            </div>
        </div>
      </div>
      
      <Separator />

      {/* Bestelloptionen */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">2. Konfiguration des Unikats</h3>
        <div>
            <Label htmlFor="quantity">Stückzahl</Label>
            <Input id="quantity" type="number" min="1" max="10" {...register("quantity", { valueAsNumber: true })} className="w-24 mt-1"/>
            {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>}
        </div>

        <div className="p-4 border rounded-md space-y-4">
            <div className="flex items-center space-x-2">
                <Controller
                    name="hasSignature"
                    control={control}
                    render={({ field }) => <Checkbox id="hasSignature" checked={field.value} onCheckedChange={field.onChange} />}
                />
                <Label htmlFor="hasSignature" className="font-semibold">Originalsignatur (+{PRICES.signature.toFixed(2)}€)</Label>
            </div>
            {watchFields.hasSignature && (
                <Controller
                    name="signaturePlacement"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="pl-6 space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="front" id="front" />
                                <Label htmlFor="front">Auf Cover Vorderseite</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="back" id="back" />
                                <Label htmlFor="back">Auf Cover Rückseite</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="inside" id="inside" />
                                <Label htmlFor="inside">Innen auf Seite</Label>
                                <Input type="text" {...register("signaturePage")} className="w-20 h-8 ml-2" disabled={watchFields.signaturePlacement !== 'inside'} placeholder="z.B. 3"/>
                            </div>
                        </RadioGroup>
                    )}
                />
            )}
        </div>

        <div className="p-4 border rounded-md space-y-4">
            <div className="flex items-center space-x-2">
                 <Controller
                    name="hasDedication"
                    control={control}
                    render={({ field }) => <Checkbox id="hasDedication" checked={field.value} onCheckedChange={field.onChange} />}
                />
                <Label htmlFor="hasDedication" className="font-semibold">Persönliche Widmung von Philipp & Max (+{PRICES.dedication.toFixed(2)}€)</Label>
            </div>
            {watchFields.hasDedication && (
                <div className="pl-6 space-y-4">
                     <div className="flex items-center space-x-2">
                        <Controller
                            name="provideDedication"
                            control={control}
                            render={({ field }) => <Checkbox id="provideDedication" checked={field.value} onCheckedChange={field.onChange} />}
                        />
                        <Label htmlFor="provideDedication">Eigene Widmung vorgeben (+{PRICES.customDedication.toFixed(2)}€)</Label>
                    </div>
                     {watchFields.provideDedication && (
                        <Textarea 
                            {...register("customDedication")} 
                            placeholder="Ihr Wunschtext für die Nachwelt..."
                            className="ml-6"
                        />
                    )}
                </div>
            )}
        </div>
      </div>
      
      <Separator />

      {/* Footer */}
      <div className="pt-6">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Jetzt kostenpflichtig für {totalPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} bestellen*
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">*Finale Kosten zzgl. MwSt. und Versand werden in einer separaten, extrem wichtigen E-Mail mitgeteilt.</p>
        
        <div className="mt-8 text-center text-xs text-muted-foreground border-t pt-4">
            <p>Weitere Informationen und eine Vorschau des künstlerischen Signaturprozesses können Sie per E-Mail an hallowelt@paulik-reisch.de beantragen. Rechnen Sie mit einer Bearbeitungszeit von 4-6 Wochen.</p>
        </div>
      </div>
    </form>
  );
}
