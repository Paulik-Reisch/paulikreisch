'use client';

import { useEffect, useState } from 'react';
import { getWorthaftStatusClass, normalizeWorthaftSettings, DEFAULT_WORTHAFT_SETTINGS, type WorthaftSettings } from '@/lib/worthaft-settings';

export function WorthaftColorExplanation() {
  const [palette, setPalette] = useState<WorthaftSettings['palette']>(DEFAULT_WORTHAFT_SETTINGS.palette);

  useEffect(() => {
    const syncPalette = () => {
      try {
        const saved = localStorage.getItem('worthaft-settings');
        setPalette(normalizeWorthaftSettings(saved ? JSON.parse(saved) : null).palette);
      } catch {
        setPalette(DEFAULT_WORTHAFT_SETTINGS.palette);
      }
    };
    syncPalette();
    window.addEventListener('storage', syncPalette);
    window.addEventListener('pageshow', syncPalette);
    window.addEventListener('focus', syncPalette);
    return () => {
      window.removeEventListener('storage', syncPalette);
      window.removeEventListener('pageshow', syncPalette);
      window.removeEventListener('focus', syncPalette);
    };
  }, []);

  const badgeClass = (status: string) => `p-2 rounded-[10px] font-bold mr-2 inline-block ${getWorthaftStatusClass(status, palette)}`;

  return (
    <ul>
      <li>
        <span className={badgeClass('correct')}>{palette === 'classic' ? 'Grün' : 'Blau'}</span>
        Der Buchstabe ist korrekt und an der richtigen Stelle.
      </li>
      <li>
        <span className={badgeClass('present')}>Gelb</span>
        Der Buchstabe ist im Wort enthalten, aber an anderer Stelle.
      </li>
      <li>
        <span className={badgeClass('absent')}>Grau</span>
        Der Buchstabe kommt im Wort nicht vor.
      </li>
    </ul>
  );
}
