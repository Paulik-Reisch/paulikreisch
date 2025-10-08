"use client";

import { HeroInternetDeutschland } from '@/components/landing/hero-internet-deutschland';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <main className="flex-1 flex items-center justify-center">
        <HeroInternetDeutschland />
      </main>
    </div>
  );
}
