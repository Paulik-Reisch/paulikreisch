'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { isIsolatedManagementHost } from '@/lib/management-hosts';
import { ManagementProviders } from './management-providers';
import { isPrivilegedPath } from '@/lib/admin-host-policy';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CookieBanner } from '@/components/landing/cookie-banner';
import { GlobalTracker } from '@/components/analytics/global-tracker';
import { Toaster } from '@/components/ui/toaster';

/** Cookie-only games run without authentication, tracking and cookie banner, but follow the site theme. */
export function SiteProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isolated, setIsolated] = useState(false);
  useEffect(() => { setIsolated(isIsolatedManagementHost(window.location.hostname)); }, []);
  if (isolated) return <ManagementProviders>{children}</ManagementProviders>;
  const administration = isPrivilegedPath(pathname);
  const cookieOnlyGame = ['/game-labs/bits', '/game-labs/wikiland'].some(path => pathname === path || pathname.startsWith(`${path}/`));
  if (cookieOnlyGame) {
    return <ThemeProvider attribute="class" defaultTheme="light">{children}</ThemeProvider>;
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <FirebaseClientProvider>
        {children}
        <Toaster />
        {!administration && !isolated && <>
          <CookieBanner />
          <Suspense><GlobalTracker /></Suspense>
        </>}
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
