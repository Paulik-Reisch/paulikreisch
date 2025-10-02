
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Palabrota } from "@/lib/firestore";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import Link from "next/link";


const PfeiferRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1" aria-label={`Pfeifer-Faktor: ${rating} von 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Flame 
                key={i}
                className={cn(
                    'transition-colors h-5 w-5',
                    i < rating ? 'text-red-500 fill-current animate-flame-in' : 'text-gray-300'
                )}
                style={{ animationDelay: `${i * 100}ms` }}
            />
        ))}
    </div>
);

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[150px_1fr] items-start gap-4">
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            <div>{children}</div>
        </div>
    )
}

function AgeVerification({ onConfirm }: { onConfirm: () => void }) {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const birthdate = formData.get('birthdate') as string;
    
    if (birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        router.push('/lp-palabrotas/mehr-erfahren');
      } else {
        onConfirm();
      }
    } else {
      // Default to confirm if no date is entered
      onConfirm();
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 md:my-24">
       <Card className="bg-white">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Bestätige dein Alter, um fortzufahren</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                    Diese Seite enthält Inhalte, die eventuell nicht für alle Altersklassen geeignet sind. Bitte gib dein Geburtsdatum ein, um fortzufahren.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input type="date" name="birthdate" required className="text-center"/>
                    <Button type="submit" size="lg">
                        Alter bestätigen & fortfahren
                    </Button>
                    <Button asChild variant="ghost" size="lg">
                        <Link href="/lp-palabrotas/mehr-erfahren">Mehr zu sensiblen Inhalten</Link>
                    </Button>
                </form>
                 <p className="text-xs text-muted-foreground pt-4">
                    Indem du fortfährst, stimmst du zu, dass wir deine Daten (imaginär) sammeln, um dein Nutzererlebnis (vermutlich) zu verbessern.
                </p>
            </CardContent>
       </Card>
    </div>
  )
}

export function Palabrotas({ vocabulary }: { vocabulary: Palabrota[] }) {
  const [isVerified, setIsVerified] = useState(false);

  if (!isVerified) {
    return (
        <div className="container px-4 md:px-6">
            <AgeVerification onConfirm={() => setIsVerified(true)} />
        </div>
    );
  }

  return (
    <section className="w-full">
        <div className="py-12 md:py-16 text-center container px-4 md:px-6">
            <Badge>Pfeifer's Vermächtnis</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl mt-4 text-balance">
            Der "Palabrotas"-Duden
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 text-balance">
            Ein essenzieller Wortschatz für den modernen Weltbürger. Präsentiert von der R. Pfeifer Akademie für angewandte Linguistik und zwischenmenschliche Eskalation.
            </p>
        </div>

        <div className="max-w-4xl mx-auto pb-12 md:pb-24 container px-4 md:px-6">
            <Accordion type="single" collapsible className="w-full space-y-4">
                {vocabulary.map((word) => (
                    <AccordionItem key={word.id} value={word.id} className="border-b-0">
                        <AccordionTrigger className="text-xl font-semibold hover:no-underline border rounded-lg p-4 bg-card data-[state=open]:rounded-b-none data-[state=open]:bg-muted/50 transition-all text-left">
                        <div className="flex flex-col items-start w-full">
                            <span className="font-headline text-2xl md:text-3xl font-bold">{word.de}</span>
                            <span className="text-lg italic text-muted-foreground font-normal">{word.es}</span>
                        </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 border border-t-0 rounded-b-lg bg-card text-base">
                        <div className="space-y-6">
                                <DetailRow label="Wortart">
                                    <p>{word.wortart}</p>
                                </DetailRow>
                                <DetailRow label="Anwendung">
                                    <p>{word.anwendung}</p>
                                </DetailRow>
                                <DetailRow label="Synonyme">
                                    <p className="italic">{word.synonyme}</p>
                                </DetailRow>
                                <DetailRow label="Beispielsatz">
                                    <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-0">
                                        {word.beispiel}
                                    </blockquote>
                                </DetailRow>
                                <div className="flex items-center gap-4 pt-2">
                                    <h4 className="font-bold text-sm text-muted-foreground w-[134px]">Pfeifer-Faktor™</h4>
                                    <PfeiferRating rating={word.pfeiferFaktor} />
                                </div>
                        </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        <p className="text-xs text-center text-muted-foreground mt-4">*Haftungsausschluss: Die Autoren übernehmen keine Verantwortung für daraus resultierende soziale oder diplomatische Verwicklungen.</p>
        </div>
    </section>
  );
}
