"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { pfeiferTranslateAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Languages, ArrowRightLeft, Copy } from "lucide-react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const initialState = {
  translation: "",
  error: undefined,
};

function TranslateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Pfeife...
        </>
      ) : (
        <>
          <Languages className="mr-2 h-4 w-4" />
          Übersetzen
        </>
      )}
    </Button>
  );
}

export function PfeiferTranslator() {
  const [state, formAction] = useActionState(pfeiferTranslateAction, initialState);
  const { toast } = useToast();
  const [inputText, setInputText] = useState("Der Klassenraum ist leer, denn die Schüler schwänzen alle!");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("Deutsch");
  const [targetLang, setTargetLang] = useState("Spanisch");
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: state.error,
      });
    }
    if (state.translation) {
      setOutputText(state.translation);
    }
  }, [state, toast]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    const currentInput = inputText;
    setInputText(outputText);
    setOutputText(currentInput);
  };

  const handleCopyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert!", description: "Der Text wurde in die Zwischenablage kopiert." });
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOutputText(""); // Clear previous translation
    const formData = new FormData(event.currentTarget);
    formAction(formData);
  }

  return (
    <section className="w-full py-12 md:py-24" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <Badge variant="secondary">La Silbadora Special</Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl text-balance">
            Pfeifer Translate
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
            Ein Übersetzer, den die Welt nicht braucht, aber verdient hat. Angetrieben von der Genialität und dem Chaos von R. Pfeifer.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleFormSubmit} className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="border bg-card rounded-lg p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Button type="button" variant={sourceLang === "Deutsch" ? "secondary" : "ghost"} size="sm" onClick={() => setSourceLang("Deutsch")}>Deutsch</Button>
                <Button type="button" variant={sourceLang === "Spanisch" ? "secondary" : "ghost"} size="sm" onClick={() => setSourceLang("Spanisch")}>Spanisch</Button>
              </div>
              <Textarea
                name="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Hier Text eingeben..."
                className="flex-grow bg-transparent border-0 focus-visible:ring-0 resize-none text-lg p-2"
                rows={8}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">{inputText.length} / 500</span>
                <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleCopyToClipboard(inputText)}>
                        <Copy className="h-5 w-5" />
                    </Button>
                </div>
              </div>
            </div>

            {/* Output Box */}
            <div className="border bg-muted/50 rounded-lg p-4 flex flex-col relative">
               <div className="flex items-center gap-2 mb-2">
                 <Button type="button" variant="secondary" size="sm">Pfeiferisch</Button>
               </div>
               <div className="flex-grow p-2 text-lg min-h-[224px] text-left">
                    {useFormStatus().pending ? (
                         <div className="space-y-3">
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-5/6" />
                        </div>
                    ) : (
                        outputText || <span className="text-muted-foreground">Übersetzung erscheint hier...</span>
                    )}
               </div>
               <div className="flex justify-between items-center mt-2">
                 <span className="text-xs text-muted-foreground"></span>
                 <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleCopyToClipboard(outputText)}>
                        <Copy className="h-5 w-5" />
                    </Button>
                 </div>
               </div>

                <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSwapLanguages} 
                    className="absolute top-1/2 left-1/2 md:left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background border-2 z-10"
                >
                    <ArrowRightLeft className="h-5 w-5" />
                </Button>
            </div>
          </div>
          <TranslateButton />
        </form>
      </div>
    </section>
  );
}
