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

  const badgeClass = (status: string) => `p-2 rounded-[10px] font-bold inline-block text-center ${getWorthaftStatusClass(status, palette)}`;

  return (
    <ul>
      <li style={{ display: 'flex', alignItems: 'baseline', gap: 16, paddingLeft: 0 }}>
        <span style={{ width: 64, flexShrink: 0 }} className={badgeClass('correct')}>{palette === 'classic' ? 'Grün' : 'Blau'}</span>
        <span>Buchstabe ist korrekt und an der richtigen Stelle</span>
      </li>
      <li style={{ display: 'flex', alignItems: 'baseline', gap: 16, paddingLeft: 0 }}>
        <span style={{ width: 64, flexShrink: 0 }} className={badgeClass('present')}>Gelb</span>
        <span>Buchstabe ist im Wort enthalten, aber an anderer Stelle</span>
      </li>
      <li style={{ display: 'flex', alignItems: 'baseline', gap: 16, paddingLeft: 0 }}>
        <span style={{ width: 64, flexShrink: 0 }} className={badgeClass('absent')}>Grau</span>
        <span>Buchstabe kommt im Wort nicht vor</span>
      </li>
    </ul>
  );
}
