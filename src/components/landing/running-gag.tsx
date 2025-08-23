"use client";

import { useState, useEffect } from 'react';

const gags = [
    "*Nicht wirklich ein Bestseller.",
    "†Kann Spuren von Sarkasmus enthalten.",
    "‡Ergebnisse können variieren.",
    "§Nebenwirkungen können spontanes Lachen beinhalten.",
    "¶Batterien nicht enthalten.",
    "※ Professioneller Fahrer auf einer geschlossenen Strecke.",
    "‖ Nur zu Unterhaltungszwecken."
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
            }, 4000); // Gag ist für 4 Sekunden sichtbar
        };

        const interval = setInterval(() => {
            showGag();
        }, 8000); // Neuer Gag alle 8 Sekunden

        // Zeige einen beim ersten Laden nach einer kleinen Verzögerung
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
