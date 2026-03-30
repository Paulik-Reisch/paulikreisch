'use client';
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";


export function ShopNewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, { success: undefined, error: undefined, message: undefined });
  const { toast } = useToast();
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button type="submit" disabled={pending || !isConsentGiven} className="newsletter-btn">
        {pending ? <Loader2 className="animate-spin" /> : "Anmelden"}
      </button>
    );
  }

  useEffect(() => {
    if (state.success) {
      toast({ title: "Fast geschafft!", description: state.message });
      formRef.current?.reset();
      setIsConsentGiven(false);
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast]);

  return (
    <>
      <form ref={formRef} action={formAction} className="newsletter-form">
        <input type="email" name="email" placeholder="Ihre E-Mail Adresse" className="newsletter-input" required />
        <input type="hidden" name="source" value="shop-page-newsletter" />
        <SubmitButton />
      </form>
      <div className="flex items-center space-x-3 mt-4 justify-center max-w-sm mx-auto">
        <Checkbox 
          id="shop-newsletter-terms"
          checked={isConsentGiven}
          onCheckedChange={(checked) => setIsConsentGiven(checked as boolean)}
          className="border-white/80 data-[state=checked]:bg-white data-[state=checked]:text-black"
        />
        <Label htmlFor="shop-newsletter-terms" className="text-xs text-white/90 text-left leading-snug">
          Ich stimme zu, den Newsletter zu erhalten und habe die{' '}
          <Link href="/datenschutz" className="underline hover:text-white font-bold" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung
          </Link> gelesen.
        </Label>
      </div>
    </>
  );
}
