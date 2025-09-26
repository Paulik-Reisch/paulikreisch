'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { pfeiferTranslateAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Languages, Copy, Settings } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import Image from 'next/image';

const initialState: {
  translation?: string;
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
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/pfeifer-translate-logo.png?alt=media&token=b9cc1522-b994-43d9-ac64-a034cf323a91"
            alt="Pfeifer Translate Logo"
            width={24}
            height={24}
            className="mr-2 rounded-full"
          />
          Verpfeifern!
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
  const [outputText, setOutputText] = useState<string>("");
  const [intensity, setIntensity] = useState(3);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (pending) {
      setOutputText('');
    }
  }, [pending]);
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: state.error,
      });
      setOutputText(""); // Clear output on error
    }
    if (state.translation) {
      setOutputText(state.translation);
    }
  }, [state, toast]);

  const handleCopyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: 'Kopiert!', description: 'Der Text wurde in die Zwischenablage kopiert.' });
  };
  
  return (
    <section className="w-full py-12 md:py-16" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
       <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <Image 
                src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/pfeifer-translate-logo.png?alt=media&token=b9cc1522-b994-43d9-ac64-a034cf323a91"
                alt="Pfeifer Translate Logo"
                width={128}
                height={128}
                className="rounded-full shadow-lg"
            />
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
                    ) : outputText ? (
                        <p>{outputText}</p>
                    ) : (
                        <span className="text-muted-foreground">Übersetzung erscheint hier...</span>
                    )}
               </div>
               <div className="flex justify-between items-center mt-2 px-2">
                 <span className="text-xs text-muted-foreground"></span>
                 <Button type="button" variant="ghost" size="icon" onClick={() => handleCopyToClipboard(outputText)}>
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