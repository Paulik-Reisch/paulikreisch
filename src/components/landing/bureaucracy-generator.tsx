"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createBureaucracyResponseAction } from "@/app/actions";
import type { GenerateBureaucracyOutput } from "@/ai/flows/generate-bureaucracy-flow";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface InitialState {
  response: GenerateBureaucracyOutput | null;
  error: string | null;
}

const initialState: InitialState = {
  response: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Antrag wird bearbeitet ...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Antrag einreichen
        </>
      )}
    </Button>
  );
}

function BureaucracyResponse({ data }: { data: GenerateBureaucracyOutput }) {
    return (
        <div className="p-8 md:p-12 bg-white text-black font-serif shadow-2xl border-2 border-black max-w-4xl w-full mx-auto my-12 animate-in fade-in zoom-in-95" style={{aspectRatio: '1 / 1.414'}}>
            <div className="text-right text-xs mb-8">
                <p>{data.department}</p>
                <p>Abteilung für organisatorisches Unvermögen</p>
                <p>Amtsgasse 123</p>
                <p>12345 Bürokratia</p>
            </div>
            
            <div className="text-xs mb-8">
                <p>Herr/Frau Antragsteller</p>
                <p>Verzweiflungsallee 42</p>
                <p>54321 Ahnungslos</p>
            </div>

            <div className="text-right text-sm mb-8">
                 <p>Datum: {data.date}</p>
                 <p>Aktenzeichen: {data.referenceNumber}</p>
            </div>

            <h2 className="text-lg font-bold mb-6">{data.subject}</h2>

            <div className="space-y-4 text-sm text-justify leading-relaxed">
                 {data.responseBody.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            
            <div className="mt-16">
                <p className="text-sm">{data.greeting}</p>
                <div className="mt-12">
                    <p className="border-t border-gray-400 pt-1 text-xs">Unterschrift</p>
                    <p className="font-semibold text-sm mt-4">{data.officerName}</p>
                    <p className="text-xs italic">{data.officerTitle}</p>
                </div>
            </div>
        </div>
    )
}

export function BureaucracyGenerator() {
  const [state, formAction] = useActionState(createBureaucracyResponseAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge>Hallo Welt 2</Badge>
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Der Bürokratie-Generator
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Schilderen Sie uns Ihr Problem. Wir garantieren eine Antwort, die garantiert nicht weiterhilft. Effizienz, wie sie im Buche steht!
            </p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-12">
          <form action={formAction} className="flex flex-col items-center gap-4">
            <div className="w-full">
              <Label htmlFor="problem" className="sr-only">Ihr Problem</Label>
              <Textarea
                id="problem"
                name="problem"
                placeholder="Beispiel: Ich möchte meine Steuererklärung abgeben."
                required
                className="h-24 text-lg text-center"
              />
            </div>
            <SubmitButton />
          </form>
        </div>

        {state.response && <BureaucracyResponse data={state.response} />}

        {state.response && (
            <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                 <Link href="/buchhandlung-paulik-reisch">
                    <Button size="lg" variant="secondary">Noch mehr Amtswahnsinn finden Sie im Buch.</Button>
                </Link>
            </div>
        )}
      </div>
    </section>
  );
}
