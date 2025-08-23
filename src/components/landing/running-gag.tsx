"use client";

import { useState, useEffect } from 'react';

const gags = [
    "*Not actually a bestseller.",
    "†May contain traces of sarcasm.",
    "‡Results may vary.",
    "§Side effects include spontaneous laughter.",
    "¶Batteries not included.",
    "※ Professional driver on a closed course.",
    "‖ For entertainment purposes only."
];

export function RunningGagFootnote() {
    const [gag, setGag] = useState<{ text: string; x: number; y: number; key: number } | null>(null);

    useEffect(() => {
        let gagTimeout: NodeJS.Timeout;

        const showGag = () => {
            const newGag = {
                text: gags[Math.floor(Math.random() * gags.length)],
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                key: Date.now(),
            };
            setGag(newGag);

            gagTimeout = setTimeout(() => {
                setGag(null);
            }, 4000); // Gag is visible for 4 seconds
        };

        const interval = setInterval(() => {
            showGag();
        }, 8000); // New gag every 8 seconds

        // show one on first load after a small delay
        const initialTimeout = setTimeout(showGag, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(gagTimeout);
            clearTimeout(initialTimeout);
        };
    }, []);

    if (!gag) return null;

    return (
        <div
            key={gag.key}
            className="fixed z-50 p-2 text-xs rounded-md shadow-lg bg-card text-card-foreground animate-in fade-in zoom-in-95"
            style={{ 
                left: `${gag.x}vw`, 
                top: `${gag.y}vh`, 
                transform: `rotate(${Math.random() * 10 - 5}deg)` 
            }}
        >
            {gag.text}
        </div>
    );
}
