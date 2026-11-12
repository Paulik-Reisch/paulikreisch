import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
};

/** Direct-URL internal tools share the same authorization as the admin area. */
export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  if (!(await getSession())) redirect('/login');
  return <>{children}</>;
}
