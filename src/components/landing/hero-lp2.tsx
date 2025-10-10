"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletterAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const initialState = { success: undefined, error: undefined, message: undefined };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="lg" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gespeichert ...
                </>
            ) : "Benachrichtigen Sie mich!"
            }
        </Button>
    )
}

export function HeroLP2() {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Fast geschafft!", description: state.message });
      formRef.current?.reset();
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast, router]);

  return (
    <section className="w-full py-12 md:py-20 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance animate-in fade-in slide-in-from-top-12 duration-1000">
              Hallo Welt 2 wird noch krasser als Hallo Welt 1!
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-in fade-in slide-in-from-top-16 duration-1000">
              Sie wollen als Allererster erfahren, wenn das Buch erscheint? Tragen Sie sich hier ein und wir geben Ihnen Bescheid.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2 animate-in fade-in slide-in-from-top-20 duration-1000">
            <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                name="email"
                className="max-w-lg flex-1"
                placeholder="E-Mail-Adresse eingeben"
                type="email"
                required
              />
              <input type="hidden" name="source" value="lp2-hero-release-notify" />
              <SubmitButton />
            </form>
            <p className="text-xs text-muted-foreground">
              Wir benachrichtigen Sie zum Launch. Abmeldung jederzeit möglich.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
