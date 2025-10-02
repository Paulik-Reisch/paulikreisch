
"use client";

import { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, Search, FilterX, ChevronDown } from "lucide-react";
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
        <div>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{label}</span>
            <div className="mt-1">{children}</div>
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
        router.push('/lp-palabrotas/mehr-erfahren#minderjaehrig');
      } else {
        onConfirm();
      }
    } else {
        // Allow proceeding if no date is entered, for users who don't want to provide it.
        onConfirm();
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 md:my-24">
       <Card className="bg-white">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Bestätige dein Alter</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                    Diese Seite enthält sensible Inhalte. Um fortzufahren, bestätige bitte dein Alter.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input type="date" name="birthdate" required className="text-center"/>
                    <Button type="submit" size="lg">
                        Alter bestätigen & fortfahren
                    </Button>
                    <Link href="/lp-palabrotas/mehr-erfahren">
                        <Button variant="link" size="sm">
                           Mehr zu sensiblen Inhalten
                        </Button>
                    </Link>
                </form>
            </CardContent>
       </Card>
    </div>
  )
}

export function Palabrotas({ vocabulary }: { vocabulary: Palabrota[] }) {
  const [isVerified, setIsVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pfeiferFilter, setPfeiferFilter] = useState<number | null>(null);

  const filteredVocabulary = useMemo(() => {
    return vocabulary
      .filter((word) => {
        if (!searchTerm) return true;
        return (
          word.de.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.es.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .filter((word) => {
        if (pfeiferFilter === null) return true;
        return word.pfeiferFaktor === pfeiferFilter;
      });
  }, [vocabulary, searchTerm, pfeiferFilter]);

  if (!isVerified) {
    return (
        <div className="container px-4 md:px-6">
            <AgeVerification onConfirm={() => setIsVerified(true)} />
        </div>
    );
  }

  return (
    <section className="w-full" style={{ backgroundColor: '#e9f5ff' }}>
        <div className="py-12 md:py-16 text-center container px-4 md:px-6 border-b">
            <Badge>Pfeifer's Vermächtnis</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl mt-4 text-balance">
            Der "Palabrotas"-Duden
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 text-balance">
            Ein essenzieller Wortschatz für den modernen Weltbürger. Präsentiert von der R. Pfeifer Akademie für angewandte Linguistik und zwischenmenschliche Eskalation.
            </p>
        </div>

        <div className="max-w-4xl mx-auto py-12 md:py-16 container px-4 md:px-6">
            <div className="mb-8 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Suchen nach Deutsch oder Spanisch..."
                        className="pl-10 h-12 text-lg bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">Filter nach Pfeifer-Faktor™:</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Button 
                            key={i}
                            variant={pfeiferFilter === i + 1 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPfeiferFilter(pfeiferFilter === i + 1 ? null : i + 1)}
                            className="flex items-center gap-1 bg-white/50"
                        >
                            {i + 1} <Flame className="h-4 w-4"/>
                        </Button>
                    ))}
                    {pfeiferFilter !== null && (
                         <Button variant="ghost" size="sm" onClick={() => setPfeiferFilter(null)} className="h-7 text-muted-foreground">
                            <FilterX className="mr-2 h-4 w-4"/>
                            Filter zurücksetzen
                        </Button>
                    )}
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
                {filteredVocabulary.map((word) => (
                    <AccordionItem 
                        key={word.id} 
                        value={word.id} 
                        className="border-none overflow-hidden rounded-lg data-[state=open]:border data-[state=open]:shadow-md"
                    >
                        <AccordionTrigger className="text-xl font-semibold hover:no-underline p-0 bg-white text-left group data-[state=open]:border-b">
                            <div className="flex flex-col md:flex-row items-center w-full">
                                {/* Mobile layout */}
                                <div className="w-full md:hidden flex flex-col items-center py-3 px-4">
                                  <div className="text-lg font-semibold">{word.de}</div>
                                  <div className="text-lg italic text-muted-foreground my-1">{word.es}</div>
                                  <ChevronDown className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                </div>
                                {/* Desktop layout */}
                                <div className="hidden md:flex flex-1 items-center w-full">
                                  <div className="flex-1 px-4 py-3 text-lg font-semibold">{word.de}</div>
                                  <div className="flex-1 px-4 py-3 text-lg italic text-muted-foreground border-l border-r">{word.es}</div>
                                  <div className="px-4 py-3">
                                      <Plus className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-45" />
                                  </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 bg-white text-base">
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                <DetailRow label="Wortart">
                                    <p className="font-semibold">{word.wortart}</p>
                                </DetailRow>
                                <DetailRow label="Pfeifer-Faktor™">
                                    <PfeiferRating rating={word.pfeiferFaktor} />
                                </DetailRow>
                                <DetailRow label="Anwendung">
                                    <p>{word.anwendung}</p>
                                </DetailRow>
                                <DetailRow label="Synonyme">
                                    <p className="italic">{word.synonyme}</p>
                                </DetailRow>
                                <div className="md:col-span-2">
                                     <DetailRow label="Beispielsatz">
                                        <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-0 text-lg">"{word.beispiel}"</blockquote>
                                    </DetailRow>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            {filteredVocabulary.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Search className="mx-auto h-12 w-12 mb-4"/>
                    <h3 className="text-xl font-semibold">Keine Ergebnisse</h3>
                    <p>Für Ihre Suche oder Filter wurde kein passendes Wort gefunden.</p>
                </div>
            )}
        <p className="text-xs text-center text-muted-foreground mt-8">*Haftungsausschluss: Die Autoren übernehmen keine Verantwortung für daraus resultierende soziale oder diplomatische Verwicklungen.</p>
        </div>
    </section>
  );
}
