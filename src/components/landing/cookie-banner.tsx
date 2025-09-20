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
            "fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t shadow-lg animate-in slide-in-from-bottom-5",
            !showBanner && "animate-out slide-out-to-bottom-5"
        )}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
           <Cookie className="h-8 w-8 text-primary shrink-0 mt-1" />
           <p className="text-sm text-muted-foreground text-balance">
            Ja, auch wir brauchen dieses nervige Banner. Wir verwenden Cookies, um sicherzustellen, dass Sie dieses Banner nicht ständig sehen. Indem Sie auf "Akzeptieren" klicken, stimmen Sie der Speicherung eines rein funktionalen Cookies zu. Mehr dazu in unserer
            <Link href="/cookie-richtlinie" className="underline hover:text-primary"> Cookie-Richtlinie </Link> und 
            <Link href="/datenschutz" className="underline hover:text-primary"> Datenschutzerklärung</Link>.
           </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={handleAccept}>Akzeptieren</Button>
          <Button variant="outline" onClick={handleDecline}>Ablehnen</Button>
        </div>
      </div>
    </div>
  );
}
