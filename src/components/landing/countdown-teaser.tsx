"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Zap } from 'lucide-react';

const calculateTimeLeft = (targetDate: number) => {
  const difference = targetDate - new Date().getTime();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      Tage: Math.floor(difference / (1000 * 60 * 60 * 24)),
      Stunden: Math.floor((difference / (1000 * 60 * 60)) % 24),
      Minuten: Math.floor((difference / 1000 / 60) % 60),
      Sekunden: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export function CountdownTeaser() {
    const initialDuration = (361 * 24 * 60 * 60 + 24 * 60 * 60 + 60 * 60 + 60) * 1000;
    const [targetDate, setTargetDate] = useState(new Date().getTime() + initialDuration);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
    const { toast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearTimeout(timer);
    });

    const reduceTime = () => {
        const timeReductions = [
            15 * 60 * 1000, // 15 Minuten
            60 * 60 * 1000, // 1 Stunde
            3 * 60 * 60 * 1000, // 3 Stunden
            4 * 24 * 60 * 60 * 1000, // 4 Tage
        ];
        const randomReduction = timeReductions[Math.floor(Math.random() * timeReductions.length)];
        setTargetDate(prev => prev - randomReduction);
        
        const days = Math.floor(randomReduction / (1000 * 60 * 60 * 24));
        const hours = Math.floor((randomReduction / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((randomReduction / (1000 * 60)) % 60);

        let reductionText = "";
        if (days > 0) reductionText = `${days} Tag(e)`;
        else if (hours > 0) reductionText = `${hours} Stunde(n)`;
        else if (minutes > 0) reductionText = `${minutes} Minute(n)`;

        toast({
            title: "Zeit gelöscht!",
            description: `Du hast den Autoren ${reductionText} Zeit geklaut! Weiter so!`,
        });
    };

    const handleShare = () => {
        const shareText = "Hilf mit, den Autoren von 'Hallo Welt' Feuer unterm Hintern zu machen! Jeder Klick verkürzt ihre Zeit für Teil 2. #HalloWelt2 #AutorenQuälen";
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
            title: "Kopiert!",
            description: "Der Text zum Teilen wurde in die Zwischenablage kopiert. Mobilisiere die Massen!",
        });
    }

  return (
    <section id="countdown-teaser" className="w-full py-20 md:py-32 lg:py-40" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl text-balance">
              Hallo Welt 2 braucht... noch etwas.
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                Die Autoren sind langsam. Sehr langsam. Hilf uns, ihnen Dampf zu machen und verkürze die Wartezeit auf das nächste Meisterwerk des literarischen Unsinns.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="p-4 bg-background rounded-lg shadow-md transform hover:scale-110 transition-transform">
                    <div className="text-5xl font-bold font-mono text-primary animate-pulse">{String(value).padStart(2, '0')}</div>
                    <div className="text-sm font-semibold text-muted-foreground">{unit}</div>
                </div>
            ))}
          </div>
          <div className='text-center space-y-4 pt-6'>
            <p className='font-semibold'>Mach den Autoren Philipp und Max Dampf unter den Ärschen und verkürze deren Zeit:</p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                 <Button size="lg" onClick={reduceTime}>
                    <Zap className="mr-2" />
                    Zeit löschen!
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2" />
                    Mehr Leute zum Quälen einladen
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
