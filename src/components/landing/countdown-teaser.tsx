
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  } else {
    timeLeft = {
        Tage: 0,
        Stunden: 0,
        Minuten: 0,
        Sekunden: 0,
    }
  }

  return timeLeft;
};

export function CountdownTeaser() {
    const initialDuration = (361 * 24 * 60 * 60 + 24 * 60 * 60 + 60 * 60 + 60) * 1000;
    const [targetDate, setTargetDate] = useState(new Date().getTime() + initialDuration);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
    const [isShaking, setIsShaking] = useState(false);
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
        
        setIsShaking(true);
        setTimeout(() => {
            setTargetDate(prev => prev - randomReduction);
            setIsShaking(false);
        }, 500); // Dauer der Animation

        
        const days = Math.floor(randomReduction / (1000 * 60 * 60 * 24));
        const hours = Math.floor((randomReduction / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((randomReduction / (1000 * 60)) % 60);

        let reductionText = "";
        if (days > 0) reductionText = `${days} Tag(e)`;
        else if (hours > 0) reductionText = `${hours} Stunde(n)`;
        else if (minutes > 0) reductionText = `${minutes} Minute(n)`;

        toast({
            title: "Zeit gelöscht!",
            description: `Sie haben den Autoren ${reductionText} Zeit geklaut! Weiter so!`,
        });
    };

    const handleShare = () => {
        const shareText = "Helfen Sie mit, den Autoren von 'Hallo Welt' Feuer unterm Hintern zu machen! Jeder Klick verkürzt die Wartezeit auf Teil 2. #HalloWelt2 #AutorenQuälen";
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
            title: "Kopiert!",
            description: "Der Text zum Teilen wurde in die Zwischenablage kopiert.",
        });
    }

  return (
    <section id="countdown-teaser" className="w-full py-20 md:py-32 lg:py-40" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
      <div className="container px-4 md:px-6 animate-in fade-in-0 slide-in-from-top-12 duration-1000">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl text-balance">
              Hallo Welt 2 braucht ... noch etwas.
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-balance">
                Die Autoren sind langsam. Helfen Sie uns, ihnen Dampf zu machen und so die Wartezeit auf das nächste Meisterwerk des literarischen Unsinns zu verkürzen.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="p-4 bg-background rounded-lg shadow-md transform hover:scale-110 transition-transform">
                    <div className={cn("text-4xl sm:text-5xl font-bold font-mono text-primary animate-pulse", { 'animate-shake': isShaking })}>{String(value).padStart(2, '0')}</div>
                    <div className="text-sm font-semibold text-muted-foreground">{unit}</div>
                </div>
            ))}
          </div>
          <div className='text-center space-y-4 pt-6'>
            <p className='font-semibold'>Machen Sie den Autoren Philipp und Max Dampf unter den Ärschen:</p>
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
