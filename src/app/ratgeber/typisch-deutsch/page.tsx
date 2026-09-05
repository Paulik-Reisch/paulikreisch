import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gamepad2, ArrowRight, Sparkles, Gift, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Typisch deutsch: Die 12 Eigenheiten-Kapitel | Paulik & Reisch",
  description: "Typisch deutsch erklärt: Pünktlichkeit, Baustellen, Karneval, Feierabend & 8 weitere Eigenheiten — satirisch analysiert von zwei deutschen Autoren.",
  keywords: ["typisch deutsch","deutsche eigenheiten","deutsche klischees","eigentümlichkeiten deutsche","warum deutsche pünktlich","deutsche baustellen","karneval erklärung","feierabend kultur","deutsche im urlaub","grillfleisch eskalation"],
  alternates: { canonical: "/ratgeber/typisch-deutsch" },
  openGraph: {
    title: "Typisch deutsch: Die 12 Eigenheiten-Kapitel",
    description: "Typisch deutsch erklärt: Pünktlichkeit, Baustellen, Karneval, Feierabend & 8 weitere Eigenheiten — satirisch analysiert von zwei deutschen Autoren.",
    url: "https://paulikreisch.de/ratgeber/typisch-deutsch",
    siteName: "Paulik & Reisch",
    locale: "de_DE",
    type: "article",
    images: [{ url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7", width: 1200, height: 630, alt: "Typisch deutsch: Die 12 Eigenheiten-Kapitel" }],
  },
  twitter: { card: "summary_large_image", title: "Typisch deutsch: Die 12 Eigenheiten-Kapitel", description: "Typisch deutsch erklärt: Pünktlichkeit, Baustellen, Karneval, Feierabend & 8 weitere Eigenheiten — satirisch analysiert von zwei deutschen Autoren.", images: ["https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"] },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "Was ist typisch deutsch?", "acceptedAnswer": {"@type": "Answer", "text": "Als typisch deutsch gelten vor allem: Pünktlichkeit als Tugend, Regeltreue als Charaktereigenschaft, die Feierabend-Kultur, detaillierte Planungssicherheit (auch im Urlaub), Kartoffel- und Brotvielfalt, ein komplexes Verhältnis zu Small Talk, Karneval als kontrollierter Kontrollverlust und die Baustelle als Dauergefährtin des Alltags. Wichtig: Klischees mit Selbstironik lesen — Deutschsein ist weniger eine Eigenschaft als eine Haltung."}},
    {"@type": "Question", "name": "Sind Deutsche wirklich so pünktlich?", "acceptedAnswer": {"@type": "Answer", "text": "Studien und Umfragen bestätigen: Pünktlichkeit gilt in Deutschland als eine der höchsten sozialen Tugenden — 'fünf Minuten vor der Zeit ist des Deutschen Pünktlichkeit'. Die Ausnahme bildet die Bahn, die ausgerechnet im Land der Pünktlichkeit zur bundesweiten Entschuldigungsanstalt wurde."}},
    {"@type": "Question", "name": "Warum dauern deutsche Baustellen so lange?", "acceptedAnswer": {"@type": "Answer", "text": "Wegen des perfekten Sturms aus Genehmigungsverfahren, Planungstiefe, Vergaberecht, Bürgerbeteiligung und Fachkräftemangel. Jede Baustelle ist ein Kleinprojekt mit Behördenbeteiligung — und Behördenprozesse folgen eigenen Zeitgesetzen. Die Autobahn-Raststätte, die drei Jahre „bis Herbst“ dauert, ist kein Versagen, sondern deutsches Projektmanagement in Reinform."}},
    {"@type": "Question", "name": "Was ist der Feierabend?", "acceptedAnswer": {"@type": "Answer", "text": "Der Feierabend ist die deutsche Erfindung des kontrollierten Tagesabschlusses: eine legal geschützte Auszeit, die nicht 'nach der Arbeit' heißt, sondern einen eigenen Namen trägt — inklusive Feierabendbier, Feierabendverkehr und Feierabendverhalten. Kaum eine andere Sprache hat dem Ende des Arbeitstages ein eigenes Wort und Kult-Status gegeben."}},
    {"@type": "Question", "name": "Warum reservieren Deutsche Urlaubsliegen mit Handtüchern?", "acceptedAnswer": {"@type": "Answer", "text": "Die Handtuchreservierung ist die perfekte Symbiose aus Planungssicherheit und Besitzanspruch: Der Deutsche plant den Urlaubstag wie ein Projekt und sichert Ressourcen frühzeitig — Ressourcen, die er dann mit deutscher Gewissenhaftigkeit um 7:00 Uhr morgens reserviert, bevor alle anderen wach sind. Soziales Erstaunen international, Logik innen vollkommen schlüssig."}},
    {"@type": "Question", "name": "Was macht Karneval typisch deutsch?", "acceptedAnswer": {"@type": "Answer", "text": "Karneval (v. a. im Rheinland) ist die deutsche Kunstform des terminlich geplanten Kontrollverlusts: fünf Tage Ausnahmezustand, exakt terminiert (11.11., 11:11 Uhr), mit Sitzordnung, Protokoll und Ordensjudikatur. Nirgendwo sonst wird Chaos so diszipliniert organisiert."}}
  ]
};

