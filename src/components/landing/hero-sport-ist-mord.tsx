
"use client";

import { useState } from "react";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroSportIstMord() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleReveal = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setIsRevealed(true);
    }, 300); // Duration of the glitch animation
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" style={{backgroundColor: 'hsl(var(--color-bg-tan))'}}>
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
            <AnimatePresence mode="wait">
              {isRevealed ? (
                 <motion.div
                    key="revealed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-sm">Fitness-Hölle</div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">Sport ist Mord.</h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        Willkommen in der Sporthalle: Ein Ort voller Schweiß, Tränen und gelegentlicher Knochenbrüche. Entdecken Sie, warum Völkerball mehr mit Krieg zu tun hat als mit Sport.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row pt-2">
                       <Link href="/buchhandlung-paulik-reisch">
                         <Button size="lg">Trainingsplan für Desaster anfordern</Button>
                       </Link>
                    </div>
                 </motion.div>
              ) : (
                <motion.div
                  key="initial"
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h1 className={`font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl ${isGlitching ? 'animate-glitch text-destructive' : ''}`}>
                    Dein Körper kann alles schaffen!
                  </h1>
                   <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        Entfessle dein wahres Potenzial. Jeder Schweißtropfen bringt dich deinem Ziel näher. Bist du bereit?
                    </p>
                  <Button size="lg" onClick={handleReveal} disabled={isGlitching}>
                    Starte dein Training
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
            <div className="relative">
                <Image
                    alt="Fitness-Werbeplakat mit Knochenbrüchen"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-contain sm:w-full"
                    data-ai-hint="fitness poster parody"
                    height="550"
                    src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/sport.png?alt=media&token=81c3dfa8-3b76-4b30-a0d3-96ff219145ce"
                    width="550"
                />
                 <AnimatePresence>
                  {isRevealed && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                      className="absolute bottom-7 right-4 bg-destructive text-destructive-foreground p-2 rounded-md transform -rotate-6 font-bold shadow-lg"
                    >
                      Jetzt mit noch mehr Genickbrüchen!
                    </motion.p>
                  )}
                 </AnimatePresence>
            </div>
        </div>
    </section>
  );
}
