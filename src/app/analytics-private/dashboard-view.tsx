import Link from 'next/link';
import { Suspense } from 'react';
import { AnalyticsClient, type AnalyticsClientProps } from '@/app/admin/analytics/analytics-client';
import { analyticsLogoutAction } from './actions';
import { Button } from '@/components/ui/button';

type DashboardData = AnalyticsClientProps & { since: string; fetchedAt: string };
export function AnalyticsDashboardView({ data, linksEnabled }: { data: DashboardData; linksEnabled: boolean }) {
  const start = new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',dateStyle:'medium'}).format(new Date(data.since));
  const updated = new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',dateStyle:'medium',timeStyle:'short'}).format(new Date(data.fetchedAt));
  return <main className="admin-main mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-10">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Paulik &amp; Reisch</p><h1 className="mt-2 font-headline text-3xl font-bold">Analytics</h1><p className="mt-2 text-sm text-muted-foreground">{linksEnabled ? 'Geschützte Auswertung und Kurzlinks · keine Inhalts- oder Dateiverwaltung' : 'Geschützte Auswertung · nur Lesen · keine Inhaltsverwaltung'}</p></div><div className="flex flex-wrap gap-3">{linksEnabled&&<Button asChild variant="outline"><Link href="/links">Kurzlinks</Link></Button>}<form action={analyticsLogoutAction}><Button variant="outline" className="text-foreground">Abmelden</Button></form></div></header>
    <div className="rounded-lg border bg-muted/40 p-4 text-sm"><p>Zeitraum: {start} bis zum Datenstand {updated} (Berlin). Top-Seiten, Quellen und Geräte beziehen sich auf diesen Zeitraum, nicht auf die gesamte Historie.</p><p className="mt-2 text-muted-foreground">Vergleich: aktueller Monat gegenüber dem vollständigen Vormonat und dem gleich langen Zeitraum im Vormonat. „Eingewilligte Browser“ sind pseudonyme Browser-IDs; „Anmeldeanfragen“ sind erfolgreiche Formular-Anfragen, keine bestätigten Abos. Maximal fünf Minuten zwischengespeichert, kein Live-Polling. Nur eingewilligte Besuche; fehlende Einwilligung ist keine Nullmessung.</p></div>
    <Suspense fallback={<p>Auswertung wird angezeigt …</p>}><AnalyticsClient {...data} scopeLabel={`Seit ${start}`} /></Suspense>
  </main>;
}
