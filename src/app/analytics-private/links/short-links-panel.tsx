'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {SHORT_LINK_ORIGIN,type ShortLink} from '@/lib/short-links';
import {createShortLinkAction,setShortLinkActiveAction,updateShortLinkAction,deleteShortLinkAction} from './actions';
export function ShortLinksPanel({records,enabled=true}:{records:ShortLink[];enabled?:boolean}){
  const [copied,setCopied]=useState<string|null>(null);
  const [copyError,setCopyError]=useState(false);
  const [format,setFormat]=useState('random');
  const [editing,setEditing]=useState<string|null>(null);
  const [deleting,setDeleting]=useState<string|null>(null);
  async function copy(code:string){try{await navigator.clipboard.writeText(`${SHORT_LINK_ORIGIN}/${code}`);setCopied(code);setCopyError(false)}catch{setCopyError(true)}}
  return <div className="space-y-8">
    <section className="rounded-lg border bg-card p-5 sm:p-6" aria-labelledby="create-link-title">
      <h2 id="create-link-title" className="text-xl font-bold">Neuen Kurzlink erstellen</h2>
      <p className="mt-2 text-sm text-muted-foreground">Ein festes HTTPS-Ziel auf l.paulikreisch.de: vier Zufallszeichen, vier Hex-Zeichen oder dein Wunschname. Kurze Codes sind leicht erratbar und keine Zugriffssperre. Groß- und Kleinschreibung zählt. Bisherige link.paulikreisch.de-Links bleiben gültig. Keine Besucherprofile, Cookies oder Gerätekennungen. Bitte keine persönlichen Zugangsdaten, Resetlinks oder vertraulichen Dokumente verlinken.</p>
      <form action={createShortLinkAction} className="mt-5 grid gap-4">
        <div className="space-y-2"><Label htmlFor="short-link-label">Name / Kampagne</Label><Input id="short-link-label" name="label" placeholder="z. B. Instagram Buchseite" maxLength={100} required disabled={!enabled}/></div>
        <div className="space-y-2"><Label htmlFor="short-link-target">HTTPS-Zieladresse</Label><Input id="short-link-target" name="target" type="url" placeholder="https://paulikreisch.de/shop" maxLength={2048} required disabled={!enabled}/></div>
        <div className="space-y-2"><Label htmlFor="short-link-format">Code-Format</Label><select id="short-link-format" name="format" value={format} onChange={event=>setFormat(event.target.value)} disabled={!enabled} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="random">Zufall: 4 Zeichen (z. B. a6W7)</option><option value="hex">Hex: 4 Zeichen (0-9, a-f)</option><option value="custom">Eigener Name</option></select></div>
        {format==='custom'&&<div className="space-y-2"><Label htmlFor="short-link-code">Wunschname</Label><Input id="short-link-code" name="customCode" placeholder="z. B. buch" minLength={4} maxLength={32} pattern="[A-Za-z0-9][A-Za-z0-9_-]{3,31}" required disabled={!enabled}/><p className="text-xs text-muted-foreground">4 bis 32 Zeichen: Buchstaben, Ziffern, - oder _. Beginnt mit Buchstabe oder Ziffer. Bereits belegte Namen werden nicht ersetzt.</p></div>}
        <Button type="submit" disabled={!enabled} className="w-full sm:w-fit">Kurzlink erstellen</Button>
      </form>
    </section>
    <section className="space-y-4" aria-labelledby="existing-links-title">
      <h2 id="existing-links-title" className="text-xl font-bold">Vorhandene Kurzlinks</h2>
      <p className="text-sm text-muted-foreground">Aufrufe sind gezählte GET-Anfragen, keine eindeutigen Besucher. Bots und Vorschauen können mitzählen. HEAD und erkannte Prefetches zählen nicht. Bei gleichzeitigen Anfragen oder Zählfehlern kann der Wert zu niedrig sein. Deaktivierte Links liefern keine Weiterleitung.</p>
      {copyError&&<p role="alert" className="text-sm">Kopieren ist hier nicht möglich. Bitte den angezeigten Kurzlink markieren.</p>}
      {!records.length&&<p className="rounded-lg border p-5 text-muted-foreground">Noch keine Kurzlinks vorhanden.</p>}
      <div className="grid gap-4">{records.map(record=><article key={record.code} className="min-w-0 space-y-4 rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-semibold">{record.label}</h3><p className="mt-1 text-sm text-muted-foreground">{record.active?'Aktiv':'Deaktiviert'} · {record.clicks.toLocaleString('de-DE')} Aufrufe</p></div><span className="text-sm text-muted-foreground">{new Date(record.createdAt).toLocaleDateString('de-DE',{timeZone:'Europe/Berlin'})}</span></div>
        <div className="space-y-1 text-sm"><p className="break-all font-mono">{SHORT_LINK_ORIGIN}/{record.code}</p><p className="break-all text-muted-foreground">Ziel: {record.target}</p></div>
        <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={()=>{setEditing(editing===record.code?null:record.code);setDeleting(null)}} disabled={!enabled}>Bearbeiten</Button><Button type="button" variant="outline" onClick={()=>{setDeleting(deleting===record.code?null:record.code);setEditing(null)}} disabled={!enabled}>Löschen</Button><Button type="button" variant="outline" onClick={()=>copy(record.code)}>{copied===record.code?'Kopiert':'Kurzlink kopieren'}</Button><form action={setShortLinkActiveAction}><input type="hidden" name="code" value={record.code}/><input type="hidden" name="revision" value={record.revision??''}/><input type="hidden" name="active" value={String(!record.active)}/><Button type="submit" variant="outline" disabled={!enabled}>{record.active?'Deaktivieren':'Wieder aktivieren'}</Button></form></div>
        {editing===record.code&&<form action={updateShortLinkAction} className="space-y-4 rounded-lg border p-4"><input type="hidden" name="code" value={record.code}/><input type="hidden" name="revision" value={record.revision??''}/><p className="text-sm">Code und Kurzlink bleiben gleich. Name und Ziel werden für beide Domains geändert; der Zähler bleibt erhalten.</p><div className="space-y-2"><Label htmlFor={`edit-label-${record.code}`}>Name / Kampagne</Label><Input id={`edit-label-${record.code}`} name="label" defaultValue={record.label} maxLength={100} required/></div><div className="space-y-2"><Label htmlFor={`edit-target-${record.code}`}>HTTPS-Zieladresse</Label><Input id={`edit-target-${record.code}`} name="target" type="url" defaultValue={record.target} maxLength={2048} required/></div><div className="flex flex-wrap gap-3"><Button type="submit">Änderungen speichern</Button><Button type="button" variant="outline" onClick={()=>setEditing(null)}>Abbrechen</Button></div></form>}
        {deleting===record.code&&<form action={deleteShortLinkAction} className="space-y-4 rounded-lg border border-destructive p-4"><input type="hidden" name="code" value={record.code}/><input type="hidden" name="revision" value={record.revision??''}/><p className="text-sm">Dieser Kurzlink wird auf beiden Domains dauerhaft ungültig. Name, Ziel und Zähler werden entfernt; nur der Code bleibt privat gesperrt, damit er nie für ein anderes Ziel neu vergeben wird. Bereits verteilte Links funktionieren danach nicht mehr.</p><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="confirmDelete" value="yes" required className="mt-1"/><span>Ich möchte {record.code} endgültig löschen.</span></label><div className="flex flex-wrap gap-3"><Button type="submit" variant="destructive">Endgültig löschen</Button><Button type="button" variant="outline" onClick={()=>setDeleting(null)}>Abbrechen</Button></div></form>}
      </article>)}</div>
    </section>
  </div>;
}
