
"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { pfeiferTranslateAction } from "@/app/actions";
import { PfeiferTranslateOutput } from "@/ai/flows/pfeifer-translate-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Languages, Copy, Settings } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Translation = PfeiferTranslateOutput['translation'];

const initialState: {
  translation?: Translation;
  error?: string;
} = {
  translation: undefined,
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

const intensityLabels = [
    "Dezentes Flüstern",
    "Leichtes Säuseln",
    "Normaler Wahnsinn",
    "Fortgeschrittenes Chaos",
    "Maximaler Genickbruch"
];

export function PfeiferTranslator() {
  const [state, formAction] = useActionState(pfeiferTranslateAction, initialState);
  const { toast } = useToast();
  const [inputText, setInputText] = useState("Der Klassenraum ist leer, denn die Schüler schwänzen alle!");
  const [outputText, setOutputText] = useState<Translation>([]);
  const [intensity, setIntensity] = useState(3);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (pending) {
      setOutputText([]);
    }
  }, [pending]);
  
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

  const handleCopyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert!", description: "Der Text wurde in die Zwischenablage kopiert." });
  };
  
  const getFullTextFromOutput = () => {
    return outputText.map(segment => segment.content).join('');
  }

  return (
    <section className="w-full py-12 md:py-16" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
       <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-2 text-center mb-8">
             <p className="text-sm font-semibold text-primary">La Silbadora Special</p>
            <h1 className="font-headline text-2xl font-bold tracking-tighter">
                Pfeifer Translate
            </h1>
            <p className="max-w-[700px] text-muted-foreground text-sm">
                Ein Übersetzer, den die Welt nicht braucht, aber verdient hat. Angetrieben von der Genialität und dem Chaos von R. Pfeifer.
            </p>
        </div>

        <form action={formAction} className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <input type="hidden" name="intensity" value={intensity} />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="border bg-card rounded-lg p-4 flex flex-col">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 px-2">
                <span>Deutsch / Spanisch</span>
              </div>
              <Textarea
                name="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Hier Text eingeben..."
                className="flex-grow bg-transparent border-0 focus-visible:ring-0 resize-none text-lg p-2"
                rows={8}
              />
              <div className="flex justify-between items-center mt-2 px-2">
                <span className="text-xs text-muted-foreground">{inputText.length} / 500</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleCopyToClipboard(inputText)}>
                    <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Output Box */}
            <div className="border bg-muted/50 rounded-lg p-4 flex flex-col relative">
               <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 px-2">
                 <span>Pfeiferisch</span>
                 <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Pfeiferische Intensität</h4>
                                <p className="text-sm text-muted-foreground">
                                    Steuert, wie chaotisch die Übersetzung wird.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Slider
                                    value={[intensity]}
                                    onValueChange={(value) => setIntensity(value[0])}
                                    min={1}
                                    max={5}
                                    step={1}
                                />
                                <div className="text-center font-bold text-primary">{intensityLabels[intensity - 1]}</div>
                            </div>
                        </div>
                    </PopoverContent>
                 </Popover>
               </div>
               <div className="flex-grow p-2 text-lg min-h-[224px] text-left">
                    {pending ? (
                         <div className="space-y-3">
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-5/6" />
                        </div>
                    ) : outputText.length > 0 ? (
                        <TooltipProvider>
                             <p>
                                {outputText.map((segment, index) => {
                                    if (segment.type === 'text') {
                                        return <span key={index}>{segment.content}</span>;
                                    }

                                    const tooltipContent = (
                                        <TooltipContent>
                                            {segment.type === 'palabrota' ? (
                                                <div className="p-2 max-w-xs">
                                                    <p className="font-bold text-base">{segment.details.es}</p>
                                                    <p className="text-sm text-muted-foreground">Deutsch: {segment.details.de}</p>
                                                    <p className="text-xs mt-2 italic">"{segment.details.anwendung}"</p>
                                                </div>
                                            ) : (
                                                <div className="p-2 max-w-xs">
                                                     <p className="font-bold text-base">{segment.details.witz}</p>
                                                     <p className="text-xs mt-2 italic">{segment.details.erklaerung}</p>
                                                </div>
                                            )}
                                        </TooltipContent>
                                    );

                                    return (
                                        <Tooltip key={index}>
                                            <TooltipTrigger asChild>
                                                <span className="underline decoration-dotted cursor-help font-semibold text-primary">
                                                    {segment.content}
                                                </span>
                                            </TooltipTrigger>
                                            {tooltipContent}
                                        </Tooltip>
                                    );
                                })}
                            </p>
                        </TooltipProvider>
                    ) : (
                        <span className="text-muted-foreground">Übersetzung erscheint hier...</span>
                    )}
               </div>
               <div className="flex justify-between items-center mt-2 px-2">
                 <span className="text-xs text-muted-foreground"></span>
                 <Button type="button" variant="ghost" size="icon" onClick={() => handleCopyToClipboard(getFullTextFromOutput())}>
                    <Copy className="h-5 w-5" />
                 </Button>
               </div>
            </div>
          </div>
          <TranslateButton />
        </form>
      </div>
    </section>
  );
}
