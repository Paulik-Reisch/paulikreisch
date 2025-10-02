
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
            <h3 className="font-bold font-headline tracking-tighter text-2xl sm:text-3xl flex items-center gap-2 text-primary-foreground/90">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-6 w-6">
                    <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" />
                    <rect width="2" height="7" x="11" y="6" fill="currentColor" rx="1">
                        <animateTransform attributeName="transform" dur="19s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
                    </rect>
                    <rect width="2" height="9" x="11" y="11" fill="currentColor" rx="1">
                        <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
                    </rect>
                </svg>
                Verbleibende Angebotszeit:
            </h3>
            <div 
                className={cn(
                    "font-mono text-5xl md:text-6xl font-bold tracking-tighter transition-colors duration-500 text-yellow-300",
                    isBlinking && "text-red-400 animate-flash",
                    isPulsing && "animate-pulse-fast",
                )}
            >
                {format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}
            </div>
        </div>
    );
}
