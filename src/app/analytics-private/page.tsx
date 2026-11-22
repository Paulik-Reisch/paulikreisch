import { shortLinksEnabled } from '@/lib/short-links-server';
import { redirect } from 'next/navigation';
import { getAnalyticsSession } from '@/lib/analytics-session';
import { loadPrivateAnalytics } from '@/lib/analytics-private-data';
import { AnalyticsDashboardView } from './dashboard-view';
import { analyticsLogoutAction } from './actions';
import { Button } from '@/components/ui/button';
export default async function PrivateAnalyticsPage() {
  if (!await getAnalyticsSession()) redirect('/login');
  let data;
  try { data = await loadPrivateAnalytics(); }
  catch { return <main className="admin-main mx-auto max-w-xl space-y-4 p-6"><h1 className="font-headline text-3xl font-bold">Analytics</h1><p role="alert">Die Auswertung konnte nicht vollständig geladen werden. Es werden keine unvollständigen Kennzahlen angezeigt. Bei mehr als 5.000 Ereignissen braucht der Zeitraum eine kleinere Auswertung.</p><form action={analyticsLogoutAction}><Button variant="outline">Abmelden</Button></form></main>; }
  return <AnalyticsDashboardView data={data} linksEnabled={shortLinksEnabled()} />;
}
