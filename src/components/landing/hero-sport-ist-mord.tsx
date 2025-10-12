
"use client";

import { useState } from "react";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

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
    <section className={cn("w-full py-20 md:py-32 lg:py-40 transition-colors duration-500", isRevealed ? "bg-red-900 text-gray-50" : "bg-green-500 text-white")}>
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <AnimatePresence mode="wait">
              {isRevealed ? (
                 <motion.div
                    key="revealed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-6"
                  >
                    <div className="inline-block rounded-lg bg-destructive text-destructive-foreground px-3 py-1 text-sm">Fitness-Hölle</div>
                    <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-headline text-yellow-300">Sport ist Mord.</h1>
                    <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed">
                        Willkommen in der Sporthalle: Ein Ort voller Schweiß, Tränen und gelegentlicher Knochenbrüche. Entdecken Sie, warum Völkerball mehr mit Krieg zu tun hat als mit Sport.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row pt-3 justify-center">
                       <Link href="/buchhandlung-paulik-reisch">
                         <Button size="lg" variant="destructive">Berichte aus dem Sportunterricht ansehen</Button>
                       </Link>
                    </div>
                 </motion.div>
              ) : (
                <motion.div
                  key="initial"
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                    <div className="mx-auto h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
                        <Zap className="h-12 w-12 text-white"/>
                    </div>
                  <h1 className={`font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl ${isGlitching ? 'animate-glitch text-red-500' : ''}`}>
                    Dein Körper kann alles schaffen!
                  </h1>
                   <p className="mx-auto max-w-[600px] text-white/80 md:text-xl/relaxed">
                        Entfessle dein wahres Potenzial. Jeder Schweißtropfen bringt dich deinem Ziel näher. Bist du bereit?
                    </p>
                  <Button size="lg" onClick={handleReveal} disabled={isGlitching} variant="secondary">
                    Starte dein Training
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
        </div>
    </section>
  );
}
