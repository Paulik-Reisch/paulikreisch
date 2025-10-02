
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  
  return (
    <AlertDialog open={showBanner}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl">
            Die Verwendung von Cookies durch Eñje - DSGVO 2023
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground pt-4 space-y-4">
            <p>
              Wir (Das Unternehmen „Eñje" & die Betreiber dieser Webseite*) verwenden Cookies, um Benutzern die bestmögliche Nutzer-Erfahrung zu ermöglichen. Dabei wird § 23 (Art. 23) der DSGVO für Deutschland berücksichtigt.
            </p>
            <p>
              Bitte lesen Sie unsere <Link href="/cookie-richtlinie" className="underline hover:text-primary font-semibold">Cookie-Richtlinie</Link>, um die genaue Verwendung unserer Cookies zu erfahren.
            </p>
            <p>
              Mit dem Klicken auf „Cookies akzeptieren" werden die Cookies von Ihnen vollumfänglich genehmigt. Das Widerrufen der Cookies ist <Link href="/impressum" className="underline hover:text-primary font-semibold">hier</Link> möglich. Bitte beachten Sie, dass das Ablehnen von Cookies möglicherweise die Funktionalität dieser Webseite beeinträchtigt.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <AlertDialogAction onClick={handleAccept} className="w-full h-12 text-lg">
            Cookies akzeptieren
          </AlertDialogAction>
          <AlertDialogCancel onClick={handleDecline} className="w-full h-12 text-lg">
            Cookies ablehnen
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
