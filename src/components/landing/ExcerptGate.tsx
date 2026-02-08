
"use client";

import React, { useEffect, useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail } from "lucide-react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletterAction, logEventAction } from "@/app/actions";
import { useUser } from "@/firebase/provider";
import { usePathname } from 'next/navigation';

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Mail className="mr-2 h-4 w-4" /> Jetzt freischalten</>}
        </Button>
    )
}

export function ExcerptGate({ onUnlock }: { onUnlock: () => void }) {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (state.success) {
      toast({ title: "Erfolgreich eingetragen!", description: state.message });
      if (user) {
        logEventAction('newsletter_subscription', user.uid, pathname, { source: 'excerpt-gate' });
      }
      onUnlock();
    }
    if (state.error) {
      toast({ variant: "destructive", title: "Fehler", description: state.error });
    }
  }, [state, toast, onUnlock, user, pathname]);
  
  return (
    <div className="relative flex justify-center py-12">
        <div className="relative z-10 w-full max-w-3xl p-8 text-center bg-background border-2 border-primary rounded-xl shadow-2xl">
            <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="font-headline text-2xl font-bold">Der Rest ist geheim!</h3>
            <p className="text-muted-foreground mt-2 mb-6">
                Sie haben den Anfang geschafft. Um weiterzulesen und die volle Dosis Wahrheit zu erhalten, tragen Sie sich einfach für unseren Newsletter ein.
            </p>
            <form ref={formRef} action={formAction} className="space-y-4">
                <Input name="email" type="email" placeholder="Ihre E-Mail-Adresse" required />
                <input type="hidden" name="source" value="excerpt-gate" />
                <SubmitButton />
            </form>
            <Button variant="link" onClick={onUnlock} className="mt-2 text-xs text-muted-foreground">
                Nein danke, ich möchte nur weiterlesen.
            </Button>
        </div>
    </div>
  );
}
