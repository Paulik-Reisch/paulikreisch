

"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCountdownTarget } from '@/lib/firestore';
import { reduceCountdownAction } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';

const calculateTimeLeft = (targetDate: Date) => {
  const difference = targetDate.getTime() - new Date().getTime();
  let timeLeft = { Tage: 0, Stunden: 0, Minuten: 0, Sekunden: 0 };

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
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
    const [isShaking, setIsShaking] = useState(false);
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getCountdownTarget().then(setTargetDate);
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, targetDate]);

    const reduceTime = () => {
        startTransition(async () => {
            const previousTime = targetDate ? targetDate.getTime() : 0;
            const result = await reduceCountdownAction();
            
            if ("newTargetDate" in result) {
                const newDate = new Date(result.newTargetDate);
                setTargetDate(newDate);

                const timeDiff = previousTime - newDate.getTime();
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

                let reductionText = "";
                if (days > 0) reductionText = `${days} Tag(e)`;
                else if (hours > 0) reductionText = `${hours} Stunde(n)`;
                else if (minutes > 0) reductionText = `${minutes} Minute(n)`;

                toast({
                    title: "Zeit gelöscht!",
                    description: `Sie haben den Autoren ${reductionText} Zeit geklaut! Weiter so!`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Fehler",
                    description: result.error,
                });
            }
        });
        
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
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

  if (!targetDate) {
    return (
         <section id="countdown-teaser" className="w-full py-20 md:py-32 lg:py-40" style={{ backgroundColor: 'hsl(var(--color-bg-light-pink))' }}>
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {['Tage', 'Stunden', 'Minuten', 'Sekunden'].map(unit => (
                            <div key={unit} className="p-4 bg-background rounded-lg shadow-md">
                                <Skeleton className="h-12 w-20 mx-auto mb-2" />
                                <Skeleton className="h-4 w-16 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
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
                    <div className={cn("text-4xl sm:text-5xl font-bold font-mono text-primary", { 'animate-shake': isShaking })}>{String(value).padStart(2, '0')}</div>
                    <div className="text-sm font-semibold text-muted-foreground">{unit}</div>
                </div>
            ))}
          </div>
          <div className='text-center space-y-4 pt-6'>
            <p className='font-semibold'>Machen Sie den Autoren Philipp und Max Dampf unter den Ärschen:</p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                 <Button size="lg" onClick={reduceTime} disabled={isPending}>
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
