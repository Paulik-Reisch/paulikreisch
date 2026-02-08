
'use client';
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="newsletter-btn">
      {pending ? <Loader2 className="animate-spin" /> : "Anmelden"}
    </button>
  );
}

export function ShopNewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, { success: undefined, error: undefined, message: undefined });
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
    <form ref={formRef} action={formAction} className="newsletter-form">
      <input type="email" name="email" placeholder="Deine E-Mail Adresse" className="newsletter-input" required />
      <input type="hidden" name="source" value="shop-page-newsletter" />
      <SubmitButton />
    </form>
  );
}
