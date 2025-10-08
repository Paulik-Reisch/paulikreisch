
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

export function HeroInternetDeutschland() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) {
          return '';
        }
        return prev + '.';
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex items-center justify-center bg-background text-foreground py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 delay-500">
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
            >
                <WifiOff className="h-24 w-24 text-destructive/50 mx-auto" />
            </motion.div>
            <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl text-balance">
              Verbindung wird hergestellt <span className="w-4 inline-block">{dots}</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Bitte warten Sie einen Moment. Oder zwei. Oder auch bis ins nächste Jahrhundert.
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
