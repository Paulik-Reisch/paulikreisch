
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

const COOKIE_NAME = 'hallowelt_cookie_consent';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
        <Card className={cn(
            "group w-full max-w-sm md:max-w-md lg:max-w-xl shadow-2xl transition-all duration-300 ease-in-out md:hover:max-w-2xl animate-in slide-in-from-bottom-5 p-3",
             isExpanded && "max-w-2xl"
            )}>
            <div className={cn("flex items-center transition-opacity duration-300", "md:group-hover:opacity-0 md:group-hover:h-0", isExpanded && "opacity-0 h-0")}>
                <p className="text-sm text-muted-foreground mr-auto pl-3">
                   Wir benutzen Cookies.{' '}
                   <button onClick={() => setIsExpanded(true)} className="underline font-semibold hover:text-primary md:hidden">
                     Mehr erfahren
                   </button>
                </p>
                <Button onClick={handleAccept} size="sm" className="shrink-0">Okay</Button>
            </div>
            <div className={cn("space-y-4 transition-all duration-300 ease-in-out h-0 opacity-0 overflow-hidden", "md:group-hover:h-auto md:group-hover:opacity-100 md:group-hover:mt-0", isExpanded && "h-auto opacity-100 mt-0")}>
                <h3 className="font-bold font-headline text-lg">Die Verwendung von Cookies durch Hallo Welt</h3>
                <p className="text-sm text-muted-foreground">
                    Wir verwenden Cookies, um Benutzern die bestmögliche Nutzer-Erfahrung zu ermöglichen. Bitte lesen Sie unsere <Link href="/cookie-richtlinie" className="underline hover:text-primary font-semibold">Cookie-Richtlinie</Link>. Indem Sie akzeptieren, stimmen Sie der Speicherung von absolut nutzlosen, aber technisch notwendigen Cookies auf Ihrem Gerät zu.
                </p>
                <div className="flex gap-2 justify-end pt-2">
                    <Button onClick={handleDecline} variant="ghost" className="flex-1 sm:flex-none">Ablehnen</Button>
                    <Button onClick={handleAccept} className="flex-1 sm:flex-none">Akzeptieren</Button>
                </div>
            </div>
        </Card>
    </div>
  );
}
