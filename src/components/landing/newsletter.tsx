"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({ title: "Fast geschafft!", description: state.message });
      formRef.current?.reset();
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast]);

  return (
    <section id="newsletter" className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl">Treten Sie der Gemeinschaft der Verwirrten bei</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
            Erhalten Sie exklusive Inhalte, Updates und weitere fragwürdige Lebensratschläge direkt in Ihren Posteingang. Wir versprechen, Sie nicht zuzuspammen. Kaum.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          <form ref={formRef} action={formAction} className="flex space-x-2">
            <Input name="email" className="max-w-lg flex-1" placeholder="Ihre E-Mail-Adresse eingeben" type="email" required />
            <input type="hidden" name="source" value="footer-newsletter" />
            <SubmitButton />
          </form>
          <p className="text-xs text-muted-foreground">
            Melden Sie sich an, um benachrichtigt zu werden, wenn wir etwas Neues veröffentlichen. Wir werden Ihre E-Mail niemals weitergeben. Wahrscheinlich.
          </p>
        </div>
      </div>
    </section>
  );
}
