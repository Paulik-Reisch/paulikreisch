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
    if (process.env.NEXT_PUBLIC_LOCAL_PREVIEW === 'true' || isUserLoading || !user) {
      return;
    }

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const params: {[key: string]: any} = {};
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }

    // Add client-side info
    params.userAgent = navigator.userAgent;
    params.language = navigator.language;
    params.screen_width = window.screen.width;
    params.screen_height = window.screen.height;

    logEventAction('page_view', user.uid, url, params);

  }, [pathname, searchParams, user, isUserLoading]);

  return null; // This component does not render anything
}