export default function Page(){
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
<Header/><main className="flex-1">
<div className="container px-4 md:px-6 py-8"><nav className="text-xs text-muted-foreground mb-4 flex gap-1.5 flex-wrap"><Link href="/" className="hover:underline">Home</Link><span>/</span><Link href="/ratgeber" className="hover:underline">Ratgeber</Link><span>/</span><span className="text-foreground font-medium">typisch-deutsch</span></nav><div className="max-w-3xl"><Badge variant="secondary" className="mb-3">Ratgeber · Paulik & Reisch</Badge><h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-balance">Typisch deutsch: Die 12 Eigenheiten-Kapitel</h1><p className="mt-4 text-lg text-muted-foreground leading-relaxed">Typisch deutsch erklärt: Pünktlichkeit, Baustellen, Karneval, Feierabend &amp; 8 weitere Eigenheiten — satirisch analysiert von zwei deutschen Autoren.</p><div className="mt-6 flex flex-wrap gap-2"><Link href="/shop"><Button>Buch entdecken — 10,99 € <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/worthaft"><Button variant="outline"><Gamepad2 className="mr-2 h-4 w-4"/> Worthaft spielen</Button></Link><Link href="/checkliste"><Button variant="ghost"><FileText className="mr-2 h-4 w-4"/> Checkliste PDF</Button></Link></div></div></div>
<div className="container px-4 md:px-6 pb-4"><div className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/15 dark:border-amber-900/30 p-4 md:p-5 flex gap-4 items-start max-w-3xl"><img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484" alt="Hallo Welt Cover" className="w-14 h-20 object-cover rounded-md shadow-sm shrink-0" loading="lazy"/><div className="flex-1 min-w-0"><p className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span> Aus dem Buch — 106 Seiten, 4.8★</p><p className="text-sm md:text-[15px] leading-snug font-medium mt-1">Diese Szene stammt aus <em>Hallo Welt</em> — dort geht es noch tiefer in den Wahnsinn. 10,99 € statt 20,99 € bis Monatsende.</p><Link href="/shop" className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-primary hover:underline">Hier weiterlesen — 10,99 € auf Amazon →</Link></div></div></div>
<article className="container px-4 md:px-6 pb-10 max-w-3xl prose prose-zinc dark:prose-invert lg:prose-lg prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80">
<div dangerouslySetInnerHTML={{__html: `<blockquote>
<p><strong>Kennzeichnung:</strong> Kultur-Fakten: echt. Selbstironie: gewollt. Zwei deutsche Autoren analysieren ihr eigenes Volk — das dürfen nur wir, und genau deshalb ist es lustig. <a href="/shop">Unsere Bücher</a> sind im Kern ein produktspezifischer Auszug dieses Phänomens.</p>
</blockquote>
<h1>Typisch deutsch: Das Field Guide in 12 Kapiteln</h1>
<p><strong>Vom Pünktlichkeitswahn über die Baustellen-Romantik bis zur Grillfleisch-Eskalation — die wissenschaftlich-satirische Anleitung zum Verständnis der Deutschen. Von innen.</strong></p>
<hr>
<h2>TL;DR — das Wichtigste in 30 Sekunden</h2>
<p>„Typisch deutsch&quot; ist weniger eine Nationalität als ein Betriebssystem: <strong>Pünktlichkeit</strong> als Tugend (die Bahn als einzige lizenzierte Ausnahme), <strong>Regeltreue</strong> bis in die Rot-Ampel-Nachtsituation, der <strong>Feierabend</strong> als rechtlich wie emotional geschütztes Heiligtum, <strong>Baustellen</strong> als Dauergefährten mit eigener Raumzeit, <strong>Karneval</strong> als terminierter Kontrollverlust, <strong>Urlaub</strong> als logistische Meisterleistung mit Handtuch-Reservierung, <strong>Grillen</strong> als Wetteifer in Wurstform, <strong>Wetter</strong> als unerschöpfliches Gesprächsthema, <strong>Brot</strong> als Religion mit 3.000+ Sorten, <strong>Datenliebhaberei</strong>, <strong>Versicherungsliebe</strong> und <strong>das Jammern</strong> als erlaubte Dauerhaltung (sofern niemand es ändern soll). Auf dieser Seite: alle 12 Kapitel, jeweils mit der ernsthaften Erklärung und dem ehrlichen Lacher. Und zwei Bonus-Kapiteln aus unserer Satire-Werkstatt (Baustellen &amp; Karneval — unten verlinkt).</p>
<p><em>Inhalt: 12 Kapitel + FAQ + Lesetipps</em></p>
<hr>
<h2>Kapitel 1: Die Pünktlichkeit (die Tugend mit Ausnahmebetrieb)</h2>
<p><strong>Kurzantwort:</strong> Pünktlichkeit gilt in Deutschland als eine der höchsten sozialen Tugenden — „fünf Minuten vor der Zeit ist des Deutschen Pünktlichkeit&quot;. Die einzige lizenzierte Ausnahme ist die Bahn, die ausgerechnet im Land der Pünktlichkeit zur nationalen Entschuldigungsanstalt wurde.</p>
<p>Die Regeln der deutschen Uhr: 5 Minuten zu früh = pünktlich. Pünktlich = die Zugabe hat jemand verdient. 5 Minuten zu spät = eine Entschuldigung in Satzform. 15 Minuten zu spät = ein Verhältnis ist beschädigt. Und: Der Deutsche wartet nicht „noch kurz&quot; — er wartet mit Blick auf die Uhr und wachsender innerer Bilanz.</p>
<h2>Kapitel 2: Die Regeltreue (das grüne Licht der Nacht)</h2>
<p><strong>Kurzantwort:</strong> Deutsche Regeltreue ist weltberühmt: Regeln werden befolgt, auch wenn niemand zuschaut — die rot leuchtende Ampel um 3 Uhr nachts an einer leeren Kreuzung ist ihr Heiligtum. Erklärung: Regeln gelten als Garant für Fairness und Berechenbarkeit, nicht als Bevormundung.</p>
<p>Die Psychologie dahinter: Die Regel ist ein Vertrag mit allen anderen. Wer sie bricht, bricht ihn mit jedem. Deshalb ist das Überfahren der roten Ampel nachts nicht „praktisch&quot;, sondern ein Mikro-Angriff auf die Zivilisation. (Wir übertreiben. Aber nur leicht. Willkommen in Deutschland.)</p>
<h2>Kapitel 3: Der Feierabend (das Heiligtum mit Uhrzeit)</h2>
<p><strong>Kurzantwort:</strong> Der Feierabend ist die deutsche Erfindung des ritualisierten Tagesabschlusses — ein eigenes Wort, ein eigener Kult: Feierabendbier, Feierabendverkehr, Feierabendruf. Andere Sprachen haben dafür nur „nach der Arbeit&quot;. Deutsch hat dafür eine Lebensphase.</p>
<h2>Kapitel 4: Die Baustelle (der ewige Begleiter)</h2>
<p><strong>Kurzantwort:</strong> Deutsche Baustellen dauern lange, weil sie Kleinprojekte mit voller Behördenbeteiligung sind: Genehmigungen, Vergaberecht, Planungstiefe, Bürgerbeteiligung. Der Witz ist alt, aber die Baustelle ist älter — und bleibt. Siehe unser ausführliches Kapitel unten.</p>
<p><strong>Unser Best-of zu diesem Thema:</strong> <a href="/a/bis-dass-der-bagger-uns-scheidet">Bis dass der Bagger uns scheidet: Warum deutsche Baustellen länger halten als die meisten Beziehungen</a> — die großartigste deutsch-türkische Liebeserklärung an die Dauerbaustelle. <em>(Dieser Artikel ist Teil dieses Hubs — das perfekte Beispiel dafür, wie Satire-Artikel und Ratgeber sich gegenseitig stärken.)</em></p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/typisch-deutsch/baustellen-dauer/">Warum deutsche Baustellen so lange dauern (die ehrliche Antwort)</a></p>
<h2>Kapitel 5: Der Karneval (der terminierte Kontrollverlust)</h2>
<p><strong>Kurzantwort:</strong> Karneval — vor allem rheinisch — ist die deutsche Kunstform des geplanten Ausnahmezustands: exakt terminiert (11.11., 11:11 Uhr), mit Sitzordnung, Protokoll und Ordensvergabe. Nirgendwo wird Chaos disziplinierter organisiert.</p>
<p><strong>Unser Best-of:</strong> <a href="/a/karnevalshasser-gewinnt-kostuemwettbewerb-versehentlich">Genialer Trick: Karnevalshasser verkleidet sich als „schlecht gelaunter Spießer&quot; und gewinnt Kostümwettbewerb</a> — die einzige Strategie, das Fest zu überleben, ohne teilzunehmen.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/typisch-deutsch/karneval-erklaerung/">Karneval verstehen: Sitzordnung, Kamelle, die 11</a></p>
<h2>Kapitel 6: Der Urlaub (das logistische Meisterwerk)</h2>
<p><strong>Kurzantwort:</strong> Deutsche Urlaubsplanung ist Projektmanagement: früh gebucht, durchgeplant, mit Handtuch-Reservierung am Pool (international gefürchtet) und Reiseführer-Exegese. Der Urlaub ist kein Ausbruch aus dem System — er ist das System, nur mit Sonne.</p>
<h2>Kapitel 7: Das Grillen (die Wurst-Weltmeisterschaft)</h2>
<p><strong>Kurzantwort:</strong> Deutsches Grillen ist Wettbewerb in Wurstform: Die Wurstwahl (Bratwurst vs. Steak) ist Standortbestimmung, die Kohlenfrage ein Weltbild, die Zangenübergabe ein Akt des Vertrauens. „Mann am Grill&quot; ist keine Beschreibung, es ist ein Amt.</p>
<h2>Kapitel 8: Das Wetter (das unerschöpfliche Gespräch)</h2>
<p><strong>Kurzantwort:</strong> Das Wetter ist Deutschlands offizielles Smalltalk-Betriebssystem: verfügbar, neutral, endlos. Es kann über jede Wetterlage gesprochen werden — zu heiß, zu kalt, zu nass, zu trocken — und zwar in jeder Kombination. Das Jammern ist nicht negativ, es ist sozialer Kitt.</p>
<h2>Kapitel 9: Das Brot (die Religion mit 3.000+ Sorten)</h2>
<p><strong>Kurzantwort:</strong> Deutschland hat über 3.000 registrierte Brotsorten und eine Bäcker-Dichte, die jede andere Nation als Grundversorgung missverstehen würde. Das Brot ist kein Lebensmittel, es ist Heimat in Scheibenform. Wer im Ausland „deutsches Brot&quot; sucht, sucht eigentlich nach Hause.</p>
<h2>Kapitel 10: Die Versicherungen (die Vorsorge als Lebenseinstellung)</h2>
<p><strong>Kurzantwort:</strong> Deutschland ist Weltmeister der Absicherung: Hausrat, Haftpflicht, Rechtsschutz, Zahnzusatz, Fahrrad — versichert wird, was existiert, und einiges, was es nicht tut. Die Versicherung ist das finanzielle Äquivalent des Sicherheitsgurts: Man hofft, sie nie zu brauchen, und schläft besser, weil man sie hat.</p>
<h2>Kapitel 11: Die Datenliebe (der Plan als Persönlichkeit)</h2>
<p><strong>Kurzantwort:</strong> Deutsche lieben Listen, Statistiken und Pläne: der Haushaltsplan, der Jahresurlaubsplan, die Einkaufsliste mit Spalten. Der Plan ist kein Zwang — er ist die Erlaubnis, im Moment zu leben, weil der Moment verplant ist.</p>
<h2>Kapitel 12: Das Jammern (die hohe Kunst)</h2>
<p><strong>Kurzantwort:</strong> Deutsches Jammern ist kein Pessimismus, sondern ein soziales Ritual: Man beklagt gemeinsam, was man (oft zu Recht) nicht ändern kann — Bahn, Wetter, Bürokratie —, und genau dieses Miteinander-Beklagen schafft Nähe. Lamentieren als Beziehungsarbeit. (Titel unseres nächsten Buches? Wir prüfen noch.)</p>
<hr>
<h2>Häufige Fragen</h2>
<p><em>(FAQ-Inhalte 1:1 aus dem JSON-LD-Block oben rendern.)</em></p>
<hr>
<h2>CTA: Typisch deutsch, typisch wir</h2>
<p>Schule, Bürokratie, Baustellen, Karneval — „typisch deutsch&quot; ist das Kerngeschäft unserer Bücher: <strong>„Hallo Welt&quot;</strong> (die deutsche Schule als Institution) und <strong>„Hallo Welt 2&quot;</strong> (das deutsche Leben als Formular). 5,0 Sterne. Deutschland in 2 Bänden.</p>
<p><strong><a href="/shop">→ Zur Bücherübersicht</a></strong> · <strong><a href="/#newsletter">Newsletter: 1×/Woche deutsche Zustände</a></strong> · <strong><a href="/worthaft">Täglich Worthaft</a></strong></p>
<hr>
<p><em>Geschrieben von <strong>Philipp Paulik &amp; Maximilian Reisch</strong> — zwei Deutsche, die ihr eigenes Volk von innen erforschen (teilnehmende Beobachtung seit Geburt). <a href="/ueber/philipp-paulik">Über die Autoren</a></em></p>
<hr>
<h2>🗂️ CLUSTER-PLAN für Pillar 9 (12 Stück)</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Cluster-URL (<code>/ratgeber/typisch-deutsch/…</code>)</th>
<th>Fokus-Keyword</th>
<th>Priorität</th>
</tr>
</thead>
<tbody><tr>
<td>9.1</td>
<td><code>baustellen-dauer</code></td>
<td>warum baustellen so lange dauern</td>
<td>⭐⭐⭐ (+ /a-Artikel als Cluster!)</td>
</tr>
<tr>
<td>9.2</td>
<td><code>karneval-erklaerung</code></td>
<td>karneval erklärung / was ist karneval</td>
<td>⭐⭐⭐ (+ /a-Artikel!)</td>
</tr>
<tr>
<td>9.3</td>
<td><code>puenktlichkeit</code></td>
<td>warum deutsche pünktlich</td>
<td>⭐⭐ (AEO!)</td>
</tr>
<tr>
<td>9.4</td>
<td><code>feierabend-kultur</code></td>
<td>feierabend bedeutung kultur</td>
<td>⭐⭐ (AEO!)</td>
</tr>
<tr>
<td>9.5</td>
<td><code>urlaub-handtuch</code></td>
<td>handtuch reservieren urlaub</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>9.6</td>
<td><code>grillfleisch-eskalation</code></td>
<td>grillen typisch deutsch</td>
<td>⭐</td>
</tr>
<tr>
<td>9.7</td>
<td><code>deutsche-brot-sorten</code></td>
<td>deutsche brotsorten</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>9.8</td>
<td><code>wetter-smalltalk</code></td>
<td>small talk wetter deutschland</td>
<td>⭐</td>
</tr>
<tr>
<td>9.9</td>
<td><code>deutsche-im-ausland</code></td>
<td>deutsche im urlaub klischees</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>9.10</td>
<td><code>regeln-ampe-inacht</code></td>
<td>rote ampel nachts / regeltreue</td>
<td>⭐ (AEO-Kurios)</td>
</tr>
<tr>
<td>9.11</td>
<td><code>versicherungen-deutschland</code></td>
<td>warum deutsche so viele versicherungen</td>
<td>⭐</td>
</tr>
<tr>
<td>9.12</td>
<td><code>sonntagsruhe</code></td>
<td>sonntagsruhe regeln</td>
<td>⭐⭐ (AEO!)</td>
</tr>
</tbody></table>
<h2>🎣 PROMO-HOOKS</h2>
<ol>
<li><strong>Neugier:</strong> „Typisch deutsch in 12 Kapiteln — von zwei Autoren, die mitten drin leben (leider).&quot;</li>
<li><strong>Schmerz:</strong> „Warum deutsche Baustellen länger halten als Beziehungen — die ehrliche Antwort.&quot;</li>
<li><strong>Brand:</strong> „Wir haben unser eigenes Volk analysiert. Ergebnis: ein Buch und dieses Field Guide.&quot;</li>
</ol>
<h2>🔗 VERLINKUNGS-PFLICHTEN</h2>
<ul>
<li><strong>Lateral:</strong> <code>/a/bis-dass-der-bagger-uns-scheidet</code> + <code>/a/karnevalshasser-…</code> (bestehende Artikel EINBINDEN — sie werden dadurch Cluster!), <code>/ratgeber/beamtendeutsch/</code>, <code>/ratgeber/deutsche-sprache/</code>, <code>/ratgeber/etikette/</code>, <code>/ratgeber/satire-schreiben/</code>.</li>
<li><strong>CTA:</strong> /shop, Newsletter, Worthaft.</li>
<li><strong>Bottom-up:</strong> alle Cluster → hierher.</li>
</ul>
`}} />
</article>
<div className="container px-4 md:px-6 pb-6 max-w-3xl"><div className="not-prose mt-4 grid sm:grid-cols-2 gap-3"><Card className="border-primary/20 bg-primary/5"><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Gift className="h-4 w-4"/> Gratis-Kapitel</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Hol dir das Checkliste-PDF + Leseprobe — 0 €, sofort.<Link href="/checkliste" className="block mt-3"><Button size="sm" className="w-full">Checkliste holen</Button></Link></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Gamepad2 className="h-4 w-4"/> Worthaft Daily</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Ein Wort, 6 Versuche, täglich neu.<Link href="/worthaft" className="block mt-3"><Button size="sm" variant="outline" className="w-full">Jetzt spielen</Button></Link></CardContent></Card></div></div>
<div className="container px-4 md:px-6 pb-10"><div className="max-w-3xl"><h2 className="font-headline text-2xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Mehr aus dem Ratgeber</h2><div className="mt-4 grid sm:grid-cols-2 gap-3">
<Link href="/ratgeber/satire-schreiben" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Satire schreiben</div><div className="text-xs text-muted-foreground mt-1">Merkmale, Stilmittel & Anleitung</div></Link>
<Link href="/ratgeber/zeugnissprache" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Zeugnissprache</div><div className="text-xs text-muted-foreground mt-1">40 Geheimcodes entziffert</div></Link>
<Link href="/ratgeber/geschenk-lehrer" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Geschenk für Lehrer</div><div className="text-xs text-muted-foreground mt-1">27 Ideen die ankommen</div></Link>
<Link href="/ratgeber/etikette" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Etikette heute</div><div className="text-xs text-muted-foreground mt-1">Benimm-Regeln die zählen</div></Link>
</div><div className="mt-6 flex flex-wrap gap-2 text-xs"><Link href="/ratgeber" className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 hover:bg-muted"><BookOpen className="h-3.5 w-3.5"/> Alle Ratgeber</Link><Link href="/shop" className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1.5 font-semibold">Buch — 10,99 €</Link></div></div></div>
</main><Footer/></>);
}
