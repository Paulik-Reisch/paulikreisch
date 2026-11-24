'use client';

import { useEffect } from 'react';

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

// Loads the lazy images below the fold one after another once the page is
// fully loaded and the browser is idle. Same files, same URLs, no quality change.
export function HomeImagePreload() {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '')) return;

    let cancelled = false;
    const schedule = (fn: () => void) => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 3000 });
      else setTimeout(fn, 500);
    };

    const run = async () => {
      const urls = Array.from(document.querySelectorAll<HTMLImageElement>('.pr-home img[loading="lazy"]'))
        .filter(img => !img.complete && img.src);
      for (const source of urls) {
        if (cancelled) return;
        await new Promise<void>(resolve => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = img.onerror = () => resolve();
          // Copy srcset/sizes so the browser picks the same file the visible image will use.
          if (source.srcset) img.srcset = source.srcset;
          if (source.sizes) img.sizes = source.sizes;
          img.src = source.src;
        });
        if (cancelled) return;
        await new Promise<void>(resolve => schedule(resolve));
      }
    };

    const start = () => schedule(() => { void run(); });
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
    };
  }, []);

  return null;
}
