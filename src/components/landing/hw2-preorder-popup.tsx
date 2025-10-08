

"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Timer, CheckCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Product } from "@/lib/firestore";
import { useActionState } from "react";
import { createOrderAction } from "@/app/actions";

const COUNTDOWN_SECONDS = (11 * 60) + 32;

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
  
  hasSignature: z.boolean().default(true),
  hasDedication: z.boolean().default(false),
  provideDedication: z.boolean().default(false),
  customDedication: z.string().optional(),
});

type PreorderFormValues = z.infer<typeof preorderSchema>;

const bookPrices = {
    hw2_signature_package: 35.00,
};

export function HW2PreorderPopup({ book, children }: { book: Product, children: React.ReactNode }) {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [state, formAction] = useActionState(createOrderAction, { success: false, error: null });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm<PreorderFormValues>({
    resolver: zodResolver(preorderSchema),
    defaultValues: {
      country: "Deutschland",
      hasSignature: true,
      hasDedication: false,
      provideDedication: false,
    },
  });

  const watchFields = watch();
  
  useEffect(() => {
    if (timeLeft > 0 && isDialogOpen) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isDialogOpen]);
  
  useEffect(() => {
      if (state.success) {
        toast({
            title: "Herzlichen Glückwunsch!",
            description: "Ihre Bestellung wurde registriert.",
        });
        reset();
        setIsDialogOpen(false);
      }
      if (state.error) {
        toast({
            variant: "destructive",
            title: "Fehler",
            description: state.error
        });
      }
  }, [state, toast, reset]);


  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const { totalPrice, totalDiscount, originalTotalPrice } = useMemo(() => {
    const signaturePrice = bookPrices.hw2_signature_package;
    const bookPrice = book.preorderPrice || book.price || 0;
    const originalBookPrice = book.price || 0;
    
    const price = signaturePrice + bookPrice;
    const originalPrice = signaturePrice + originalBookPrice;
    const discount = originalPrice - price;

    return { totalPrice: price, totalDiscount: discount, originalTotalPrice: originalPrice };
  }, [book]);

  const onFormSubmit = (data: PreorderFormValues) => {
    const orderPayload = {
      ...data,
      orderType: 'HW2 Preorder',
      items: [{
          id: book.id,
          title: book.title,
          type: 'Buch',
          price: book.preorderPrice,
          signature: data.hasSignature,
          dedication: data.hasDedication ? (data.provideDedication ? data.customDedication : 'Standard') : null,
      }],
      totalPrice,
      timestamp: new Date().toISOString(),
    };
    const formData = new FormData();
    formData.append("payload", JSON.stringify(orderPayload));
    formAction(formData);
  };
  
  const isSubmitting = (state as any)?.pending;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <DialogHeader>
                <DialogTitle className="font-headline text-3xl text-center">
                    Ihre EXKLUSIVE Vorbesteller-Chance!
                </DialogTitle>
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

            <div className="my-8 space-y-8">
                 <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="text-xl font-headline font-semibold">1. Konfiguration Ihres persönlichen Unikats</h3>
                    <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                        <Checkbox id="hasSignature" checked={true} disabled />
                        <Label htmlFor="hasSignature" className="font-semibold text-base cursor-pointer">Originalsignatur der Autoren</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                        <Controller
                            name="hasDedication"
                            control={control}
                            render={({ field }) => <Checkbox id="hasDedication" checked={field.value} onCheckedChange={field.onChange} />}
                        />
                        <Label htmlFor="hasDedication" className="font-semibold text-base cursor-pointer">Persönliche Widmung</Label>
                    </div>
                    {watchFields.hasDedication && (
                        <div className="pl-8 space-y-4 pt-2">
                            <div className="flex items-center space-x-3 p-2 rounded-md">
                                <Controller
                                    name="provideDedication"
                                    control={control}
                                    render={({ field }) => <Checkbox id="provideDedication" checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label htmlFor="provideDedication" className="cursor-pointer">Ich möchte meine eigene Widmung vorgeben</Label>
                            </div>
                            {watchFields.provideDedication && (
                                <div className="pl-2">
                                    <Textarea 
                                        {...register("customDedication")} 
                                        placeholder="Ihr Wunschtext für die Nachwelt (max. 150 Zeichen) ..."
                                        maxLength={150}
                                    />
                                </div>
                            )}
                            {!watchFields.provideDedication && (
                                <p className="text-xs text-muted-foreground pl-2 italic">Wenn Sie nichts vorgeben, lassen wir uns etwas Furchtbares einfallen!</p>
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
                <div className="space-y-3 text-sm">
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span>Originale Signatur und Widmung der Autoren</span>
                             <span>{bookPrices.hw2_signature_package.toFixed(2)} €</span>
                        </div>
                    </div>
                    <Separator/>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span>{book.title}</span>
                            <span className="line-through text-muted-foreground">{book.price.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-destructive">
                            <span>Mengenbegrenzter Rabatt ({Math.round((1 - (book.preorderPrice || 0) / (book.price || 1)) * 100)}%)</span>
                            <span>-{(book.price - (book.preorderPrice || 0)).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Zwischensumme Buch</span>
                            <span>{(book.preorderPrice || 0).toFixed(2)} €</span>
                        </div>
                    </div>
                    <Separator />
                     <div className="space-y-1">
                         <div className="flex justify-between items-baseline">
                            <span className="text-destructive font-bold">Totale Ersparnis:</span>
                            <div className="flex items-baseline gap-2 font-mono">
                                <span className="text-muted-foreground line-through">{originalTotalPrice.toFixed(2)}€</span>
                                <span className="font-bold text-destructive">-{totalDiscount.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                    <span>Zu bezahlen:</span>
                    <span>{totalPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
                <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isSubmitting || (timeLeft === 0)}>
                    {isSubmitting 
                        ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Wird geprüft ...</>
                        : <><CheckCircle className="mr-2 h-6 w-6" />Jetzt unwiderruflich kostenpflichtig bestellen!</>
                    }
                </Button>
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
    </Dialog>
  );
}
