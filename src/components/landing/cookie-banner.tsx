"use client";

import { isIsolatedManagementHost } from '@/lib/management-hosts';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import './cookie-banner.css';
import Link from 'next/link';
import { Logo } from '../ui/logo';
import { ANALYTICS_ID_KEY, CONSENT_CHANGED, OPEN_CONSENT } from '@/lib/analytics-consent';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [view, setView] = useState<'main' | 'settings'>('main');
  const [consent, setConsent] = useState<ConsentValue>(initialConsent);

  // Legal pages remain readable without an automatic prompt; settings can still be opened.
  const isLegalPage = HIDE_ON_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (isLegalPage || isIsolatedManagementHost(window.location.hostname)) return;
    let storedConsent: string | null = null;
    try { storedConsent = localStorage.getItem(COOKIE_NAME); } catch { /* Show choice when storage is blocked. */ }
    let currentVersion = false;
    try { currentVersion = (() => { const saved = JSON.parse(storedConsent ?? 'null'); return saved?.version === 2 || saved?.analytics === false; })(); } catch { /* Ask again after malformed consent. */ }
    if (!currentVersion) {
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isLegalPage]);

  useEffect(() => {
    const open = () => {
      if (isIsolatedManagementHost(window.location.hostname)) return;
      try { const saved = JSON.parse(localStorage.getItem(COOKIE_NAME) ?? 'null'); setConsent({ necessary: true, analytics: saved?.version === 2 && saved?.analytics === true, marketing: saved?.marketing === true }); } catch { setConsent(initialConsent); }
      setView('settings'); setShowBanner(true);
    };
    window.addEventListener(OPEN_CONSENT, open);
    return () => window.removeEventListener(OPEN_CONSENT, open);
  }, []);

  useEffect(() => {
    if (!showBanner) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]') ?? []);
    // Focus the dialog, not a legal link, so opening it does not outline a link.
    dialogRef.current?.focus({ preventScroll: true });
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusable(), first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', trap); previous?.focus(); };
  }, [showBanner, view]);

  const handleConsent = (value: 'all' | 'necessary' | ConsentValue) => {
    const consentValue = typeof value === 'string'
      ? { necessary: true, analytics: value === 'all', marketing: false }
      : value;

    try {
      localStorage.setItem(COOKIE_NAME, JSON.stringify({ ...consentValue, version: 2 }));
      if (!consentValue.analytics) localStorage.removeItem(ANALYTICS_ID_KEY);
    } catch { /* No stored consent means analytics stays off. */ }
    window.dispatchEvent(new Event(CONSENT_CHANGED));
    setShowBanner(false);
  };

  const handleToggle = (category: keyof Omit<ConsentValue, 'necessary'>) => {
    setConsent(prev => ({ ...prev, [category]: !prev[category] }));
  };

  if (!showBanner) {
    return null;
  }

  const legal = <div className="legal"><Link href="/datenschutz">Datenschutz</Link>{' · '}<Link href="/cookie-richtlinie">Cookie-Richtlinie</Link><p>Du kannst Deine Auswahl jederzeit im Footer unter „Mehr“ → „Cookie-Einstellungen“ ändern.</p></div>;
  return (
    <section id="pr-cookie-consent">
      <article ref={dialogRef} tabIndex={-1} className="panel" role="dialog" aria-modal="true" aria-labelledby="consent-title">
        <div className="brand"><Logo /><span>Paulik &amp; Reisch</span></div>
        {view === 'main' ? <>
          <div className="eyebrow">Cookies &amp; Statistik</div>
          <h2 id="consent-title">Deine Daten.<br />Deine Wahl.</h2>
          <p>Mit Deinem Okay zählen wir Seitenaufrufe und wiederkehrende Besuche. Dafür speichern wir eine zufällige ID für höchstens 90 Tage in Deinem Browser und senden sie mit Nutzungsereignissen an unsere Firebase-Datenbank.</p>
          <p>Ohne Zustimmung bleibt die Analyse aus. Die Seite funktioniert trotzdem.</p>
          <div className="actions"><button className="accept" onClick={() => handleConsent('all')}>Zustimmen</button><button onClick={() => handleConsent('necessary')}>Ablehnen</button><button onClick={() => setView('settings')}>Einstellungen</button></div>
          {legal}
        </> : <>
          <button className="back" onClick={() => setView('main')}>← &nbsp; Zurück</button>
          <div className="eyebrow">Du entscheidest</div>
          <h2 id="consent-title">Deine Einstellungen.</h2>
          <p>Nur das, was Du erlaubst. Die Analyse ist standardmäßig aus.</p>
          <div className="row"><div><h3>Notwendig</h3><p>Speichert Deine Auswahl und ermöglicht Grundfunktionen. Keine Reichweitenmessung.</p></div><span className="badge">Immer aktiv</span></div>
          <div className="row"><div><h3><label htmlFor="analytics">Analyse &amp; Leistung</label></h3><p>Zählt Seitenaufrufe und wiederkehrende Besuche mit einer zufälligen Browser-ID. Die ID gilt höchstens 90 Tage. Nutzungsereignisse gehen an unsere Firebase-Datenbank. Kein Konto, keine Anmelde-ID.</p></div><button id="analytics" role="switch" aria-checked={consent.analytics} aria-label="Analyse & Leistung" className="toggle" onClick={() => handleToggle('analytics')} /></div>
          <div className="actions two"><button onClick={() => handleConsent('necessary')}>Alles ablehnen</button><button onClick={() => handleConsent(consent)}>Auswahl speichern</button></div>
          {legal}
        </>}
      </article>
    </section>
  );
}
