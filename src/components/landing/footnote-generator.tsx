"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createFootnoteAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, BookText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  footnote: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Wird generiert...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Fußnote generieren
        </>
      )}
    </Button>
  );
}

export function FootnoteGenerator() {
  const [state, formAction] = useActionState(createFootnoteAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Fehler bei der Generierung",
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">Fußnoten-Generator</CardTitle>
          <CardDescription>
            Gib ein beliebiges Wort ein und die KI erstellt eine passende, absolut überflüssige Erklärung.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Thema</Label>
            <Input id="topic" name="topic" placeholder="z.B. 'Kaffeemaschine', 'Büroklammer', 'Existenzkrise'" />
          </div>

          {state.footnote && (
            <div className="pt-4 animate-in fade-in">
              <Label>Generiertes Meisterwerk</Label>
              <Card className="bg-muted mt-2">
                <CardContent className="p-4 flex items-start gap-4">
                    <BookText className="w-6 h-6 text-muted-foreground mt-1 shrink-0" />
                    <p className="italic text-muted-foreground">{state.footnote}</p>
                </CardContent>
              </Card>
            </div>
          )}

        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
