import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Download, BookOpen, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { pageMetadata } from '@/lib/page-metadata';

const items = [
  { title: 'Morgens um 7:45 Anwesenheitspflicht', desc: 'Der Wecker klingelt, Du bist schon im Minus. Wer zu spät kommt, schreibt Entschuldigungen wie Liebesbriefe.' },
  { title: 'Hausaufgaben > Freizeit', desc: 'Wenn "kurz was für morgen" 3 Stunden frisst, ist das kein Lernen — das ist Vollzug.' },
  { title: 'Lehrer-Roboter Modus', desc: 'Noten statt Neugier, Vorschriften statt Verstehen. Der Unterricht läuft auf Autopilot.' },
  { title: 'Bürokratie-Bingo', desc: 'Anträge, Formulare, Stempel — Du brauchst einen Antrag, um einen Antrag zu stellen.' },
  { title: 'Noten = Selbstwert', desc: 'Eine Zahl entscheidet, ob Du "gut genug" bist. Spoiler: Du bist mehr als eine 3,2.' },
  { title: 'Flur = Gefängnishof', desc: 'Pausenaufsicht, Durchsagen, Türen die nur in eine Richtung aufgehen.' },
  { title: 'Pfeffer-Moment', desc: 'Jemand zitiert Regeln, die niemand versteht — und alle nicken. Willkommen im Theater.' },
  { title: 'To-Do ohne Ende', desc: 'Kaum fertig, kommt das nächste Arbeitsblatt. Erholung ist als Fehlzeit markiert.' },
  { title: 'Eigene Meinung = Risiko', desc: 'Wer kritisch fragt, bekommt Zusatzaufgaben. Satire ist hier Notwehr.' },
  { title: 'Du zählst die Tage', desc: 'Ferien als Lichtblick, nicht als Pause. Wenn Du nur auf den Gong wartest…' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Checkliste: 10 Anzeichen Lernvollzugsanstalt',
  description: 'Der humorvolle Selbsttest: Erkenne, ob Deine Schule eine Lernvollzugsanstalt ist. Gratis-PDF + Bonus-Kapitel aus Hallo Welt.',
  path: '/checkliste',
});

export default function ChecklistePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="container flex items-center justify-between py-3 px-4 md:px-6">
          <Link href="/" className="font-headline font-bold">Paulik &amp; Reisch</Link>
          <Link href="/shop"><Button size="sm" variant="outline">Zum Buch</Button></Link>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest text-primary uppercase">Gratis Checkliste · PDF</p>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold mt-2 text-balance">10 Anzeichen, dass Deine Schule eine <span className="text-primary">Lernvollzugsanstalt</span> ist</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Der humorvolle Selbsttest aus Hallo Welt — ankreuzen, schmunzeln, weitergeben. Inkl. Bonus-Kapitel aus dem Buch.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/checkliste-lernvollzugsanstalt.pdf" download>
                <Button size="lg" className="gap-2 font-bold"><Download className="h-4 w-4" /> PDF herunterladen (A4)</Button>
              </a>
              <Link href="/shop"><Button size="lg" variant="outline" className="gap-2">Buch entdecken <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Kein Mail-Zwang hier — aber im Artikel gibt's das PDF + Bonus per Mail.</p>
          </div>

          <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8" id="checkliste">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-lg">Selbsttest — einfach abhaken</h2>
              <span className="ml-auto text-xs text-muted-foreground">paulikreisch.de/checkliste</span>
            </div>
            <div className="grid gap-3">
              {items.map((it, i) => (
                <label key={i} className="flex gap-3 p-4 rounded-xl border bg-background hover:bg-muted/50 cursor-pointer group">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-input accent-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-primary">#{i + 1}</span>
                      <span className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">{it.title}</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">{it.desc}</p>
                  </div>
                  <Check className="h-5 w-5 text-muted-foreground/30 group-has-[input:checked]:text-green-500 shrink-0 mt-1" />
                </label>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border p-5 flex gap-4 items-center">
              <img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&amp;token=42ce90a3-ed34-49d2-8e09-5258d0dfc484" alt="Hallo Welt" className="w-16 h-20 object-cover rounded-md shadow shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-widest text-amber-700 dark:text-amber-300 uppercase">Was jetzt?</p>
                <p className="font-bold">Die ganze Abrechnung: Hallo Welt — 106 Seiten</p>
                <p className="text-xs text-muted-foreground mt-1">Kapitel 1–3 als Vorgeschmack per Mail, das komplette Buch für 10,99 € auf Amazon.</p>
              </div>
              <Link href="/shop" className="hidden sm:block"><Button size="sm" className="gap-2">Zum Shop <BookOpen className="h-4 w-4" /></Button></Link>
            </div>
            <div className="sm:hidden mt-4"><Link href="/shop" className="block"><Button size="sm" className="w-full gap-2">Zum Shop — 10,99 €</Button></Link></div>

            <p className="text-[11px] text-muted-foreground/60 text-center mt-6">© Paulik &amp; Reisch 2026 · Satire. Kein pädagogischer Ratgeber. Lachen auf eigene Gefahr.</p>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <a href="/checkliste-lernvollzugsanstalt.pdf" download><Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> PDF speichern</Button></a>
            <a href="/checkliste-lernvollzugsanstalt.pdf" target="_blank" className="inline-flex items-center gap-2 text-sm border rounded-md px-4 py-2 hover:bg-muted">Drucken / PDF öffnen</a>
          </div>
        </div>
      </main>
    </div>
  );
}
