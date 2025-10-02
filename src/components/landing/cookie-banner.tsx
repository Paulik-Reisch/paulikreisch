
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Cookie } from 'lucide-react';

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
    <div className="fixed bottom-4 left-4 z-50">
        <Popover open={showBanner} onOpenChange={setShowBanner}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="shadow-lg">
                    <Cookie className="mr-2 h-4 w-4"/>
                    Cookie-Einstellungen
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" side="top">
                 <div className="space-y-4">
                    <h3 className="font-bold font-headline text-lg">Die Verwendung von Cookies durch Eñje - DSGVO 2023</h3>
                    <p className="text-sm text-muted-foreground">
                        Wir (Das Unternehmen „Eñje" & die Betreiber dieser Webseite*) verwenden Cookies, um Benutzern die bestmögliche Nutzer-Erfahrung zu ermöglichen. Bitte lesen Sie unsere <Link href="/cookie-richtlinie" className="underline hover:text-primary font-semibold">Cookie-Richtlinie</Link>.
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={handleAccept} className="flex-1">Akzeptieren</Button>
                        <Button onClick={handleDecline} variant="secondary" className="flex-1">Ablehnen</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    </div>
  );
}
