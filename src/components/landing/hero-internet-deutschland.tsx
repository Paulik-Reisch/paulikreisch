"use client";

import { WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HeroInternetDeutschland() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
            <div className='relative'>
                <WifiOff className="h-24 w-24 text-destructive" />
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 dark:bg-gray-900 animate-pulse" style={{ animationDuration: '3s'}}></div>
            </div>
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance">
              Verbindung wird hergestellt{dots}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Willkommen im deutschen Internet. Bitte warten Sie einen Moment. Oder zwei. Oder bis zum nächsten Jahrzehnt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
