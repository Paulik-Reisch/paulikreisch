"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { continueChapterAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bot, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";

const initialState = {
  chapterContinuation: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          KI schreibt ...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Kapitel fortsetzen
        </>
      )}
    </Button>
  );
}

export function ChapterWriter() {
  const [state, formAction] = useFormState(continueChapterAction, initialState);
  const { toast } = useToast();
  const [chapterText, setChapterText] = useState("KAPITEL 42: Der Tag, an dem das Internet verschwand und die Menschheit gezwungen war, miteinander zu reden. Es war eine Katastrophe.");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  useEffect(() => {
    if (state.chapterContinuation) {
      setChapterText(prev => `${prev.trim()} ${state.chapterContinuation}`);
    }
  }, [state.chapterContinuation]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = '0px'; // Temporarily shrink to get the correct scrollHeight
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [chapterText]);


  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(chapterText);
    toast({
        title: "Kopiert!",
        description: "Das Kapitel wurde in die Zwischenablage kopiert.",
    })
  }

  return (
    <section id="chapter-writer" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <Card className="max-w-4xl mx-auto shadow-2xl transform rotate-1">
                <form action={formAction}>
                    <CardHeader>
                    <CardTitle className="font-headline text-3xl">Schreiben Sie Ihr eigenes Kapitel</CardTitle>
                    <CardDescription>
                        Geben Sie dem HalloWeltGPT einen Anfang und sehen Sie zu, wie die Magie (oder das Chaos) passiert.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="chapterText" className="sr-only">Kapiteltext</Label>
                            <Textarea
                                ref={textareaRef}
                                id="chapterText"
                                name="chapterText"
                                className="w-full text-base p-4 min-h-[200px] resize-none overflow-hidden"
                                value={chapterText}
                                onChange={(e) => setChapterText(e.target.value)}
                                placeholder="Beginnen Sie hier Ihr Kapitel ..."
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
                        <SubmitButton />
                         <Button type="button" variant="outline" onClick={handleCopyToClipboard}>
                            <Clipboard className="mr-2 h-4 w-4" />
                            Kapitel kopieren
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </section>
  );
}