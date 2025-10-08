
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, BedDouble, Heater, Wind, DoorOpen, KeyRound, Soup, BrickWall, Bug } from 'lucide-react';

const extras = [
  { id: 'heizung', label: 'intakte Heizung', price: 250, icon: Heater },
  { id: 'fenster', label: 'ganze Fenster (nicht nur Scherben)', price: 150, icon: Wind },
  { id: 'tuer', label: 'eigene Haustür', price: 100, icon: DoorOpen },
  { id: 'tuerschloss', label: 'funktionsfähiges Türschloss', price: 75, icon: KeyRound },
  { id: 'kueche', label: 'Küchenmitbenutzung (Mo-Di, 03-04 Uhr)', price: 200, icon: Soup },
  { id: 'waende', label: 'alle vier Wände vorhanden', price: 400, icon: BrickWall },
  { id: 'sauber', label: 'professionell von Kakerlaken befreit', price: 125, icon: Bug },
];

export function HeroMietenwahnsinn() {
  const baseRent = 1000;
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const totalRent = useMemo(() => {
    return selectedExtras.reduce((total, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return total + (extra ? extra.price : 0);
    }, baseRent);
  }, [selectedExtras, baseRent]);

  const handleCheckboxChange = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: 'hsl(var(--color-bg-light-orange))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Der Mietenwahnsinn ist real.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Finden Sie Ihr Traum-WG-Zimmer! 10 m², zentrale Lage neben dem Hauptbahnhof, unmöbliert. Ein echtes Schnäppchen.
            </p>
          </div>
        </div>
        <Card className="max-w-lg mx-auto mt-12 shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Home/> Mietpreis-Rechner</CardTitle>
            <CardDescription>Stellen Sie sich Ihr individuelles Luxuspaket zusammen.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
                <div className='space-y-4'>
                    <h3 className="font-semibold flex items-center gap-2"><BedDouble /> Grundmiete</h3>
                    <p className="text-2xl font-bold">1.000,- €</p>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold">Wählen Sie Ihre Luxus-Ausstattung:</h3>
                    <div className="space-y-3">
                    {extras.map(({ id, label, price, icon: Icon }) => (
                        <div key={id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Checkbox id={id} onCheckedChange={() => handleCheckboxChange(id)} />
                        <Label htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer w-full">
                            <Icon className="h-5 w-5 text-primary shrink-0"/>
                            <span className="flex-grow">{label}</span>
                            <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">+ {price} €</span>
                        </Label>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-4 border-t-2 border-dashed">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h3 className="text-xl font-bold font-headline mb-2 sm:mb-0">Gesamtmiete pro Monat:</h3>
                <p className="text-3xl font-bold font-mono text-primary">{new Intl.NumberFormat('de-DE').format(totalRent)},- €</p>
              </div>
              <div className="text-center mt-6">
                <Button size="lg">Mietvertrag jetzt unterschreiben</Button>
                <p className="text-xs text-muted-foreground mt-2">Ihre Seele wird als Kaution einbehalten.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">(Hinweis: Dies ist eine Simulation – die Buttons haben keine Funktion)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
