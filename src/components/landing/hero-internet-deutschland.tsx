"use client";

import { WifiOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function HeroInternetDeutschland() {
  return (
    <section className="w-full flex items-center justify-center bg-background text-foreground py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
            <div className='relative'>
                <WifiOff className="h-24 w-24 text-destructive animate-pulse" />
            </div>
          <div className="space-y-4">
            <h1 className="font-headline text-8xl font-extrabold tracking-tighter text-destructive">404</h1>
            <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl text-balance">
              Seite nicht gefunden
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
              Willkommen im deutschen Internet. Entweder existiert diese Seite nicht, oder das Neuland-Netz hat mal wieder Schluckauf. Beides ist gleich wahrscheinlich.
            </p>
          </div>
           <Link href="/">
              <Button variant="secondary">Zurück zur Zivilisation</Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
