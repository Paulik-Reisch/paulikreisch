
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Printer, Upload, Send, FilePlus, FileMinus } from 'lucide-react';

export function HeroBuerokratieSimulator() {
  const { toast } = useToast();

  const handleDisabledClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      variant: "destructive",
      title: "Antrag in Bearbeitung",
      description: "Dieser Service befindet sich in planmäßiger Wartung. Geschätzte Bearbeitungszeit: 12 Jahre. Bitte sehen Sie von weiteren Klicks ab.",
    });
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
              Willkommen im Bürokratie-Simulator
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Füllen Sie den Antrag auf Beantragung eines Antragsformulars aus. Einfach, digital und effizient.
            </p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-12 p-8 border-4 border-dashed border-gray-400 bg-gray-50 rounded-lg">
            <form className="space-y-6">
                <h2 className="text-xl font-semibold font-headline">Antrag A-38 (Passierschein)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Name, Vorname (in Blockbuchstaben)</Label>
                        <Input id='name' placeholder='Mustermann, Max' disabled/>
                    </div>
                     <div className='space-y-2'>
                        <Label htmlFor='antragsgrund'>Grund des Antrags (max. 3 Wörter)</Label>
                        <Input id='antragsgrund' placeholder='Weil es so ist' disabled/>
                    </div>
                </div>
                 <div className='space-y-2'>
                    <Label>Zusätzliche Anlagen (bitte ankreuzen, was nicht zutrifft)</Label>
                    <div className='space-y-2 pl-2'>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="anlage1" disabled defaultChecked/>
                            <label htmlFor="anlage1" className="text-sm text-gray-500">Geburtsurkunde der Urgroßmutter</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="anlage2" disabled defaultChecked/>
                            <label htmlFor="anlage2" className="text-sm text-gray-500">Nachweis über nicht vorhandene Haustiere</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="anlage3" disabled/>
                            <label htmlFor="anlage3" className="text-sm text-gray-500">Einverständniserklärung des Internets</label>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-4">
                    <Button onClick={handleDisabledClick}><Send className="mr-2"/>Abschicken</Button>
                    <Button onClick={handleDisabledClick}><Printer className="mr-2"/>Drucken</Button>
                    <Button onClick={handleDisabledClick}><Upload className="mr-2"/>Hochladen</Button>
                    <Button onClick={handleDisabledClick}><FilePlus className="mr-2 h-6 w-6"/>Speichern</Button>
                    <Button onClick={handleDisabledClick} variant="destructive"><FileMinus className="mr-2"/>Löschen</Button>
                </div>
                 <p className="text-xs text-muted-foreground pt-4">Hinweis: Keiner dieser Buttons hat eine Funktion. Dies ist eine Simulation!</p>
            </form>
        </div>
      </div>
    </section>
  );
}
