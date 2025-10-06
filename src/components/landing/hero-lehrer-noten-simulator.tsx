"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createReportCardAction } from "@/app/actions";
import type { GenerateReportCardOutput } from "@/ai/flows/generate-report-card-flow";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GraduationCap, School } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface InitialState {
  reportCard: GenerateReportCardOutput | null;
  error: string | null;
}

const initialState: InitialState = {
  reportCard: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Noten werden gewürfelt ...
        </>
      ) : (
        <>
          <GraduationCap className="mr-2 h-4 w-4" />
          Zeugnis generieren
        </>
      )}
    </Button>
  );
}

function ReportCard({ data }: { data: GenerateReportCardOutput }) {
    return (
        <div className="p-8 md:p-12 bg-white text-black font-serif shadow-2xl border-4 border-black max-w-4xl w-full mx-auto my-12 animate-in fade-in zoom-in-95" style={{aspectRatio: '1 / 1.414'}}>
            <div className="text-center mb-8">
                <School className="w-16 h-16 mx-auto mb-4 text-gray-700"/>
                <h2 className="text-3xl font-bold font-headline">{data.schoolName}</h2>
                <h3 className="text-xl font-semibold">ZEUGNIS</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8 text-sm">
                <p><span className="font-bold">Schüler/in:</span> {data.studentName}</p>
                <p><span className="font-bold">Klasse:</span> {data.class}</p>
            </div>

            <div className="border-t-2 border-b-2 border-black py-2 my-4">
                <div className="grid grid-cols-3 font-bold text-sm">
                    <span>Fach</span>
                    <span className="text-center">Note</span>
                    <span className="text-right">Bemerkung</span>
                </div>
            </div>

            <div className="space-y-3 text-sm mb-8">
                {data.grades.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-x-4 items-start border-b border-dashed border-gray-300 pb-2">
                        <span className="font-semibold">{item.subject}</span>
                        <span className="text-center font-mono font-bold text-lg">{item.grade}</span>
                        <span className="text-right italic text-gray-600">"{item.comment}"</span>
                    </div>
                ))}
            </div>

            <div>
                <h4 className="font-bold text-sm">Bemerkungen des Direktors:</h4>
                <p className="italic text-sm mt-1 text-gray-700">{data.finalComment}</p>
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-4 items-end">
                <div>
                     <p className="text-xs">Ausgestellt am: {new Date().toLocaleDateString('de-DE')}</p>
                </div>
                <div className="text-center">
                    <p className="font-cursive text-2xl leading-none">{data.teacherSignature}</p>
                    <p className="border-t-2 border-black mt-1 pt-1 text-xs font-sans">Unterschrift (Direktor/in)</p>
                </div>
            </div>
        </div>
    )
}

export function HeroLehrerNotenSimulator() {
  const [state, formAction] = useActionState(createReportCardAction, initialState);
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
          <Badge>Hallo Welt</Badge>
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Der Lehrer-Noten-Simulator
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Geben Sie Ihren Namen ein und erhalten Sie ein absurdes Schulzeugnis. Ihre wahren Talente – wie Pausenbrot-Management – werden endlich gewürdigt.
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto mt-12">
          <form action={formAction} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full flex-grow">
              <Label htmlFor="studentName" className="sr-only">Ihr Name</Label>
              <Input
                id="studentName"
                name="studentName"
                placeholder="Dein Name ..."
                required
                className="h-12 text-lg text-center sm:text-left"
              />
            </div>
            <SubmitButton />
          </form>
        </div>

        {state.reportCard && <ReportCard data={state.reportCard} />}

        {state.reportCard && (
            <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                 <Link href="/buchhandlung-paulik-reisch">
                    <Button size="lg" variant="secondary">Ihr Zeugnis ist lächerlich – das Buch noch mehr!</Button>
                </Link>
            </div>
        )}
      </div>
    </section>
  );
}
