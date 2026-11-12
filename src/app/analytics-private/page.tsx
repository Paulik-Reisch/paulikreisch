import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getAnalyticsSession } from '@/lib/analytics-session';
import { loadPrivateAnalytics } from '@/lib/analytics-private-data';
import { AnalyticsClient } from '@/app/admin/analytics/analytics-client';
import { analyticsLogoutAction } from './actions';
import { Button } from '@/components/ui/button';
export default async function PrivateAnalyticsPage() {
  if (!await getAnalyticsSession()) redirect('/login');
  let data;
  try { data = await loadPrivateAnalytics(); }
  catch { return <main className="mx-auto max-w-xl space-y-4 p-6"><h1 className="font-headline text-3xl font-bold">Analytics</h1><p role="alert">Die Auswertung konnte nicht vollständig geladen werden. Es werden keine unvollständigen Kennzahlen angezeigt. Bei mehr als 5.000 Ereignissen braucht der Zeitraum eine kleinere Auswertung.</p><form action={analyticsLogoutAction}><Button variant="outline">Abmelden</Button></form></main>; }
  const start = new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',dateStyle:'medium'}).format(new Date(data.since));
  const updated = new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',dateStyle:'medium',timeStyle:'short'}).format(new Date(data.fetchedAt));
  return <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-10">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Paulik &amp; Reisch</p><h1 className="mt-2 font-headline text-3xl font-bold">Analytics</h1><p className="mt-2 text-sm text-muted-foreground">Geschützte Auswertung · nur Lesen · keine Inhaltsverwaltung</p></div><form action={analyticsLogoutAction}><Button variant="outline" className="text-foreground">Abmelden</Button></form></header>
    <div className="rounded-lg border bg-muted/40 p-4 text-sm"><p>Zeitraum: {start} bis zum Datenstand {updated} (Berlin). Top-Seiten, Quellen und Geräte beziehen sich auf diesen Zeitraum, nicht auf die gesamte Historie.</p><p className="mt-2 text-muted-foreground">Aktueller Monat im Vergleich zum vollständigen Vormonat. Maximal fünf Minuten zwischengespeichert, kein Live-Polling. Nur eingewilligte Besuche; fehlende Einwilligung ist keine Nullmessung.</p></div>
    <Suspense fallback={<p>Auswertung wird angezeigt …</p>}><AnalyticsClient {...data} scopeLabel={`Seit ${start}`} /></Suspense>
  </main>;
}
