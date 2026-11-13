
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verwaltung anmelden',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
};

import { Logo } from '@/components/ui/logo';
import { LoginForm } from './login-form';
import { getSession, getStaticSession } from '@/lib/session';
import { headers } from 'next/headers';
import { requestHost } from '@/lib/admin-host-policy';
import { STATIC_HOST } from '@/lib/management-hosts';
import { redirect } from 'next/navigation';

export default async function AdminLoginPage() {
  const staticHost = requestHost(await headers()) === STATIC_HOST;
  const session = staticHost ? await getStaticSession() : await getSession();
  if (session) {
    redirect(staticHost ? "/" : "/authors");
  }

  return (
    <div className="internal-dashboard">
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
        <div className="w-full max-w-md flex flex-col items-center text-center">
          <div className="flex flex-col items-center justify-center text-center mb-12">
              <Logo className="h-16 w-auto text-foreground" />
              <h1 className="font-semibold text-2xl mt-4">Paulik &amp; Reisch</h1>
          </div>
          <h2 className="text-lg mb-6">{staticHost ? "Static - Dateiverwaltung" : "Admin - Verwaltung"}</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
