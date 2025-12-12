
"use client";

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, Loader2, DoorClosed, Armchair, Coffee } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const initialMessages = [
    "Ihr Anliegen wird bearbeitet.",
    "Bitte haben Sie einen Augenblick Geduld.",
    "Der zuständige Sachbearbeiter macht gerade Kaffeepause.",
    "Das System wird gerade neugestartet.",
    "Bitte warten ...",
];

const absurdInstructions = [
    "Bitte begeben Sie sich zu Zimmer 42a, Korridor B, Untergeschoss 3.",
    "Setzen Sie sich auf Stuhl 7, Reihe C, Wartebereich 'Hoffnungslos'.",
    "Ihr Ticket wurde storniert. Bitte ziehen Sie ein neues.",
    "Füllen Sie bitte Formular A-38 aus. Sie finden es in Zimmer -1.",
    "Der Aufzug ist außer Betrieb. Bitte nutzen Sie die Treppe.",
    "Atmen ist bis auf Weiteres nur mit schriftlicher Genehmigung gestattet.",
    "Ihr Sachbearbeiter wurde versetzt. Auf einen anderen Planeten.",
];

export function HeroBeamtenWartezeitenSimulator() {
    const [ticketNumber, setTicketNumber] = useState<number | null>(null);
    const [currentMessage, setCurrentMessage] = useState("Bitte ziehen Sie eine Wartenummer.");
    const [instruction, setInstruction] = useState<string | null>(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (ticketNumber === null) return;

        let messageInterval: NodeJS.Timeout;
        let instructionTimeout: NodeJS.Timeout;

        const showRandomMessage = () => {
            setCurrentMessage(initialMessages[Math.floor(Math.random() * initialMessages.length)]);
            setKey(prev => prev + 1); // trigger animation
        };
        
        const showRandomInstruction = () => {
            setInstruction(absurdInstructions[Math.floor(Math.random() * absurdInstructions.length)]);
            setKey(prev => prev + 1); // trigger animation
        }

        messageInterval = setInterval(showRandomMessage, 4000);
        instructionTimeout = setInterval(showRandomInstruction, 9000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(instructionTimeout);
        };

    }, [ticketNumber]);

    const handleTakeTicket = () => {
        const newTicket = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        setTicketNumber(newTicket);
        setCurrentMessage("Ihr Anliegen ist uns wichtig. Ihre Wartenummer lautet:");
        setInstruction("Bitte warten Sie, bis Ihre Nummer aufgerufen wird.");
    };

    const icons = [DoorClosed, Armchair, Coffee, Loader2];

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-6 text-center">
                     <Badge variant="destructive">Hallo Welt 2</Badge>
                    <div className="space-y-4">
                        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
                           Der Beamten-Wartezeiten-Simulator
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
                          Erleben Sie die beruhigende Monotonie und die kafkaeske Effizienz einer deutschen Behörde, ohne Ihr Zuhause verlassen zu müssen.
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl mx-auto mt-12 shadow-2xl bg-gray-200 dark:bg-gray-700 border-4 border-gray-400">
                    <CardContent className="p-8 text-center">
                        {ticketNumber === null ? (
                            <div className="flex flex-col items-center gap-6">
                               <p className="text-2xl font-semibold">{currentMessage}</p>
                                <Button size="lg" onClick={handleTakeTicket} className="h-24 w-64 text-2xl">
                                    <Ticket className="mr-4 h-12 w-12" /> Wartenummer ziehen
                                </Button>
                            </div>
                        ) : (
                            <div className='space-y-6'>
                                <p className="text-xl font-semibold">{currentMessage}</p>
                                <div key={key} className={cn("text-6xl font-mono font-bold text-primary animate-in fade-in zoom-in-50")}>
                                    {ticketNumber}
                                </div>
                                <div className='h-24'>
                                    {instruction && (
                                        <div key={key + 1} className="flex items-center justify-center gap-4 text-xl font-semibold text-destructive animate-in fade-in slide-in-from-bottom-5">
                                            {React.createElement(icons[Math.floor(Math.random()*icons.length)], { className: "h-8 w-8 shrink-0" })}
                                            <p className='text-balance'>{instruction}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <div className='text-center mt-8'>
                     <Link href="/buchhandlung-paulik-reisch">
                        <Button variant="secondary" size="lg">Im Buch geht es schneller.</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
