"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ASCII Art for 404
const asciiArtLines = [
  "  ▒▒▒▒▒     █████     ▒▒▒▒▒  ",
  " ▒▒   ▒▒   ██   ██   ▒▒   ▒▒ ",
  " ▒▒   ▒▒   ██   ██   ▒▒   ▒▒ ",
  " ▒▒   ▒▒   ██   ██   ▒▒   ▒▒ ",
  " ▒▒▒▒▒▒▒   ███████   ▒▒▒▒▒▒▒ ",
  "      ▒▒        ██        ▒▒ ",
  "      ▒▒        ██        ▒▒ ",
  "      ▒▒   ██   ██        ▒▒ ",
  "      ▒▒    █████         ▒▒ ",
];

// Characters that will be used for the glitch effect
const glitchChars = ['▓', '▒', '░', '█', ' '];

const GlitchyAsciiArt = () => {
    const [lines, setLines] = useState(asciiArtLines);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLines(currentLines =>
                currentLines.map(line =>
                    line.split('').map(char =>
                        Math.random() < 0.005 // 0.5% chance to glitch
                            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
                            : char
                    ).join('')
                )
            );
        }, 100); // Update every 100ms for a flicker effect

        return () => clearInterval(intervalId);
    }, []);

    return (
        <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-destructive font-mono text-[8px] sm:text-[10px] md:text-xs leading-tight sm:leading-tight md:leading-tight text-center select-none"
        >
            {lines.join('\n')}
        </motion.pre>
    );
};


export function HeroInternetDeutschland() {
  return (
    <section className="w-full flex items-center justify-center bg-background text-foreground py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
            
            <GlitchyAsciiArt />
            
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 delay-500">
            <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl text-balance">
              Seite nicht gefunden
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Willkommen im deutschen Internet. Entweder existiert diese Seite nicht, oder das Neuland-Netz hat mal wieder Schluckauf. Beides ist gleich wahrscheinlich.
            </p>
          </div>
           <Link href="/" className="animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 delay-500">
              <Button variant="secondary">Zurück zur Zivilisation</Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
