'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { previewWorthaftListEdit } from '@/lib/worthaft-editor-model';
import type { EditorResult, ModerationKind, ModerationPage, SaveListsRequest, WorthaftListSnapshot } from '@/lib/worthaft-editor-service';

type Props = {
  initial: WorthaftListSnapshot;
  date: string;
  readOnly?:boolean;
  saveLists: (request: SaveListsRequest) => Promise<EditorResult>;
  reloadLists: () => Promise<WorthaftListSnapshot>;
  loadModeration: (kind: ModerationKind, cursor: string | null) => Promise<ModerationPage>;
  reviewEntry: (kind: ModerationKind, id: string, revision: string) => Promise<EditorResult>;
  fixture?: boolean;
};
const parseText = (text: string) => text.split(/\r?\n/).map(word => word.trim()).filter(Boolean);
const panel = 'rounded-xl border bg-card p-4 sm:p-6';

export function WorthaftEditor({ initial, date, saveLists, reloadLists, loadModeration, reviewEntry, fixture = false,readOnly=false }: Props) {
  const [snapshot, setSnapshot] = useState(initial);
  const [words, setWords] = useState(initial.words.join('\n'));
  const [blocked, setBlocked] = useState(initial.antiWords.join('\n'));
  const [tab, setTab] = useState('words');
  const [acknowledge, setAcknowledge] = useState(false);
  const [confirmReload, setConfirmReload] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const candidate = useMemo(() => ({ words: parseText(words), antiWords: parseText(blocked) }), [words, blocked]);
  const preview = useMemo(() => {
    try { return { data: previewWorthaftListEdit(snapshot, candidate, date), error: '' }; }
    catch { return { data: null, error: 'Beide Listen brauchen mindestens ein Wort. Jedes Wort muss genau fünf deutsche Buchstaben haben.' }; }
  }, [snapshot, candidate, date]);
  const dirty = words !== snapshot.words.join('\n') || blocked !== snapshot.antiWords.join('\n');
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const reset = (current: WorthaftListSnapshot) => {
    setSnapshot(current); setWords(current.words.join('\n')); setBlocked(current.antiWords.join('\n'));
    setAcknowledge(false); setPreviewOpen(false); setConfirmReload(false);
  };
  const change = (setter: (value: string) => void, value: string) => {
    setter(value); setPreviewOpen(false); setAcknowledge(false); setConfirmReload(false); setMessage('');
  };
  const reload = async () => {
    if (dirty && !confirmReload) { setConfirmReload(true); return; }
    setBusy(true);
    try { reset(await reloadLists()); setFailed(false); setMessage('Aktueller Stand geladen.'); }
    catch { setFailed(true); setMessage('Neuladen fehlgeschlagen. Dein Entwurf bleibt erhalten.'); }
    finally { setBusy(false); }
  };
  const save = async () => {
    if (!previewOpen || !preview.data?.changed || busy) return;
    setBusy(true); setMessage('');
    try {
      const result = await saveLists({ ...candidate, revision: snapshot.revision, acknowledgeSchedule: acknowledge });
      setFailed(!result.success); setMessage(result.message);
      if (result.success && result.snapshot) reset(result.snapshot);
    } catch { setFailed(true); setMessage('Speichern nicht bestätigt. Dein Entwurf bleibt erhalten. Bitte aktuellen Stand neu laden.'); }
    finally { setBusy(false); }
  };
  const draftBlock = (word: string) => {
    const normalized = word.trim().normalize('NFC').toLocaleLowerCase('de');
    if (!/^[a-zäöüß]{5}$/.test(normalized)) { setFailed(true); setMessage('Dieser Eintrag enthält kein gültiges fünfstelliges Wort.'); return; }
    if (candidate.antiWords.some(entry => entry.toLocaleLowerCase('de') === normalized)) {
      setFailed(false); setMessage('Das Wort steht bereits im Sperrlisten-Entwurf.');
    } else {
      change(setBlocked, [...candidate.antiWords, normalized].join('\n'));
      setFailed(false); setMessage('Zur Sperrliste vorgemerkt, noch nicht gespeichert. Lösungen werden nicht automatisch entfernt.');
    }
    setTab('blocked');
  };

  return <div className="mx-auto max-w-5xl space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Spielverwaltung</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Worthaft</h1>
        <p className="mt-2 text-sm text-muted-foreground">Wörter pflegen, Sperrliste bearbeiten und Rückmeldungen prüfen.</p>
      </div>
      <span className="rounded-full border px-3 py-1 text-xs">{fixture ? 'Lokale Demo · keine Datenbank' : `Berlin · ${date}`}</span>
    </header>
    {fixture && <p className="rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm text-blue-950">Synthetische Testdaten. Speichern verändert nur diese lokale Vorschau, keine echten Wörter oder Rückmeldungen.</p>}
    <section aria-label="Hinweis zur Tageswortfolge" className="rounded-xl border border-amber-400/60 bg-amber-50 p-4 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
      <h2 className="font-semibold">Listenänderungen können die Tageswortfolge verschieben</h2>
      <p className="mt-1 text-sm leading-relaxed">Anzahl und Reihenfolge bestimmen künftige Lösungen. Auch Anhängen kann die Folge ändern. {readOnly ? 'Speichern bleibt gesperrt, bis die dauerhafte Tageswort-Absicherung aktiviert ist.' : 'Das heutige dauerhaft gespeicherte Tageswort bleibt unverändert und weiter erratbar.'} Bereits geöffnete Spiele übernehmen neue Listen nicht automatisch.</p>
    </section>
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList aria-label="Worthaft-Bereiche" className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
        <TabsTrigger className="text-muted-foreground data-[state=active]:text-foreground" value="words">Wörter <span className="ml-1 text-xs opacity-70">{candidate.words.length}</span></TabsTrigger>
        <TabsTrigger className="text-muted-foreground data-[state=active]:text-foreground" value="blocked">Gesperrte Wörter <span className="ml-1 text-xs opacity-70">{candidate.antiWords.length}</span></TabsTrigger>
        <TabsTrigger className="text-muted-foreground data-[state=active]:text-foreground" value="feedback">Feedback</TabsTrigger><TabsTrigger className="text-muted-foreground data-[state=active]:text-foreground" value="suggestions">Vorschläge</TabsTrigger>
      </TabsList>
      <TabsContent value="words" className="mt-5">
        <section className={panel}><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Lösungs- und Wörterliste</h2><span className="text-xs text-muted-foreground">Reihenfolge bleibt erhalten</span></div>
          <label htmlFor="worthaft-words" className="mb-2 block text-sm font-medium">Ein Wort pro Zeile</label>
          <textarea id="worthaft-words" spellCheck={false} value={words} onChange={e => change(setWords, e.target.value)} disabled={busy} className="min-h-64 w-full rounded-lg border bg-background p-3 font-mono text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" />
          <p className="mt-2 text-xs text-muted-foreground">Fünf deutsche Buchstaben. Keine automatische Sortierung oder Entfernung von Duplikaten. Leerzeilen werden ignoriert.</p>
        </section>
      </TabsContent>
      <TabsContent value="blocked" className="mt-5">
        <section className={panel}><h2 className="mb-2 text-lg font-semibold">Gesperrte Wörter</h2>
          <p className="mb-4 text-sm text-muted-foreground">Die bestehende Anti-Wortliste. Änderungen hier entfernen kein Wort automatisch aus der Lösungsliste.</p>
          <label htmlFor="worthaft-blocked" className="mb-2 block text-sm font-medium">Ein gesperrtes Wort pro Zeile</label>
          <textarea id="worthaft-blocked" spellCheck={false} value={blocked} onChange={e => change(setBlocked, e.target.value)} disabled={busy} className="min-h-64 w-full rounded-lg border bg-background p-3 font-mono text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" />
          <p className="mt-2 text-xs text-muted-foreground">Die aktuelle Datenstruktur verlangt auch hier mindestens ein Wort.</p>
        </section>
      </TabsContent>
      <TabsContent value="feedback" className="mt-5"><ModerationPanel kind="feedback" load={loadModeration} review={reviewEntry} draftBlock={draftBlock} /></TabsContent>
      <TabsContent value="suggestions" className="mt-5"><ModerationPanel kind="suggestions" load={loadModeration} review={reviewEntry} draftBlock={draftBlock} /></TabsContent>
    </Tabs>
    {(tab === 'words' || tab === 'blocked') && <section className={panel} aria-label="Listenänderungen">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{dirty ? 'Ungespeicherter Entwurf' : 'Keine ungespeicherten Änderungen'}</p>
        <div className="flex flex-wrap gap-2"><Button variant="outline" className="text-foreground" onClick={reload} disabled={busy}>{confirmReload ? 'Entwurf verwerfen und laden' : 'Aktuellen Stand laden'}</Button>
          <Button onClick={() => { setPreviewOpen(true); setMessage(''); }} disabled={busy || !dirty}>Änderungen prüfen</Button></div>
      </div>
      {confirmReload && <p role="alert" className="mt-3 text-sm text-amber-800 dark:text-amber-200">Erneuter Klick verwirft deinen ungespeicherten Entwurf. Es wird nichts gespeichert.</p>}
      {previewOpen && <div className="mt-5 space-y-4 border-t pt-5">
        <h2 className="text-lg font-semibold">Vor dem Speichern</h2>
        {preview.error ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">{preview.error}</p> : preview.data && <>
          <div className="grid gap-3 sm:grid-cols-2"><ChangeCard title="Wörter" changes={preview.data.wordChanges} /><ChangeCard title="Sperrliste" changes={preview.data.blockedChanges} /></div>
          {!!preview.data.overlap.length && <p className="rounded-lg border border-amber-400 p-3 text-sm">In beiden Listen: {preview.data.overlap.join(', ')}. Diese Überschneidung wird nicht automatisch korrigiert.</p>}
          {preview.data.scheduleMayChange && <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
            <input type="checkbox" checked={acknowledge} onChange={e => setAcknowledge(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-amber-600" />
            <span>Ich bestätige: Diese Änderung kann die künftige Tageswortfolge ändern.</span>
          </label>}
          <div className="flex flex-wrap gap-3"><Button onClick={save} disabled={readOnly || busy || !preview.data.changed || (preview.data.scheduleMayChange && !acknowledge)}>{busy ? 'Wird gespeichert …' : 'Listen jetzt speichern'}</Button><Button variant="ghost" className="text-foreground" disabled={busy} onClick={() => setPreviewOpen(false)}>Zurück zum Entwurf</Button></div>
          <p className="text-xs text-muted-foreground">Beide Listen werden auf konkurrierende Änderungen geprüft. Der Spielcache wird erst nach erfolgreicher Speicherung geleert.</p>
        </>}
      </div>}
    </section>}
    {message && <p role={failed ? 'alert' : 'status'} className={`rounded-lg border p-4 text-sm ${failed ? 'border-red-400 bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100' : 'bg-muted'}`}>{message}</p>}
  </div>;
}

function ChangeCard({ title, changes }: { title: string; changes: ReturnType<typeof previewWorthaftListEdit>['wordChanges'] }) {
  return <div className="rounded-lg bg-muted/60 p-4 text-sm"><h3 className="font-semibold">{title}: {changes.beforeCount} → {changes.afterCount}</h3>
    <p className="mt-2 break-words">Neu: {changes.added.join(', ') || 'keine'}</p><p className="mt-1 break-words">Entfernt: {changes.removed.join(', ') || 'keine'}</p>
    <p className="mt-1">Reihenfolge/Anzahl: {changes.orderChanged ? 'geändert' : 'unverändert'}</p>
    {!!changes.duplicates.length && <p className="mt-2 break-words font-medium">Doppelte Einträge bleiben erhalten: {changes.duplicates.join(', ')}</p>}
  </div>;
}

function ModerationPanel({ kind, load, review, draftBlock }: { kind: ModerationKind; load: Props['loadModeration']; review: Props['reviewEntry']; draftBlock: (word: string) => void }) {
  const [page, setPage] = useState<ModerationPage | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [history, setHistory] = useState<(string | null)[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('all');
  const fetchPage = async (next: string | null, mode: 'next' | 'back' | 'reload') => {
    setBusy(true); setMessage('');
    try {
      const result = await load(kind, next);
      setPage(result);
      if (mode === 'next') setHistory([...history, cursor]);
      if (mode === 'back') setHistory(history.slice(0, -1));
      setCursor(next);
    } catch { setMessage('Laden fehlgeschlagen. Die vorhandenen Einträge bleiben sichtbar.'); }
    finally { setBusy(false); }
  };
  const mark = async (id: string, revision: string) => {
    setBusy(true);
    try {
      const result = await review(kind, id, revision); setMessage(result.message);
      if (result.success) setPage(current => current ? { ...current, entries: current.entries.map(entry => entry.id === id ? { ...entry, reviewed: true } : entry) } : current);
    } catch { setMessage('Markieren nicht bestätigt. Bitte die Seite neu laden.'); }
    finally { setBusy(false); }
  };
  const entries = page?.entries.filter(entry => `${entry.word} ${entry.date} ${entry.detail}`.toLocaleLowerCase('de').includes(filter.toLocaleLowerCase('de')) && (status !== 'open' || !entry.reviewed)) ?? [];
  return <section className={panel}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{kind === 'feedback' ? 'Rückmeldungen prüfen' : 'Wortvorschläge prüfen'}</h2>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">Maximal 25 Einträge pro Seite, sortiert nach Dokumentkennung. Keine zeitliche Rangfolge und kein automatisches Nachladen.</p></div>
      <Button variant="outline" className="text-foreground" disabled={busy} onClick={() => fetchPage(cursor, 'reload')}>{busy ? 'Wird geladen …' : page ? 'Seite neu laden' : 'Einträge laden'}</Button>
    </div>
    {kind === 'feedback' && <p className="mt-4 rounded-lg bg-muted p-3 text-sm">Positive Rückmeldungen werden aktuell nur im Spielgerät bestätigt. Diese Ansicht ist keine vollständige Abstimmungsstatistik.</p>}
    {page && <>
      <div className="my-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Auf dieser Seite suchen<input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Wort, Datum oder Grund" className="mt-1 block w-full rounded-md border bg-background p-2 font-normal" /></label>
        <label className="text-sm font-medium">Status auf dieser Seite<select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 block w-full rounded-md border bg-background p-2 font-normal"><option value="all">Alle</option><option value="open">Noch offen</option></select></label></div>
      <div className="space-y-3">{!entries.length && <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">{page.entries.length ? 'Keine passenden Einträge auf dieser Seite.' : 'Auf dieser Seite sind keine Einträge vorhanden.'}</p>}
        {entries.map(entry => <article key={entry.id} className="rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-mono font-semibold uppercase">{entry.word}</h3><span className={`rounded-full px-2 py-1 text-xs ${entry.reviewed ? 'bg-muted' : 'bg-amber-100 text-amber-950'}`}>{entry.reviewed ? 'Geprüft' : 'Offen'}</span></div>
          <p className="mt-2 break-words text-sm">{entry.detail}</p><p className="mt-1 text-xs text-muted-foreground">Spieltag: {entry.date || 'nicht angegeben'}</p>
          <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="outline" className="text-foreground" disabled={busy || entry.reviewed} onClick={() => mark(entry.id, entry.revision)}>Als geprüft markieren</Button><Button size="sm" variant="ghost" className="text-foreground" disabled={busy} onClick={() => draftBlock(entry.word)}>Sperren vormerken</Button></div>
        </article>)}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{page.entries.length} geladen · {entries.length} angezeigt</p><div className="flex gap-2"><Button variant="outline" className="text-foreground" disabled={busy || !history.length} onClick={() => fetchPage(history[history.length - 1], 'back')}>Zurück</Button><Button variant="outline" className="text-foreground" disabled={busy || !page.nextCursor} onClick={() => fetchPage(page.nextCursor, 'next')}>Nächste Seite</Button></div></div>
    </>}
    {message && <p role="status" className="mt-4 rounded-lg bg-muted p-3 text-sm">{message}</p>}
    <p className="mt-5 text-xs text-muted-foreground">Prüfen löscht keine Rückmeldung. „Sperren vormerken“ ändert nur deinen Listenentwurf und braucht danach eine getrennte Speicherung.</p>
  </section>;
}
