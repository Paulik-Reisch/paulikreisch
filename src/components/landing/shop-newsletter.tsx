
"use client";

import React, { useEffect, useActionState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletterAction } from "@/app/actions";
import { useFormStatus } from "react-dom";

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function NewsletterSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : "Abonnieren"}
        </Button>
    )
}

export function ShopNewsletter() {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);

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
    <section className="w-full pt-8 md:pt-8 pb-8 md:pb-12">
        <div className="container px-4 md:px-6">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                    <Card className="flex flex-col justify-center items-center p-8 text-center bg-muted/50">
                         <div className="p-3 bg-primary/10 rounded-full mb-4">
                             <Info className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-headline text-2xl font-bold">Hallo Welt 2 kommt</h3>
                        <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-balance">
                           Die Fortsetzung, die niemand wollte, aber jeder braucht.
                        </p>
                        <Link href="/lp2">
                            <Button variant="outline">
                                Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </Card>
                     <Card className="flex flex-col justify-center items-center p-8 text-center bg-muted/50">
                         <div className="p-3 bg-primary/10 rounded-full mb-4">
                             <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-headline text-2xl font-bold">Nichts verpassen</h3>
                        <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-balance">
                            Benachrichtigung erhalten, wenn Hallo Welt 2 online geht.
                        </p>
                         <form ref={formRef} action={formAction} className="w-full max-w-sm flex gap-2">
                            <Input type="email" name="email" placeholder="meine.email@adresse.de" required className="flex-grow"/>
                            <input type="hidden" name="source" value="book-shop-newsletter" />
                            <NewsletterSubmitButton />
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    </section>
  );
}
