'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { logEventAction } from '@/app/actions';

export function GlobalTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (isUserLoading || !user) {
      return;
    }

    // Combine pathname and searchParams to get the full path
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const utmParams: {[key: string]: string} = {};
    for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('utm_')) {
            utmParams[key] = value;
        }
    }

    logEventAction('page_view', user.uid, url, utmParams);

  }, [pathname, searchParams, user, isUserLoading]);

  return null; // This component does not render anything
}
