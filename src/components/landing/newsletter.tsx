"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Confetti } from "./confetti";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

// This new component encapsulates the form's interactive elements and state.
function NewsletterFormContent() {
  const { pending } = useFormStatus();
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          name="email"
          aria-label="E-Mail-Adresse"
          className="max-w-lg flex-1 bg-background placeholder:text-muted-foreground"
          placeholder="E-Mail-Adresse eingeben"
          type="email"
          required
        />
        <input type="hidden" name="source" value="footer-newsletter" />
        <Button type="submit" disabled={pending || !isConsentGiven} variant="default">
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Abonnieren"
          )}
        </Button>
      </div>
      <div className="flex items-start space-x-3 px-1">
        <Checkbox
          id="terms"
          checked={isConsentGiven}
          onCheckedChange={(checked) => setIsConsentGiven(checked as boolean)}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-xs text-secondary-foreground/90 text-left leading-snug">
          Ich habe die{' '}
          <Link href="/datenschutz" className="underline hover:text-secondary-foreground font-bold" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung
          </Link> gelesen.
        </Label>
      </div>
    </div>
  );
}

export function Newsletter() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({ title: "Fast geschafft!", description: state.message });
      formRef.current?.reset();
      setShowConfetti(true);
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
      setShowConfetti(false);
    }
  }, [state, toast]);

  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="space-y-3">
          <h2 id="newsletter-heading" className="text-3xl font-bold font-headline tracking-tighter md:text-4xl text-secondary-foreground">Immer was zum Lachen!</h2>
          <p className="mx-auto max-w-[600px] text-secondary-foreground/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Erhalten Sie exklusive Inhalte und Updates direkt in Ihren Posteingang.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2 relative">
          <form ref={formRef} action={formAction}>
            <NewsletterFormContent />
          </form>
           {showConfetti && <Confetti onComplete={() => setTimeout(() => setShowConfetti(false), 0)} />}
        </div>
      </div>
    </section>
  );
}
