'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletterAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Artikel freischalten'}
    </Button>
  );
}

const reasons = [
    { text: "IMMER kostenlos" },
    { text: "IMMER werbefrei" },
    { text: "IMMER öffentlich zugänglich" },
    { text: "IMMER (hoffentlich) lustig" },
    { text: "IMMER unabhängig geschrieben" },
    { text: "IMMER ohne Tracking-Exzesse" },
    { text: "IMMER mit Herzblut gemacht" },
    { text: "IMMER mit einer Prise Wahnsinn" },
    { text: "IMMER auf der Seite des Lesers" },
    { text: "IMMER gegen den Strom" },
    { text: "IMMER ein Grund zum Schmunzeln" },
    { text: "IMMER ehrlich (manchmal zu sehr)" },
];

export function LeadWall({ onUnlock }: { onUnlock: () => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(subscribeToNewsletterAction, initialNewsletterState);

  useEffect(() => {
    if (state.success) {
      toast({ title: 'Erfolgreich eingetragen!', description: state.message });
      onUnlock();
    }
    if (state.error) {
      toast({ variant: 'destructive', title: 'Fehler', description: state.error });
    }
  }, [state, toast, onUnlock]);

  return (
    <div className="bg-muted py-8 px-6 mt-[15px] rounded-lg">
      <div className="max-w-xl mx-auto text-center">
        <Lock className="mx-auto h-12 w-12 text-primary" />
        <h2 className="font-headline text-2xl font-bold mt-4">Lesen Sie den ganzen Artikel</h2>
        <p className="text-muted-foreground mt-2">Geben Sie Ihre E-Mail-Adresse ein, um sofort weiterzulesen und exklusive Inhalte zu erhalten.</p>
        <div className="mt-6">
          <form ref={formRef} action={formAction} className="space-y-4">
            <Input name="email" type="email" placeholder="Ihre E-Mail-Adresse" required />
            <input type="hidden" name="source" value="article-leadwall" />
            <SubmitButton />
          </form>
          <Button variant="link" onClick={onUnlock} className="mt-2 text-xs text-muted-foreground w-full">
            Nein danke, ich möchte nur weiterlesen.
          </Button>
        </div>

        <div className="mt-8 text-center">
            <Separator />
             <div className="py-6 space-y-4">
                <h4 className="font-semibold text-sm">Warum eine Wall?</h4>
                <ul className="space-y-2 text-lg text-left text-muted-foreground max-w-xs mx-auto">
                    {reasons.map((reason, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                            <span>{reason.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Separator />
            <div className="mt-6 text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-lg text-green-600">Danke, dass Sie uns unterstützen!</p>
                <p>
                    Einen Gastbeitrag verfassen oder uns einen Liebesbrief schreiben? E-Mail an uns:{' '}
                    <a href="mailto:philipp.l.paulik@gmail.com" className="underline">Philipp</a>{' & '}
                    <a href="mailto:maximilian.reisch@t-online.de" className="underline">Max</a>.
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                    Brieftauben-, wie auch Flaschenpost empfangen wir derzeit nicht.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
