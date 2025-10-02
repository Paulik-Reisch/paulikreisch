"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';

const calculateTimeLeft = (target: Date) => {
    const difference = +target - +new Date();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};

const getRandomMinute = () => {
    const minutes = [47, 37, 27, 17, 7];
    return minutes[Math.floor(Math.random() * minutes.length)];
}

const getTargetDate = () => {
    const now = new Date();
    // Move 6 hours into the future
    const target = new Date(now.getTime() + 6 * 60 * 60 * 1000);

    // Ensure the hour is odd
    if (target.getHours() % 2 === 0) {
        target.setHours(target.getHours() + 1);
    }

    target.setMinutes(getRandomMinute());
    target.setSeconds(0);
    return target;
};


export function CountdownBanner() {
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isPulsing, setIsPulsing] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        // Run only on client
        setTargetDate(getTargetDate());
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const timer = setTimeout(() => {
            const newTimeLeft = calculateTimeLeft(targetDate);
            setTimeLeft(newTimeLeft);

            // Pulse every 10 seconds
            if (newTimeLeft.seconds % 10 === 0) {
                setIsPulsing(true);
                setTimeout(() => setIsPulsing(false), 500);
            }
            
            // Blink every minute
            if (newTimeLeft.seconds === 0) {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 1000);
            }

        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, targetDate]);

    if (!targetDate) {
        return null; // Or a loading skeleton
    }

    const format = (num: number) => String(num).padStart(2, '0');

    return (
        <section id="countdown-banner" className="w-full py-6 md:py-8 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <h3 className="font-bold font-headline tracking-tighter text-2xl sm:text-3xl flex items-center gap-2">
                        <Timer className="h-6 w-6 text-primary"/>
                        Verbleibende Angebotszeit:
                    </h3>
                    <div 
                        className={cn(
                            "font-mono text-5xl md:text-6xl font-bold tracking-tighter transition-all duration-500 text-yellow-500",
                            isPulsing && "scale-110",
                            isBlinking && "text-red-500 animate-ping"
                        )}
                    >
                        {format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}
                    </div>
                </div>
            </div>
        </section>
    );
}
