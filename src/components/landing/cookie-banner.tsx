"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

const COOKIE_NAME = 'hallowelt_cookie_consent';

type ConsentValue = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const initialConsent: ConsentValue = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [view, setView] = useState<'main' | 'settings'>('main');
  const [consent, setConsent] = useState<ConsentValue>(initialConsent);

  useEffect(() => {
    // Check localStorage only on the client side
    const storedConsent = localStorage.getItem(COOKIE_NAME);
    if (storedConsent === null) {
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (value: 'all' | 'necessary' | ConsentValue) => {
    const consentValue = typeof value === 'string' 
      ? { necessary: true, analytics: value === 'all', marketing: value === 'all' }
      : value;
    
    localStorage.setItem(COOKIE_NAME, JSON.stringify(consentValue));
    setShowBanner(false);
    // Here you would typically initialize analytics scripts based on consentValue.analytics, etc.
  };

  const handleToggle = (category: keyof Omit<ConsentValue, 'necessary'>) => {
    setConsent(prev => ({ ...prev, [category]: !prev[category] }));
  };
  
  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 flex justify-center">
      <Card className="w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-5">
        {view === 'main' ? (
          <div className="p-6">
            <h3 className="font-bold font-headline text-lg">Wir schätzen Ihre Privatsphäre</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Wir verwenden Cookies und ähnliche Technologien, um das Nutzererlebnis zu verbessern. Einige sind für den Betrieb der Seite notwendig, andere helfen uns, zu verstehen, wie Sie die Seite nutzen. Bitte treffen Sie Ihre Auswahl. Ihre Einwilligung können Sie jederzeit widerrufen. Mehr dazu in unserer{' '}
              <Link href="/datenschutz" className="underline hover:text-primary">Datenschutzerklärung</Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button onClick={() => handleConsent('all')} className="flex-1">Alle akzeptieren</Button>
              <Button onClick={() => handleConsent('necessary')} variant="outline" className="flex-1">Nur notwendige</Button>
              <Button onClick={() => setView('settings')} variant="ghost" className="flex-1">Einstellungen</Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <button onClick={() => setView('main')} className="flex items-center text-sm font-semibold mb-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </button>
            <h3 className="font-bold font-headline text-lg">Cookie-Einstellungen</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Verwalten Sie hier Ihre individuellen Cookie-Präferenzen. Notwendige Cookies können nicht deaktiviert werden.
            </p>
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="necessary" className="font-bold">Notwendig</Label>
                  <p className="text-xs text-muted-foreground">Diese Cookies sind für die Grundfunktionen der Website erforderlich.</p>
                </div>
                <Switch id="necessary" checked disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg">
                <div>
                  <Label htmlFor="analytics" className="font-bold">Analyse</Label>
                  <p className="text-xs text-muted-foreground">Helfen uns zu verstehen, wie Besucher die Website nutzen.</p>
                </div>
                <Switch id="analytics" checked={consent.analytics} onCheckedChange={() => handleToggle('analytics')} />
              </div>
               <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg">
                <div>
                  <Label htmlFor="marketing" className="font-bold">Marketing</Label>
                  <p className="text-xs text-muted-foreground">Werden verwendet, um Ihnen relevante Werbung anzuzeigen.</p>
                </div>
                <Switch id="marketing" checked={consent.marketing} onCheckedChange={() => handleToggle('marketing')} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button onClick={() => handleConsent(consent)} className="flex-1">Auswahl speichern</Button>
                <Button onClick={() => handleConsent('all')} variant="outline" className="flex-1">Alle akzeptieren</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
