"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createDbExcuseAction } from "@/app/actions";
import type { GenerateDbExcuseOutput } from "@/ai/flows/generate-db-excuse-flow";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, TrainFront } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InitialState {
  excuse: GenerateDbExcuseOutput | null;
  error: string | null;
}

const initialState: InitialState = {
  excuse: null,
  error: null,
};

const initialExcuse = {
    part1: "Technische Störung",
    part2: "am Gleis",
    part3: "verzögert die Abfahrt.",
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-48 h-24 rounded-full bg-red-600 hover:bg-red-700 text-white text-2xl font-bold border-8 border-red-800 shadow-2xl transform active:scale-95 transition-transform">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        </>
      ) : (
        "HEBEL ZIEHEN"
      )}
    </Button>
  );
}

function SlotReel({ text, isSpinning }: { text: string, isSpinning: boolean }) {
    const previousTextRef = useRef<string>();

    useEffect(() => {
        previousTextRef.current = text;
    }, [text]);

    const previousText = previousTextRef.current;
    
    return (
        <div className="h-24 bg-gray-800 border-4 border-gray-900 rounded-lg overflow-hidden relative shadow-inner">
            <div
                key={text}
                className={cn(
                    "absolute inset-0 flex items-center justify-center text-2xl font-bold text-center p-2",
                    isSpinning && "animate-slot-reel-scroll"
                )}
            >
                {isSpinning && previousText && (
                    <span className="absolute top-0 transform -translate-y-full">{previousText}</span>
                 )}
                <span>{text}</span>
            </div>
        </div>
    );
}

export function DbExcuseGenerator() {
  const [state, formAction] = useActionState(createDbExcuseAction, initialState);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayExcuse, setDisplayExcuse] = useState<GenerateDbExcuseOutput>(initialExcuse);

  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: state.error,
      });
      setIsSpinning(false);
    }
    if (state.excuse) {
      setTimeout(() => {
         setDisplayExcuse(state.excuse as GenerateDbExcuseOutput);
         setIsSpinning(false);
      }, 500); // Duration of the animation
    }
  }, [state, toast]);

  const handleFormAction = (formData: FormData) => {
    setIsSpinning(true);
    formAction(formData);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-700 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge variant="destructive" className="text-lg py-1 px-4">Hallo Welt 2</Badge>
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Der Deutsche Bahn Ausreden-Bot
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl text-balance">
              Warum hat Dein Zug Verspätung? Ziehe am Hebel und erhalte eine 100% authentische*, garantiert absurde Ausrede.
            </p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-gray-600 rounded-2xl shadow-2xl border-8 border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <SlotReel text={displayExcuse.part1} isSpinning={isSpinning} />
                <SlotReel text={displayExcuse.part2} isSpinning={isSpinning} />
                <SlotReel text={displayExcuse.part3} isSpinning={isSpinning} />
            </div>

             <div className="flex justify-center items-center flex-col gap-4">
                <form action={handleFormAction} className="flex justify-center">
                    <SubmitButton />
                </form>
                <p className="text-xs text-gray-400 mt-2">*Authentizität nicht von der DB bestätigt.</p>
            </div>
        </div>

        {state.excuse && !isSpinning && (
            <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                 <Link href="/buchhandlung-paulik-reisch">
                    <Button size="lg" variant="secondary">Mehr Katastrophen auf 300 Seiten.</Button>
                </Link>
            </div>
        )}
      </div>
    </section>
  );
}
