import type { LandingPage } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, FileText, ArrowUpRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { LandingPageActions } from './landing-page-actions-client';

const updated = (value: string) => format(new Date(value), "dd. MMM yyyy 'um' HH:mm", { locale: de });

export function LandingPagesAdminView({ landingPages }: { landingPages: LandingPage[] }) {
  return <div className="min-w-0 space-y-6">
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 max-w-xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Inhalte verwalten</p>
        <h1 className="font-headline text-3xl font-bold">Landing Pages</h1>
        <p className="mt-3 text-sm text-muted-foreground">Seiten erstellen, bearbeiten und im Blick behalten.</p>
      </div>
      <Button asChild className="w-full shrink-0 sm:w-auto"><Link href="/lp/editor/new"><PlusCircle className="mr-2 h-4 w-4 shrink-0" />Neue Landing Page</Link></Button>
    </header>
    <div className="flex items-center justify-between gap-3 border-b pb-3 text-sm text-muted-foreground"><span>{landingPages.length} {landingPages.length === 1 ? 'Seite' : 'Seiten'}</span><span>Zuletzt bearbeitet</span></div>
    {!landingPages.length ? <section className="admin-panel flex min-h-52 flex-col items-center justify-center text-center">
      <FileText className="mb-4 h-8 w-8 text-muted-foreground" aria-hidden="true" /><h2 className="font-headline text-lg font-bold">Noch keine Landing Pages</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">Lege deine erste Seite über „Neue Landing Page“ an.</p>
    </section> : <>
      <div className="space-y-4 md:hidden" aria-label="Landing Pages">
        {landingPages.map(page => <article key={page.id} className="admin-panel">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-headline text-lg font-bold">{page.title}</h2><p className="mt-2 break-all font-mono text-xs text-muted-foreground">/lp/{page.slug}</p></div><LandingPageActions page={page} /></div>
          <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">Aktualisiert am {updated(page.lastUpdated)}</p>
          <Button asChild variant="outline" className="mt-4 w-full"><Link href={`/lp/editor/${page.slug}`}>Seite bearbeiten<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
        </article>)}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block"><Table>
        <TableHeader><TableRow><TableHead>Titel</TableHead><TableHead>Pfad</TableHead><TableHead>Aktualisiert</TableHead><TableHead className="text-right">Aktionen</TableHead></TableRow></TableHeader>
        <TableBody>{landingPages.map(page => <TableRow key={page.id}><TableCell className="font-semibold"><Link className="underline-offset-4 hover:underline" href={`/lp/editor/${page.slug}`}>{page.title}</Link></TableCell><TableCell className="font-mono text-xs">/lp/{page.slug}</TableCell><TableCell className="text-muted-foreground">{updated(page.lastUpdated)}</TableCell><TableCell className="text-right"><LandingPageActions page={page} /></TableCell></TableRow>)}</TableBody>
      </Table></div>
    </>}
  </div>;
}
