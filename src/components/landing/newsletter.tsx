
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Confetti } from "./confetti";

const initialState = { success: undefined, error: undefined, message: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : (
        "Abonnieren"
      )}
    </Button>
  );
}

export function Newsletter() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialState);
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
    <section id="newsletter" className="w-full py-12 md:py-16 lg:py-20 bg-destructive/60">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl text-black">Treten Sie der Gemeinschaft der Verwirrten bei</h2>
          <p className="mx-auto max-w-[600px] text-black/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Erhalten Sie exklusive Inhalte und Updates direkt in Ihren Posteingang. Wir versprechen, Sie nicht zuzuspammen.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2 relative">
          <form ref={formRef} action={formAction} className="flex space-x-2">
            <Input name="email" className="max-w-lg flex-1" placeholder="Deine E-Mail-Adresse" type="email" required />
            <input type="hidden" name="source" value="footer-newsletter" />
            <SubmitButton />
          </form>
           {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
          <p className="text-xs text-black/80">
            Melden Dich an, um benachrichtigt zu werden, wenn wir etwas Neues veröffentlichen. Wir werden Deine E-Mail wahrscheinlich niemals weitergeben.
          </p>
        </div>
      </div>
    </section>
  );
}
