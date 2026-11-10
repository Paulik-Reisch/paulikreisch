'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

/** iOS-artiger Schalter fuer den Dunkelmodus (Testversion). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dunkelmodus"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2268ff] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#211d17] ${dark ? 'bg-[#34c759]' : 'bg-[#c9c2b4]'}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform duration-200 ${dark ? 'translate-x-6' : 'translate-x-1'}`}
      >
        {dark ? <Moon className="h-3 w-3 text-[#1d1a15]" /> : <Sun className="h-3 w-3 text-[#8a6d00]" />}
      </span>
    </button>
  );
}
