
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Cookie } from 'lucide-react';

const COOKIE_NAME = 'hallowelt_cookie_consent';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    const consent = localStorage.getItem(COOKIE_NAME);
    if (consent === null) {
      setShowBanner(true);
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
    <div 
        className={cn(
            "fixed bottom-4 left-4 z-50 w-full max-w-sm p-4 bg-card border shadow-lg rounded-lg animate-in slide-in-from-bottom-5",
            !showBanner && "animate-out slide-out-to-bottom-5"
        )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
           <Cookie className="h-6 w-6 text-primary shrink-0 mt-1" />
           <div>
            <h3 className="font-semibold font-headline">Cookies? Leider ja.</h3>
            <p className="text-sm text-muted-foreground text-balance">
                Wir nutzen ein rein funktionales Cookie, um uns Ihre Zustimmung zu merken. Mehr Infos in unserer <Link href="/cookie-richtlinie" className="underline hover:text-primary">Cookie-Richtlinie</Link>.
            </p>
           </div>
        </div>
        <div className="flex gap-2 shrink-0 justify-end">
          <Button size="sm" onClick={handleAccept}>Akzeptieren</Button>
          <Button size="sm" variant="outline" onClick={handleDecline}>Ablehnen</Button>
        </div>
      </div>
    </div>
  );
}
