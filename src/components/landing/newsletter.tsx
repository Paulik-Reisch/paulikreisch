"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { Confetti } from "./confetti";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function NewsletterFormContent() {
  const { pending } = useFormStatus();
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9184]" />
          <Input
            name="email"
            aria-label="E-Mail-Adresse"
            className="h-[52px] pl-10 pr-4 rounded-[10px] bg-white border-2 border-[#e8ddd0] text-[#1d1a15] placeholder:text-[#9a9184] focus-visible:border-[#1d1a15] focus-visible:ring-0 shadow-sm"
            placeholder="Deine@email.de"
            type="email"
            required
          />
          <input type="hidden" name="source" value="footer-newsletter" />
        </div>
        <Button
          type="submit"
          disabled={pending || !isConsentGiven}
          className="h-[52px] px-7 rounded-[10px] bg-[#ffe14d] text-[#1d1a15] border-2 border-[#1d1a15] shadow-[0_3px_0_#1d1a15] hover:bg-[#ffeb7a] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_1px_0_#1d1a15] dark:border-[#bfa100] dark:shadow-[0_3px_0_#6b5700] dark:hover:shadow-[0_4px_0_#6b5700] dark:active:shadow-[0_1px_0_#6b5700] font-bold text-[1.02rem] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 shrink-0"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sende …
            </>
          ) : (
            "Ja, ich will lachen →"
          )}
        </Button>
      </div>
      <label className="flex items-start gap-3 text-left cursor-pointer group">
        <Checkbox
          id="nl-terms-dark"
          checked={isConsentGiven}
          onCheckedChange={(v) => setIsConsentGiven(v as boolean)}
          className="mt-0.5 border-[#1d1a15]/30 data-[state=checked]:bg-[#1d1a15] data-[state=checked]:border-[#1d1a15] data-[state=checked]:text-white"
        />
        <span className="text-[0.82rem] leading-snug text-[#1d1a15]">
          Ich habe die{" "}
          <Link href="/datenschutz" className="underline decoration-[#1d1a15]/30 underline-offset-4 hover:decoration-[#1d1a15] font-semibold text-[#1d1a15]" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung
          </Link>{" "}
          gelesen und möchte den Newsletter per E-Mail erhalten (ca. einmal pro Woche, jederzeit abbestellbar).
        </span>
      </label>
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
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="relative w-full py-16 md:py-20 lg:py-24 bg-[#1d1a15] text-[#f7f2e7] overflow-hidden border-t-2 border-[#1d1a15]"
    >
      {/* paper dots + glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.045]" style={{ backgroundImage: "radial-gradient(#f7f2e7 1.1px, transparent 1.1px)", backgroundSize: "22px 22px" }} />
      <div aria-hidden="true" className="pointer-events-none absolute -top-28 -right-24 h-[520px] w-[520px] rounded-full bg-[#ffe14d]/[0.07] blur-[0.5px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 h-[560px] w-[560px] rounded-full bg-white/[0.04] blur-[0.5px]" />

      <div className="relative container px-4 md:px-6">
        <div className="mx-auto max-w-[860px] flex flex-col items-center text-center gap-8">
          <div className="space-y-3">
            <h2
              id="newsletter-heading"
              className="font-[Georgia,_Iowan_Old_Style,_Times_New_Roman,_serif] text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-[1.05] tracking-[-0.015em] text-balance"
            >
              Verpasse nichts —<br className="hidden sm:block" /> sonst lachen andere ohne Dich
            </h2>
            <p className="mx-auto max-w-[560px] text-[clamp(1rem,1.6vw,1.12rem)] leading-relaxed text-[#e6ddc9] text-balance">
              Neue Episoden aus der Lernvollzugsanstalt direkt ins Postfach. Satire, die den Schulwahnsinn ernst nimmt — damit Du es nicht mehr musst.
            </p>
          </div>

          {/* Card — Paper on dark */}
          <div className="w-full max-w-[640px] rounded-[18px] bg-white border-2 border-[#1d1a15] shadow-[0_6px_0_#0f0e0c] p-5 md:p-6 text-left">
            <form ref={formRef} action={formAction}>
              <NewsletterFormContent />
            </form>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[0.78rem] leading-snug text-[#6b6256] border-t border-[#e8ddd0] pt-4">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#1d1a15]" /> DSGVO-sicher</span>
              <span className="opacity-30">·</span>
              <span>Abmeldung in 1 Klick</span>
              <span className="opacity-30">·</span>
              <span>Kein Tracking-Quatsch</span>
            </div>
            {showConfetti && <Confetti onComplete={() => setTimeout(() => setShowConfetti(false), 0)} />}
          </div>

          <p className="text-[0.82rem] leading-snug text-[#cfc4ac]">Schon 1.200+ Leser lachen mit — sei dabei.</p>
        </div>
      </div>
    </section>
  );
}
