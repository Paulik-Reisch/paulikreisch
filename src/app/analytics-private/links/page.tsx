import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getAnalyticsSession} from '@/lib/analytics-session';
import {shortLinks,shortLinksEnabled} from '@/lib/short-links-server';
import {SHORT_LINK_CODE} from '@/lib/short-links';
import {ShortLinksPanel} from './short-links-panel';
export const dynamic='force-dynamic';
export default async function ShortLinksPage({searchParams}:{searchParams:Promise<{cursor?:string;notice?:string;created?:string}>}){
  if(!await getAnalyticsSession())redirect('/login');
  const query=await searchParams;
  const enabled=shortLinksEnabled();
  let result;let createdRecord;let failed=false;
  if(enabled){try{const repo=shortLinks();result=await repo.list(typeof query.cursor==='string'?query.cursor:undefined);if(typeof query.created==='string'&&SHORT_LINK_CODE.test(query.created))createdRecord=await repo.get(query.created);if(createdRecord)result.records=[createdRecord,...result.records.filter(record=>record.code!==createdRecord!.code)];}catch{failed=true;}}
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-8 sm:py-10">
    <header className="space-y-3"><Link href="/" className="text-sm text-primary underline underline-offset-4">Zur Analytics-Auswertung</Link><p className="text-xs font-semibold uppercase tracking-widest text-primary">Paulik &amp; Reisch</p><h1 className="text-3xl font-bold">Trackbare Kurzlinks</h1><p className="text-sm text-muted-foreground">Getrennter Kurzlink-Bereich auf dem Analytics-Host. Kein Zugriff auf die Inhalts- oder Dateiverwaltung.</p></header>
    {!enabled&&<p role="status" className="rounded-lg border p-4">Die Kurzlinks sind noch nicht freigeschaltet. Domain und privater Speicher müssen vor der Nutzung bestätigt sein.</p>}
    {failed&&<p role="alert" className="rounded-lg border p-4">Kurzlinks konnten nicht vollständig geladen werden. Bitte später erneut versuchen. Es werden keine unvollständigen Zahlen angezeigt.</p>}
    {createdRecord&&<p role="status" className="rounded-lg border p-4">Kurzlink wurde erstellt. Du findest ihn in der Liste und kannst ihn dort kopieren.</p>}
    {query.notice==='deleted'&&<p role="status" className="rounded-lg border p-4">Kurzlink gelöscht. Der Code bleibt gesperrt und kann nicht erneut vergeben werden.</p>}
    {query.notice==='changed'&&<p role="status" className="rounded-lg border p-4">Kurzlink wurde geändert.</p>}
    {query.notice==='create-error'&&<p role="alert" className="rounded-lg border p-4">Kurzlink konnte nicht erstellt werden. Bitte Name, öffentliche HTTPS-Zieladresse und Code-Format prüfen. Wunschnamen können bereits belegt oder reserviert sein; kurze Zufallscodes können bei hoher Belegung mehrere Versuche brauchen. Es wird kein vorhandener Link überschrieben.</p>}
    {query.notice==='change-error'&&<p role="alert" className="rounded-lg border p-4">Änderung nicht gespeichert. Der Link wurde möglicherweise gleichzeitig aufgerufen oder geändert. Bitte neu laden und erneut versuchen.</p>}
    {!failed&&<ShortLinksPanel records={result?.records??[]} enabled={enabled}/>}
    {result?.nextCursor&&<Link href={`/links?cursor=${encodeURIComponent(result.nextCursor)}`} className="inline-block text-primary underline underline-offset-4">Weitere Kurzlinks</Link>}
    <p className="text-xs text-muted-foreground">In der Kurzlink-Zählung werden keine IP-Adressen, Referrer, User-Agents oder einzelnen Klickereignisse gespeichert. Technische Hosting-Protokolle sind davon unabhängig. Kurzlinks sind öffentlich teilbar und keine Zugriffssperre für das Ziel.</p>
  </main>;
}
