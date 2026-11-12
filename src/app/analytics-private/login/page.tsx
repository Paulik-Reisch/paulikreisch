import { redirect } from 'next/navigation';
import { getAnalyticsSession } from '@/lib/analytics-session';
import { AnalyticsLoginClient } from './login-client';
export default async function AnalyticsLoginPage() {
  if (await getAnalyticsSession()) redirect('/');
  return <main className="flex min-h-screen items-center justify-center bg-background p-5"><section className="w-full max-w-md rounded-xl border bg-card p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Paulik &amp; Reisch</p><h1 className="mt-2 font-headline text-3xl font-bold">Analytics</h1><p className="mb-7 mt-3 text-sm text-muted-foreground">Geschützte Auswertung. Verwende dein bestehendes freigegebenes Konto. Diese Sitzung gilt nur hier, nicht für die Inhaltsverwaltung.</p><AnalyticsLoginClient /></section></main>;
}
