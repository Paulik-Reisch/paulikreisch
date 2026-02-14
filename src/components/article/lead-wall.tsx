'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletterAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const initialNewsletterState = { success: undefined, error: undefined, message: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Artikel freischalten'}
    </Button>
  );
}

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
    <Card className="max-w-xl mx-auto bg-background/80 backdrop-blur-sm border-primary shadow-lg">
      <CardHeader className="text-center">
        <Lock className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="font-headline text-2xl">Lesen Sie den ganzen Artikel</CardTitle>
        <CardDescription>Geben Sie Ihre E-Mail-Adresse ein, um sofort weiterzulesen und exklusive Inhalte zu erhalten.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <Input name="email" type="email" placeholder="Ihre E-Mail-Adresse" required />
          <input type="hidden" name="source" value="article-leadwall" />
          <SubmitButton />
        </form>
        <Button variant="link" onClick={onUnlock} className="mt-2 text-xs text-muted-foreground w-full">
          Nein danke, ich möchte nur weiterlesen.
        </Button>
      </CardContent>
    </Card>
  );
}
