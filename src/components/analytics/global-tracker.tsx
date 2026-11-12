'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { logEventAction } from '@/app/actions';
import { CONSENT_CHANGED, getBrowserAnalyticsId } from '@/lib/analytics-consent';

export function GlobalTracker() {
  const pathname = usePathname();
  const [consentVersion, setConsentVersion] = useState(0);
  const lastTracked = useRef<string | null>(null);
  useEffect(() => {
    const changed = () => setConsentVersion(v => v + 1);
    window.addEventListener(CONSENT_CHANGED, changed);
    window.addEventListener('storage', changed);
    return () => { window.removeEventListener(CONSENT_CHANGED, changed); window.removeEventListener('storage', changed); };
  }, []);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LOCAL_PREVIEW === 'true') return;
    const id = getBrowserAnalyticsId();
    if (!id) { lastTracked.current = null; return; }
    const url = pathname; // Never include email, tokens or other query-string contents.
    const key = `${id}:${url}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;
    const params: Record<string, string | number> = {};
    params.userAgent = navigator.userAgent;
    params.language = navigator.language;
    params.screen_width = window.screen.width;
    params.screen_height = window.screen.height;
    void logEventAction('page_view', id, url, params).catch(() => { if (lastTracked.current === key) lastTracked.current = null; });
  }, [pathname, consentVersion]);
  return null;
}
