'use client';

import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <p className="font-headline text-7xl font-bold tracking-tighter text-primary">404</p>
          <h1 className="mt-4 text-2xl font-bold font-headline tracking-tight">
            Seite nicht gefunden
          </h1>
          <p className="mt-3 text-muted-foreground">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
            Vielleicht findest du, was du suchst, auf der Startseite.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="h-4 w-4" />
                Zur Startseite
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
