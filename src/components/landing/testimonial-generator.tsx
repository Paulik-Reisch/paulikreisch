"use client";

import { useFormState, useFormStatus } from "react-dom";
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
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Testimonial
        </>
      )}
    </Button>
  );
}

export function TestimonialGenerator() {
  const [state, formAction] = useFormState(createTestimonialAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <Card className="max-w-2xl mx-auto transform -rotate-1 shadow-lg">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">Testimonial Generator</CardTitle>
          <CardDescription>
            Create your own award-winning*, completely unbiased* review for our book.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" placeholder="e.g., 'The meaning of life'" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerType">As written by a...</Label>
              <Input id="customerType" name="customerType" placeholder="e.g., 'grumpy cat'" />
            </div>
          </div>

          {state.testimonial && (
            <div className="pt-4 animate-in fade-in">
              <Label>Generated Masterpiece</Label>
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
