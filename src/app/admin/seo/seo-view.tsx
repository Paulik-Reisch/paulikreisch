import type { LandingPage, SeoMetadata } from '@/lib/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, CheckCircle2, CircleDashed } from 'lucide-react';

type SeoItem = { slug: string; title: string; path: string };
function Status({ present, label }: { present: boolean; label: string }) {
  const Icon = present ? CheckCircle2 : CircleDashed;
  return <span className="inline-flex items-center gap-1.5 text-xs"><Icon aria-hidden="true" className={`h-4 w-4 shrink-0 ${present ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`} />{label}: {present ? 'vorhanden' : 'fehlt'}</span>;
}
function SeoPageList({ title, description, items, metadata }: { title: string; description: string; items: SeoItem[]; metadata: Map<string, SeoMetadata> }) {
  return <section className="space-y-4">
    <div><h2 className="font-headline text-xl font-bold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>
    {!items.length ? <p className="admin-panel text-sm text-muted-foreground">Noch keine Seiten in diesem Bereich.</p> : <>
      <div className="space-y-3 md:hidden">{items.map(item => { const meta = metadata.get(item.slug); return <article key={item.slug} className="admin-panel">
        <h3 className="font-semibold">{item.title}</h3><p className="mt-1 break-all font-mono text-xs text-muted-foreground">{item.path}</p>
        <div className="my-4 flex flex-wrap gap-x-4 gap-y-2"><Status present={!!meta?.title} label="Titel" /><Status present={!!meta?.metaDescription} label="Beschreibung" /></div>
        <Button variant="outline" asChild className="w-full"><Link href={`/seo/editor/${item.slug}`}><Edit className="mr-2 h-4 w-4" />Metadaten bearbeiten</Link></Button>
      </article>})}</div>
      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block"><Table><TableHeader><TableRow><TableHead>Seite</TableHead><TableHead>Pfad</TableHead><TableHead>Metadaten</TableHead><TableHead className="text-right">Aktion</TableHead></TableRow></TableHeader><TableBody>{items.map(item => { const meta = metadata.get(item.slug); return <TableRow key={item.slug}><TableCell className="font-semibold">{item.title}</TableCell><TableCell className="font-mono text-xs">{item.path}</TableCell><TableCell><div className="flex flex-wrap gap-x-4 gap-y-2"><Status present={!!meta?.title} label="Titel" /><Status present={!!meta?.metaDescription} label="Beschreibung" /></div></TableCell><TableCell className="text-right"><Button variant="outline" size="sm" asChild><Link href={`/seo/editor/${item.slug}`}><Edit className="mr-2 h-4 w-4" />Bearbeiten</Link></Button></TableCell></TableRow>})}</TableBody></Table></div>
    </>}
  </section>;
}

export function SeoAdminView({ landingPages, legalPages, allSeoData }: { landingPages: LandingPage[]; legalPages: { id: string; title: string }[]; allSeoData: SeoMetadata[] }) {
  const metadata = new Map(allSeoData.map(meta => [meta.id, meta]));
  const staticPages: SeoItem[] = [
    { path: '/', title: 'Homepage', slug: 'home' },
    { path: '/shop', title: 'Shop', slug: 'shop' },
    { path: '/lp2', title: 'LP2 - Countdown', slug: 'lp2' },
    { path: '/lp3', title: 'LP3 - Buch Live', slug: 'lp3' },
    { path: '/lp-series', title: 'LP - Buchserie', slug: 'lp-series' },
    { path: '/lp-risitas', title: 'LP - Risitas', slug: 'lp-risitas' },
    { path: '/lp-luin', title: 'LP - Luin', slug: 'lp-luin' },
    { path: '/exzerpte', title: 'Leseproben Übersicht', slug: 'exzerpte' },
  ];
  return <div className="min-w-0 space-y-8"><header><p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Sichtbarkeit pflegen</p><h1 className="font-headline text-3xl font-bold">SEO &amp; AEO</h1><p className="mt-3 max-w-xl text-sm text-muted-foreground">Titel, Beschreibungen und Informationen für Suchmaschinen und KI-Assistenten verwalten.</p></header>
    <SeoPageList title="Landing Pages" description="Metadaten deiner eigenen Landing Pages." items={landingPages.map(page => ({ slug: `lp-${page.slug}`, title: page.title, path: `/lp/${page.slug}` }))} metadata={metadata} />
    <SeoPageList title="Statische & rechtliche Seiten" description="Metadaten für die Hauptseiten und rechtlichen Hinweise." items={[...staticPages, ...legalPages.map(page => ({ slug: page.id, title: page.title, path: `/${page.id}` }))]} metadata={metadata} />
  </div>;
}
