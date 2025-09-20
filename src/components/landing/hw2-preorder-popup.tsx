
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Timer, Gift, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const COUNTDOWN_SECONDS = 10 * 60; // 10 minutes

export function HW2PreorderPopup() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [priceStep, setPriceStep] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);
  
  useEffect(() => {
    const steps = [90, 70, 50];
    if(priceStep < steps.length) {
        const timer = setTimeout(() => setPriceStep(priceStep + 1), 700);
        return () => clearTimeout(timer);
    }
  }, [priceStep]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        toast({
            title: "Herzlichen Glückwunsch (oder Beileid?)",
            description: "Ihre unverbindliche, aber moralisch verpflichtende Vorbestellung wurde registriert.",
        });
        setIsSubmitting(false);
    }, 2000);
  };

  const PriceSlasher = ({ value, delay }: { value: number; delay: number }) => (
    <span style={{ animationDelay: `${delay}ms`}} className="line-through text-muted-foreground/80 animate-in fade-in zoom-in-50 duration-500">
        {value.toFixed(2)}€
    </span>
  );

  return (
    <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            <div className={cn("font-mono text-5xl font-bold", timeLeft < 60 ? "text-destructive animate-pulse" : "text-foreground")}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
        </div>

        <div className="text-center space-y-4">
            <h3 className="font-headline text-2xl font-semibold">Signierte Sonderausgabe</h3>
            <p className="text-muted-foreground">Nur für die nächsten {minutes} Minuten erhalten Sie ein von den Autoren persönlich signiertes Exemplar zum absoluten Vorzugspreis!</p>
            <div className="text-4xl font-bold space-x-4">
                {priceStep > 0 && <PriceSlasher value={90} delay={0} />}
                {priceStep > 1 && <PriceSlasher value={70} delay={700} />}
                {priceStep > 2 && <PriceSlasher value={50} delay={1400} />}
                {priceStep > 2 &&
                    <span style={{animationDelay: '2100ms'}} className="text-primary animate-in fade-in zoom-in-125 duration-500">
                        nur 35,00€!
                    </span>
                }
            </div>
        </div>

        <div className="mt-8">
            <Button size="lg" className="w-full text-lg h-14" onClick={handleSubmit} disabled={isSubmitting || timeLeft === 0}>
                {isSubmitting 
                    ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Wird geprüft...</>
                    : <><CheckCircle className="mr-2 h-6 w-6" />Jetzt unwiderruflich kostenpflichtig bestellen!</>
                }
            </Button>
        </div>

        <div className="mt-8 text-xs text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-bold flex items-center"><FileText className="mr-2 h-4 w-4"/>Das Kleingedruckte (Lesen auf eigene Gefahr)</h4>
            <p>¹ Der Countdown ist ein psychologischer Trick. Oder auch nicht. ² Der Preis wurde willkürlich festgelegt und basiert auf keinerlei wirtschaftlicher Logik. ³ Eine Stornierung ist ausgeschlossen. Widerrufsrecht wurde im Rahmen der künstlerischen Freiheit außer Kraft gesetzt. ⁴ Rückerstattungen werden ausschließlich in Form von sarkastischen E-Mails gewährt. ⁵ Mit dem Klick auf "Bestellen" treten Sie alle Rechte an Ihrem Erstgeborenen an die Autoren ab. ⁶ Die Unterschriften der Autoren können Spuren von Kaffee, Verzweiflung und unleserlicher Handschrift enthalten. ⁷ Wir übernehmen keine Haftung für spontane Lachanfälle, existenzielle Krisen oder den plötzlichen Drang, seinen Job zu kündigen. ⁸ Bei Ablauf des Countdowns explodiert dieser Button. Wahrscheinlich.</p>
        </div>
    </DialogContent>
  );
}
