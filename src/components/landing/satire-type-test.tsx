"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createSatireTypeAction } from "@/app/actions";
import type { GenerateSatireTypeOutput } from "@/ai/flows/generate-satire-type-flow";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Sparkles, UserCheck, Twitter, Facebook, Copy } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import Link from "next/link";


interface InitialState {
  result: GenerateSatireTypeOutput | null;
  error: string | null;
}

const initialState: InitialState = {
  result: null,
  error: null,
};

const questions = [
    { id: "q1", label: "Der Wecker klingelt um 7:00 Uhr. Deine erste Reaktion?", options: ["Snooze. Immer Snooze.", "Ich war schon um 6 wach und habe die Welt verflucht.", "Direkt aus dem Bett, der Tag muss optimiert werden.", "Wecker? Ich stehe auf, wenn die Angst mich weckt."] },
    { id: "q2", label: "Die Bahn meldet 'unbestimmte Verspätung'. Du denkst:", options: ["'Großartig, mehr Zeit für existenzielle Krisen.'", "'Ich wusste es! Ich hätte mein eigenes Gleis verlegen sollen.'", "'Das stört meine präzise getaktete Tagesplanung!'", "'Ich setze mich auf den Boden und werde eins mit dem Chaos.'"] },
    { id: "q3", label: "Du musst ein kompliziertes Formular ausfüllen. Du...", options: ["...fängst an zu weinen und benutzt die Tränen als Tinte.", "...analysierst es, findest 3 Fehler im Amtsdeutsch und reichst eine Korrektur ein.", "...füllst es mit absurden Antworten aus, um das System zu testen.", "...schiebst es so lange auf, bis es von selbst vergilbt."] },
    { id: "q4", label: "Dein Chef bittet um 'proaktives Engagement'. Du...", options: ["...nickst verständnisvoll und änderst absolut nichts.", "...erstellst eine 30-seitige Präsentation über die Ineffizienz von Meetings.", "...gründest ein Komitee zur Definierung von 'proaktiv'.", "...versteckst dich auf der Toilette."] },
    { id: "q5", label: "Dein Lebensmotto lautet:", options: ["'Warum einfach, wenn es auch umständlich geht?'", "'Es ist nicht alles schlecht, aber fast.'", "'Läuft bei mir. Zwar rückwärts und bergab, aber läuft.'", "'Optimismus ist nur ein Mangel an Information.'"] },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Seele wird analysiert ...
        </>
      ) : (
        <>
          <UserCheck className="mr-2 h-4 w-4" />
          Meine schreckliche Wahrheit enthüllen
        </>
      )}
    </Button>
  );
}

function SocialShareButtons({ text }: { text: string }) {
    const { toast } = useToast();
    const shareUrl = "https://hallowelt-buch.de/lp-satire-typ-test";
    const fullText = `${text} Finde deinen Typ heraus: #HalloWelt #SatireTypTest`;

    const handleCopy = () => {
        navigator.clipboard.writeText(`${fullText} ${shareUrl}`);
        toast({ title: "Kopiert!", description: "Der Text zum Teilen wurde kopiert." });
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
                <Button variant="outline">
                    <Twitter className="mr-2" /> X / Twitter
                </Button>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
                <Button variant="outline">
                    <Facebook className="mr-2" /> Facebook
                </Button>
            </a>
            <Button variant="outline" onClick={handleCopy}>
                <Copy className="mr-2" /> Kopieren
            </Button>
        </div>
    );
}

function ResultCard({ data }: { data: GenerateSatireTypeOutput }) {
    return (
        <Card className="max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 mt-12 transform -rotate-1 shadow-2xl">
            <CardHeader className="text-center items-center">
                <p className="text-sm font-semibold text-primary">Dein offizielles Ergebnis</p>
                <CardTitle className="font-headline text-4xl">{data.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <Image 
                    src={`https://placehold.co/600x400.png`}
                    data-ai-hint={data.imagePrompt}
                    width={600}
                    height={400}
                    alt={data.title}
                    className="rounded-lg shadow-md aspect-video object-cover mx-auto"
                />
                <CardDescription className="text-base text-foreground text-justify italic px-4">
                    "{data.description}"
                </CardDescription>
                <div className="px-4">
                    <p className="text-lg font-semibold text-balance">"{data.shareText}"</p>
                    <SocialShareButtons text={data.shareText} />
                </div>
            </CardContent>
             <CardFooter className="flex-col gap-4 text-center">
                <p className="text-sm text-muted-foreground">Gefällt dir dein Ergebnis? Im Buch findest du noch mehr davon.</p>
                <Link href="/buchhandlung-paulik-reisch">
                    <Button variant="secondary">Alle Typen im Buch kennenlernen</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export function SatireTypeTest() {
  const [state, formAction] = useActionState(createSatireTypeAction, initialState);
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
    <section className="w-full py-12 md:py-24 lg:py-32" style={{backgroundColor: 'hsl(var(--color-bg-light-pink))'}}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge className="py-1 px-4 text-base"><Sparkles className="mr-2"/>Persönlichkeitstest</Badge>
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Welche Katastrophenfigur bist du?
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Beantworte diese 5 absolut wissenschaftlichen Fragen und finde heraus, welcher Charakter aus dem "Hallo Welt"-Universum tief in deiner Seele schlummert.
            </p>
          </div>
        </div>
        
        {state.result ? (
            <ResultCard data={state.result} />
        ) : (
            <div className="max-w-2xl mx-auto mt-12">
            <form action={formAction} className="flex flex-col items-center gap-8 p-8 border rounded-xl shadow-lg bg-card">
                {questions.map((q, index) => (
                    <div key={q.id} className="w-full space-y-2">
                        <Label htmlFor={q.id} className="text-lg font-semibold text-left">{index + 1}. {q.label}</Label>
                        <Select name={q.id} required>
                            <SelectTrigger id={q.id} className="w-full h-12 text-base">
                                <SelectValue placeholder="Wähle deine Wahrheit..." />
                            </SelectTrigger>
                            <SelectContent>
                                {q.options.map((opt) => (
                                    <SelectItem key={opt} value={opt} className="text-base">{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
                <SubmitButton />
                 {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
            </form>
            </div>
        )}

      </div>
    </section>
  );
}
