"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createTestimonialAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, MessageSquareQuote } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  testimonial: undefined,
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
          Testimonial generieren
        </>
      )}
    </Button>
  );
}

export function TestimonialGenerator() {
  const [state, formAction] = useActionState(createTestimonialAction, initialState);
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
    <Card className="max-w-2xl mx-auto transform -rotate-1 shadow-lg">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">Testimonial-Generator</CardTitle>
          <CardDescription>
            Erstellen Sie Ihre eigene preisgekrönte*, völlig unvoreingenommene* Bewertung für unser Buch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Thema</Label>
              <Input id="topic" name="topic" placeholder="z.B. 'Der Sinn des Lebens'" defaultValue="Das Buch 'Hallo Welt'" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerType">Geschrieben von einem...</Label>
              <Input id="customerType" name="customerType" placeholder="z.B. 'mürrische Katze'" defaultValue="Philosoph" />
            </div>
          </div>

          {state.testimonial && (
            <div className="pt-4 animate-in fade-in">
              <Label>Generiertes Meisterwerk</Label>
              <Card className="bg-muted mt-2">
                <CardContent className="p-4 flex items-start gap-4">
                    <MessageSquareQuote className="w-6 h-6 text-muted-foreground mt-1 shrink-0" />
                    <p className="italic text-muted-foreground">{state.testimonial}</p>
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
