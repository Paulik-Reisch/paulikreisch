import Link from 'next/link';
import {persistentDailyEnabled} from '@/lib/worthaft-persistent-daily';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getWorthaftDateString } from '@/lib/worthaft-daily-word';
import { loadWorthaftEditorLists } from '@/lib/worthaft-editor-repository';
import { WorthaftEditor } from './editor-client';
import { saveListsAction, reloadListsAction, loadModerationAction, dismissEntryAction } from './editor-actions';
import { refreshWorthaftWordListsAction } from './actions';
import { Button } from '@/components/ui/button';

export default async function AdminWorthaftPage() {
  if (!await getSession()) redirect('/login');
  let initial;
  try { initial = await loadWorthaftEditorLists(); }
  catch {
    return <section className="mx-auto max-w-xl space-y-4 rounded-xl border p-6"><h1 className="font-headline text-3xl font-bold">Worthaft</h1><p role="alert">Die Wortlisten konnten nicht sicher geladen werden. Es wird kein leerer Editor geöffnet und nichts überschrieben.</p><p className="text-sm text-muted-foreground">Bitte den aktuellen Stand erneut laden. Die Spielseite bleibt davon unberührt.</p><Link prefetch={false} className="inline-block underline" href="/worthaft">Erneut laden</Link></section>;
  }
  return <>
    {!persistentDailyEnabled()&&<p className="mx-auto mb-4 max-w-5xl rounded-lg border p-4 text-sm">Listen speichern ist noch gesperrt, bis das Tageswort dauerhaft über Serverneustarts abgesichert ist. Entwürfe und Vorschau bleiben möglich.</p>}
    <WorthaftEditor readOnly={!persistentDailyEnabled()} initial={initial} date={getWorthaftDateString()} saveLists={saveListsAction} reloadLists={reloadListsAction} loadModeration={loadModerationAction} dismissEntry={dismissEntryAction} />
    <details className="mx-auto mt-8 max-w-5xl rounded-xl border p-4"><summary className="cursor-pointer text-sm font-medium">Cache nach Änderungen außerhalb dieser Oberfläche</summary><p className="my-3 text-sm text-muted-foreground">Wenn du Listen direkt in Firebase geändert hast, kannst du den Spielcache hier leeren. {persistentDailyEnabled() ? 'Das dauerhaft gespeicherte Tageswort bleibt dabei unverändert.' : 'Die Tageswort-Absicherung ist noch nicht aktiviert.'}</p><form action={refreshWorthaftWordListsAction}><Button variant="outline" type="submit">Wortlisten neu laden</Button></form></details>
  </>;
}
