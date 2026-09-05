"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
    // Ehrliche Scarcity: Monatsende 23:59 (wenn <48h übrig, nächsten Monat nehmen)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const diffHours = (endOfMonth.getTime() - now.getTime()) / (1000*60*60);
    if (diffHours < 48) {
        const next = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
        return next;
    }
    return endOfMonth;
};


export function CountdownBanner() {
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        // Run only on client
        setTargetDate(getTargetDate());
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const timer = setTimeout(() => {
            const newTimeLeft = calculateTimeLeft(targetDate);
            setTimeLeft(newTimeLeft);
            const currentSeconds = newTimeLeft.seconds;

            // Pulse every 5 seconds
            if (currentSeconds % 5 === 0 && currentSeconds !== 0) {
                setIsPulsing(true);
                setTimeout(() => setIsPulsing(false), 800); // duration of the pulse animation
            }

            // Blink every 10 seconds
            if (currentSeconds % 10 === 0 && currentSeconds !== 0) {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 700); // duration of the flash animation
            }

        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, targetDate]);

    if (!targetDate) {
        return null; // Or a loading skeleton
    }

    const format = (num: number) => String(num).padStart(2, '0');

    return (
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
             <h3 className="flex items-center justify-center gap-2 font-bold font-headline tracking-tighter text-2xl sm:text-3xl text-primary-foreground/90 text-balance whitespace-nowrap">
                Rabatt endet in:
            </h3>
            <div 
                className={cn(
                    "font-mono text-6xl md:text-8xl font-bold tracking-tighter transition-colors duration-500 text-yellow-300",
                    isBlinking && "text-red-400 animate-flash",
                    isPulsing && "animate-pulse-fast",
                )}
            >
                {format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}
            </div>
        </div>
    );
}
