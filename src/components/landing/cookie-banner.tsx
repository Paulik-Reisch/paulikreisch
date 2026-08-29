"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../ui/logo';

const COOKIE_NAME = 'hallowelt_cookie_consent';

// Auf diesen Routen wird der Consent-Banner nicht angezeigt (Legal-Pages).
const HIDE_ON_PATHS = [
  '/impressum',
  '/datenschutz',
  '/cookie-richtlinie',
  '/urheberrecht',
  '/widerruf',
  '/barrierefreiheit',
  '/transparenz',
];

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
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [view, setView] = useState<'main' | 'settings'>('main');
  const [consent, setConsent] = useState<ConsentValue>(initialConsent);

  // Auf Legal-Pages (Impressum, Datenschutz, etc.) den Banner niemals anzeigen.
  const isLegalPage = HIDE_ON_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (isLegalPage) return;
    const storedConsent = localStorage.getItem(COOKIE_NAME);
    if (storedConsent === null) {
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isLegalPage]);

  const handleConsent = (value: 'all' | 'necessary' | ConsentValue) => {
    const consentValue = typeof value === 'string'
      ? { necessary: true, analytics: value === 'all', marketing: value === 'all' }
      : value;

    localStorage.setItem(COOKIE_NAME, JSON.stringify(consentValue));
    setShowBanner(false);
  };

  const handleToggle = (category: keyof Omit<ConsentValue, 'necessary'>) => {
    setConsent(prev => ({ ...prev, [category]: !prev[category] }));
  };

  if (isLegalPage || !showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        {view === 'main' ? (
          <div className="p-8">
            <Logo className="h-10 w-auto mb-6 mx-auto text-foreground" />
            <h3 className="font-bold font-headline text-2xl text-center">{'Bevor Sie fortfahren …'}</h3>
            <p className="text-sm text-muted-foreground mt-4">
              Wir und unsere Partner verwenden Cookies und andere Technologien, um Informationen auf Ihrem Gerät zu speichern und abzurufen. Dies hilft uns, die Nutzung der Website zu analysieren, die Leistung zu verbessern und Ihnen relevante Inhalte anzuzeigen. Indem Sie auf „Zustimmen" klicken, willigen Sie in die Verwendung dieser Technologien für alle genannten Zwecke ein.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Sie können Ihre Einwilligung jederzeit widerrufen oder anpassen. Weitere Informationen finden Sie in unserer{' '}
              <Link href="/datenschutz" className="underline hover:text-primary">Datenschutzerklärung</Link> und in der{' '}
              <Link href="/cookie-richtlinie" className="underline hover:text-primary">Cookie-Richtlinie</Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button onClick={() => handleConsent('all')} className="flex-1 bg-foreground text-background hover:bg-foreground/80 h-12 text-base">Zustimmen</Button>
              <Button onClick={() => handleConsent('necessary')} variant="outline" className="flex-1 border-foreground/50 hover:bg-accent h-12 text-base">Ablehnen</Button>
            </div>
             <Button onClick={() => setView('settings')} variant="link" className="mt-4 text-muted-foreground">Einstellungen anpassen</Button>
          </div>
        ) : (
          <div className="p-8">
            <button onClick={() => setView('main')} className="flex items-center text-sm font-semibold mb-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </button>
            <h3 className="font-bold font-headline text-2xl">Passen Sie Ihre Auswahl an</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Verwalten Sie hier Ihre individuellen Cookie-Präferenzen. Notwendige Cookies können nicht deaktiviert werden.
            </p>
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="necessary" className="font-bold">Notwendig</Label>
                  <p className="text-xs text-muted-foreground mt-1">Diese Cookies sind für die Grundfunktionen der Website erforderlich. Beispiel: Speicherung Ihrer Cookie-Einwilligung.</p>
                </div>
                <Switch id="necessary" checked disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 rounded-lg">
                <div>
                  <Label htmlFor="analytics" className="font-bold">Analyse & Leistung</Label>
                   <p className="text-xs text-muted-foreground mt-1">Diese Cookies helfen uns, die Nutzung der Website zu verfolgen und die Benutzererfahrung zu verbessern.</p>
                </div>
                <Switch id="analytics" checked={consent.analytics} onCheckedChange={() => handleToggle('analytics')} />
              </div>
               <Separator />
              <div className="flex items-center justify-between p-4 rounded-lg">
                <div>
                  <Label htmlFor="marketing" className="font-bold">Marketing</Label>
                  <p className="text-xs text-muted-foreground mt-1">Wird verwendet, um Ihnen auf Sie zugeschnittene Werbung über das Internet anzuzeigen.</p>
                </div>
                <Switch id="marketing" checked={consent.marketing} onCheckedChange={() => handleToggle('marketing')} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button onClick={() => handleConsent(consent)} className="flex-1 bg-foreground text-background hover:bg-foreground/80 h-12">Auswahl speichern</Button>
                <Button onClick={() => handleConsent('all')} variant="outline" className="flex-1 border-foreground/50 hover:bg-accent h-12">Alle akzeptieren</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
