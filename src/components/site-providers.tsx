'use client';

import { Suspense, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CookieBanner } from '@/components/landing/cookie-banner';
import { GlobalTracker } from '@/components/analytics/global-tracker';
import { Toaster } from '@/components/ui/toaster';

/** Bits runs independently of authentication, tracking and browser theme storage. */
export function SiteProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/game-labs/bits' || pathname.startsWith('/game-labs/bits/')) return <>{children}</>;
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <FirebaseClientProvider>
        {children}
        <Toaster />
        <CookieBanner />
        <Suspense><GlobalTracker /></Suspense>
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
