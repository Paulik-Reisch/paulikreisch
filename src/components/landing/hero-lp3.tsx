"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const ConfettiPiece = ({ emoji }: { emoji: string }) => {
  const style = {
    position: 'absolute',
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * -50}vh`,
    fontSize: `${Math.random() * 2 + 1}rem`,
    animation: `fall ${Math.random() * 3 + 4}s linear forwards`,
    animationDelay: `${Math.random() * 2}s`,
  } as React.CSSProperties;

  return <div style={style}>{emoji}</div>;
};


export function HeroLP3() {
  const [countdown, setCountdown] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const emojis = ['📖', '😂', '🔥', '✒️', '🤯', '💥'];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowConfetti(true);
    }
  }, [countdown]);

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
        {showConfetti && Array.from({ length: 100 }).map((_, i) => <ConfettiPiece key={i} emoji={emojis[i % emojis.length]} />)}
         <style jsx>{`
            @keyframes fall {
                to {
                    transform: translateY(150vh) rotate(360deg);
                }
            }
        `}</style>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
            {countdown > 0 ? (
                 <div className="space-y-4">
                    <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-7xl xl:text-9xl/none text-balance animate-in fade-in zoom-in-50 duration-1000">
                        {countdown}
                    </h1>
                 </div>
            ) : (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-24 duration-1000 delay-500">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl xl:text-8xl/none text-balance">
                        Das Buch ist ÖFFENTLICH!
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Worauf warten Sie noch?
                    </p>
                     <Link href="/buchhandlung-paulik-reisch">
                        <Button size="lg" className="animate-pulse">Jetzt zuschlagen!</Button>
                    </Link>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
