
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

const COOKIE_NAME = 'hallowelt_cookie_consent';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    const consent = localStorage.getItem(COOKIE_NAME);
    if (consent === null) {
      // Use a timeout to avoid hydration errors and layout shifts
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_NAME, 'true');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_NAME, 'false');
    setShowBanner(false);
  };

  if (!showBanner) {
      return null;
  }

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4">
        <Card className="w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-5 p-4">
            <div className="md:flex md:items-center md:gap-6">
                <div className="flex-grow">
                    <h3 className="font-bold font-headline text-base">Wir benutzen Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Wir verwenden nutzlose, aber technisch notwendige Cookies, um Ihr Erlebnis zu verbessern. Lesen Sie unsere <Link href="/cookie-richtlinie" className="underline hover:text-primary">Cookie-Richtlinie</Link>.
                    </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 shrink-0">
                    <Button onClick={handleDecline} variant="ghost" className="flex-1 md:flex-none">Nur notwendige</Button>
                    <Button onClick={handleAccept} className="flex-1 md:flex-none">Akzeptieren</Button>
                </div>
            </div>
        </Card>
    </div>
  );
}
