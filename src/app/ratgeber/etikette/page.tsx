import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gamepad2, ArrowRight, Sparkles, Gift, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Etikette heute: Die Benimm-Regeln, die zählen | Paulik & Reisch",
  description: "Etikette heute verständlich: welche Benimm-Regeln noch gelten, welche gestorben sind — Tisch, Begrüßung, Handy, Restaurant. Der Knigge-Guide mit Augenzwinkern.",
  keywords: ["etikette regeln","benimm regeln","knigge","tischmanieren","suppe löffeln etikette","handy am tisch","sie oder du","handschlag richtig","restaurant wer zahlt","gastgeschenk"],
  alternates: { canonical: "/ratgeber/etikette" },
  openGraph: {
    title: "Etikette heute: Die Benimm-Regeln, die zählen",
    description: "Etikette heute verständlich: welche Benimm-Regeln noch gelten, welche gestorben sind — Tisch, Begrüßung, Handy, Restaurant. Der Knigge-Guide mit Augenzwink",
    url: "https://paulikreisch.de/ratgeber/etikette",
    siteName: "Paulik & Reisch",
    locale: "de_DE",
    type: "article",
    images: [{ url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7", width: 1200, height: 630, alt: "Etikette heute: Die Benimm-Regeln, die zählen" }],
  },
  twitter: { card: "summary_large_image", title: "Etikette heute: Die Benimm-Regeln, die zählen", description: "Etikette heute verständlich: welche Benimm-Regeln noch gelten, welche gestorben sind — Tisch, Begrüßung, Handy, Restaurant. Der Knigge-Guide mit Augenzwink", images: ["https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"] },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "Was ist Etikette?", "acceptedAnswer": {"@type": "Answer", "text": "Etikette ist der ungeschriebene (und teils geschriebene) Verhaltenskodex für soziale Situationen: Regeln für Begrüßung, Tisch, Kleidung und Kommunikation, die signalisieren: Ich respektiere dich und den Rahmen. Moderne Etikette ist keine Steifheit, sondern Rücksicht in strukturierter Form — die Kernregel lautet seit Knigge-Zeiten unverändert: Frag nie auffälliger als nötig, störe nie lauter als unvermeidbar."}},
    {"@type": "Question", "name": "Was ist der Knigge?", "acceptedAnswer": {"@type": "Answer", "text": "Adolf Freiherr von Knigge veröffentlichte 1788 'Über den Umgang mit Menschen' — ein Buch über soziale Kompetenz, nicht über Tischregeln. Der echte Knigge war ein Aufklärer, der Empathie lehrte; der heutige Begriff 'Knigge' als Synonym für Benimm-Regeln ist eine spätere Umdeutung. Sein Kernprinzip: Behandle jeden so, wie es dessen Situation und Würde verlangt."}},
    {"@type": "Question", "name": "Wie löffelt man Suppe richtig?", "acceptedAnswer": {"@type": "Answer", "text": "Suppe wird vom Körper weg nach außen geschöpft (in Deutschland üblich), der Löffel wird am Mundrand angesetzt, nicht eingesogen, und Suppe wird nicht geblasen — falls sie heiß ist: warten. Reste dürfen in gehobener Etikette schräg gehalten geschöpft werden; die extreme Variante (Teller anheben) gilt als zweite Liga der Lebenskunst. Für die ausführliche Abrechnung siehe unseren berühmten Suppen-Artikel."}},
    {"@type": "Question", "name": "Darf das Handy auf den Tisch?", "acceptedAnswer": {"@type": "Answer", "text": "Beim Essen mit anderen: nein — das Handy auf dem Tisch signalisiert 'Ich erwarte Wichtigeres als dich'. Ausnahme: Ankündigung ('Ich warte auf einen wichtigen Anruf, entschuldigt'). Moderne Realität: Es steht trotzdem überall auf dem Tisch. Moderne Etikette: Bildschirm nach unten ist der minimale symbolische Respekt."}},
    {"@type": "Question", "name": "Sie oder du — wer bietet was an?", "acceptedAnswer": {"@type": "Answer", "text": "Grundregel: Das höherrangige, ältere oder einladende Angebot zählt (Chefin bietet an, Gastgeber bietet an). Übergänge heute deutlich früher und lockerer, aber im Beruf bleibt das Sie die sichere Standardwahl — geduzt wird auf Angebot, nicht auf Verdacht. Und: Das Angebot zum Du ist eine Einladung, kein Befehl."}},
    {"@type": "Question", "name": "Wer zahlt im Restaurant?", "acceptedAnswer": {"@type": "Answer", "text": "Einladender zahlt (wer lädt, lädt ein — 'Ich lade dich ein' sagt es), ansonsten getrennt zahlen ist in Deutschland völlig etabliert und in größeren Runden die Norm. Streitpunkt aus der Steinzeit der Etikette: Frauen automatisch zu bewirten — heute gilt: zahlen die Personen, die eingeladen haben oder den Wunsch dazu haben. Der Rest ist Mathematik mit Trinkgeld."}}
  ]
};

export default function Page(){
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
<Header/><main className="flex-1">
<div className="container px-4 md:px-6 py-8"><nav className="text-xs text-muted-foreground mb-4 flex gap-1.5 flex-wrap"><Link href="/" className="hover:underline">Home</Link><span>/</span><Link href="/ratgeber" className="hover:underline">Ratgeber</Link><span>/</span><span className="text-foreground font-medium">etikette</span></nav><div className="max-w-3xl"><Badge variant="secondary" className="mb-3">Ratgeber · Paulik & Reisch</Badge><h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-balance">Etikette heute: Die Benimm-Regeln, die zählen</h1><p className="mt-4 text-lg text-muted-foreground leading-relaxed">Etikette heute verständlich: welche Benimm-Regeln noch gelten, welche gestorben sind — Tisch, Begrüßung, Handy, Restaurant. Der Knigge-Guide mit Augenzwinkern.</p><div className="mt-6 flex flex-wrap gap-2"><Link href="/shop"><Button>Buch entdecken — 10,99 € <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/worthaft"><Button variant="outline"><Gamepad2 className="mr-2 h-4 w-4"/> Worthaft spielen</Button></Link><Link href="/checkliste"><Button variant="ghost"><FileText className="mr-2 h-4 w-4"/> Checkliste PDF</Button></Link></div></div></div>
<div className="container px-4 md:px-6 pb-4"><div className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/15 dark:border-amber-900/30 p-4 md:p-5 flex gap-4 items-start max-w-3xl"><img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484" alt="Hallo Welt Cover" className="w-14 h-20 object-cover rounded-md shadow-sm shrink-0" loading="lazy"/><div className="flex-1 min-w-0"><p className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span> Aus dem Buch — 106 Seiten, 4.8★</p><p className="text-sm md:text-[15px] leading-snug font-medium mt-1">Diese Szene stammt aus <em>Hallo Welt</em> — dort geht es noch tiefer in den Wahnsinn. 10,99 € statt 20,99 € bis Monatsende.</p><Link href="/shop" className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-primary hover:underline">Hier weiterlesen — 10,99 € auf Amazon →</Link></div></div></div>
<article className="container px-4 md:px-6 pb-10 max-w-3xl prose prose-zinc dark:prose-invert lg:prose-lg prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80">
<div dangerouslySetInnerHTML={{__html: `<blockquote>
<p><strong>Kennzeichnung:</strong> Etikette-Fakten: echt (Knigge 1788, Tischregeln, internationale Codes). Ton: Satire. Unsere berühmte Vorarbeit: <a href="/a/suppe-richtig-loeffeln-etikette">„Wie löffelt man die Suppe richtig aus?&quot;</a> — der meistkommentierte Etikette-Text unseres Magazins.</p>
</blockquote>
<h1>Etikette heute: Die Benimm-Regeln, die überlebt haben</h1>
<p><strong>Was vom Knigge übrig blieb — und warum moderne Benimm-Regeln keine Steifheit, sondern organisierte Rücksicht sind. Der große Guide durch Tisch, Begrüßung, Handy-Zeiten und alle Fragen, die Sie nie zu stellen wagten.</strong></p>
<hr>
<h2>TL;DR — das Wichtigste in 30 Sekunden</h2>
<p>Etikette ist die strukturierte Form von Rücksicht — und viel weniger tot als gedacht: <strong>Tischregeln</strong> leben (Suppe vom Körper weg schöpfen, Handy vom Tisch), <strong>Begrüßungsregeln</strong> wandeln sich (Händedruck ja — aber richtig: fest, trocken, 2 Sekunden), <strong>das Sie/Du-System</strong> bleibt im Beruf Standard mit früheren Übergängen, <strong>Restaurant-Zahlen</strong> ist in Deutschland glücklich gelöst (getrennt zahlen ist Normalität), und der originale <strong>Knigge von 1788</strong> war kein Regel-Liebhaber, sondern ein Empathie-Lehrer — die Tischregeln-Hoheit wurde ihm später angedichtet. Auf dieser Seite: alle modernen Regeln kompakt, jede mit der ernsthaften Erklärung UND der satirischen Einordnung. Weil Benimm ohne Humor nur Steifheit ist. (Und weil Hummer auch ohne Benimm funktioniert.)</p>
<p><em>Inhalt: Was Etikette ist · Knigge-Wahrheit · Tisch · Begrüßung · Handy · Restaurant · Sie/Du · Gastgeschenk · Business · die 12 toten Regeln · FAQ</em></p>
<hr>
<h2>Was ist Etikette? (die ernsthafte Definition)</h2>
<p><strong>Kurzantwort:</strong> Etikette ist der Kodex für soziale Situationen: ein Set geteilter Erwartungen, das signalisiert „Ich respektiere dich und den Rahmen&quot;. Sie ist kulturabhängig, historisch gewachsen — und moderner als ihr Ruf, weil ihre Kernfunktion (Rücksicht organisieren) nie veraltet.</p>
<p>Die wichtigste Erkenntnis der modernen Etikette: <strong>Regeln sind Mittel, Respekt ist Zweck.</strong> Wer die Regeln kennt, kann sie souverän brechen; wer sie nicht kennt und bricht, wirkt nur unhöflich. Der Unterschied ist das Wissen. Genau dafür ist diese Seite da.</p>
<h2>Der wahre Knigge (eine Richtigstellung)</h2>
<p><strong>Kurzantwort:</strong> Adolf Freiherr von Knigge veröffentlichte 1788 „Über den Umgang mit Menschen&quot; — ein Buch über Menschenkenntnis und Empathie, nicht über Tischmanieren. Die Gleichsetzung „Knigge = Benimm-Regeln&quot; ist eine spätere Verkürzung durch nachfolgende Ratgeber-Generationen.</p>
<p>Der echte Knigge schrieb über den Umgang mit Stände, Charaktere und Situationen — ein Aufklärungswerk. Dass sein Name heute für Suppen-Löffel-Theorien steht, würde ihn vermutlich amüsieren (und uns bestätigen: die Geschichte liebt die Pointe). Das vielleicht zeitloseste Knigge-Prinzip: <strong>Passe dein Verhalten an den Menschen und die Situation an — nicht an ein Regelbuch.</strong> Alles andere auf dieser Seite sind nur Werkzeuge für dieses Prinzip.</p>
<h2>Tischmanieren (der Klassiker — inkl. Suppe)</h2>
<p><strong>Kurzantwort:</strong> Die wichtigsten Tischregeln: Gabel links, Messer rechts, Suppe wird vom Körper weg geschöpft und nicht geblasen, das Handy bleibt vom Tisch, Ellbogen haben Pause, und „guten Appetit&quot; wartet, bis alle bedient sind.</p>
<p>Die 7 Grundregeln: </p>
<ol>
<li><strong>Besteck:</strong> von außen nach innen arbeiten. Der Teller ist der Kreis, das Besteck die Zeitanzeige. </li>
<li><strong>Suppe:</strong> vom Körper weg schöpfen, am Mundrand ansetzen, nicht schlürfen. (Die komplette, liebevolle Abrechnung dieses Themas hat unser Magazin hier veröffentlicht: <a href="/a/suppe-richtig-loeffeln-etikette">Wie löffelt man die Suppe richtig aus?</a> — Pflichtlektüre dieses Hubs.) </li>
<li><strong>Handy:</strong> vom Tisch. Siehe eigenes Kapitel. </li>
<li><strong>Ellbogen:</strong> Bankettregel — Unterarme dürfen, Ellbogen nicht. Am Küchentisch gilt: normale Menschengröße. </li>
<li><strong>Warten:</strong> „Guten Appetit&quot; gilt erst, wenn alle ein Messer haben. </li>
<li><strong>Salz:</strong> erst probieren, dann salzen (klassische Bewerbungs-Etikette-Legende). </li>
<li><strong>Geschirr:</strong> Glas fasst man am Stiel, Tasse am Henkel — nicht, als wäre es ein Türknopf.</li>
</ol>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/etikette/tischmanieren-regeln/">Tischmanieren komplett: die 20 Regeln mit Erklärung</a> · <a href="/ratgeber/etikette/suppe-loeffeln-etikette/">Suppe löffeln: die komplette Wissenschaft</a></p>
<h2>Die Begrüßung (Händedruck, Umarmung, Küsschen-Protokoll)</h2>
<p><strong>Kurzantwort:</strong> Der richtige Händedruck: trocken, fest (nicht knetend), etwa 2 Sekunden, Blickkontakt, Name dazu. Die Umarmung gehört Freund:innen, das Begrüßungsküsschen Regionen und engsten Freund:innen — im Zweifel gilt: die Hand ist die sicherste Währung, das Nicken die leiseste.</p>
<p>Die 3-Kompetenz-Regeln: </p>
<ol>
<li><strong>Der Druck:</strong> fest heißt präsent, nicht „Ich trainiere seit Februar&quot;. </li>
<li><strong>Der Blick:</strong> in die Augen, nicht auf die Hand — die Hand findet sich allein. </li>
<li><strong>Die Initiative:</strong> Ranghohe/räumlich Gastgebende bietet zuerst die Hand — danach folgt man. (Neu: die Faust — Statussymbol der Jugend, Etikette-Frage der Zukunft.)</li>
</ol>
<h2>Das Handy (die moderne Etikette-Dauerschlacht)</h2>
<p><strong>Kurzantwort:</strong> Handy-Etikette 2026: Beim Essen mit anderen hat das Handy nichts auf dem Tisch verloren (Ausnahme: angekündigter Notfall). Beim Gespräch gilt: Das Gerät weglegen heißt „du hast meine Aufmerksamkeit&quot; — die umgekehrte Reihenfolge ist die unhöflichste Geste unserer Zeit.</p>
<p>Die aktuelle Normallage: Es liegt überall. Die Mindest-Etikette: Bildschirm nach unten · keine Nachrichten während des Gesprächs · Lautsprecher-Anrufe nur in einsamen Räumen · Kopfhörer raus beim Gespräch (beide. Besonders das linke.) · und beim gemeinsamen Fotos-Machen: erst fragen, dann posten.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/etikette/handy-etikette/">Handy-Etikette: die 12 Regeln, die heute gelten</a></p>
<h2>Restaurant: Wer zahlt, wer bestellt, wer zuerst isst</h2>
<p><strong>Kurzantwort:</strong> Wer einlädt, zahlt (und sagt das vorher). Getrennt zahlen ist in Deutschland voll etabliert und in Gruppen die Norm. Bestellen: die Gastgeberin beginnt, der Rang folgt, das Sondermenü erklärt man kurz. Trinkgeld: 5–10 %, gerundet nach oben, überreicht mit einem Satz.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/etikette/restaurant-knigge/">Restaurant-Knigge: bestellen, zahlen, trinkgeben — der komplette Guide</a></p>
<h2>Sie oder du (das Generationen-Brett)</h2>
<p><strong>Kurzantwort:</strong> Grundregel: das höherrangige, ältere oder einladende Angebot zählt. Im Beruf bleibt das Sie die Standardwahl, das Du wird angeboten (Chefin zuerst), nicht erobert. Nach dem Angebot gilt: sofort wechseln, nicht „Sie-Du-mischen&quot; — das ist die unbehaglichste Sprachform seit dem Genitiv.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/etikette/sie-oder-du/">Sie oder du: die komplette Entscheidungstabelle</a></p>
<h2>Das Gastgeschenk (die ewige Quizfrage)</h2>
<p><strong>Kurzantwort:</strong> Zum privaten Abendessen: etwas zum Verzehr (Wein, Pralinen, etwas Regionales) oder Persönliches (kleines Buch!). Blumen: überreicht, nicht geschenkt und im Treppenhaus — klassische Regel: nicht in Papier eingewickelt übergeben. Budget: 10–20 € ist die goldene Zone. (Kleines Buch gefällig? <a href="/shop">Wir haben eines.</a>)</p>
<p>Die No-Gos des Gastgeschenks: zu groß (erzeugt Gegenleistungszwang), zu intim (Parfum — siehe <a href="/ratgeber/geschenk-lehrer/">unseren Geschenk-Guide</a>, die Logik ist übertragbar), zu kreativ ohne Kontext (die eigene Dichtungsmappe).</p>
<h2>Business-Knigge (die Kurzfassung für das Berufsleben)</h2>
<p><strong>Kurzantwort:</strong> Business-Etikette in 6 Regeln: pünktlich sein (deutsche Kern-Tugend, siehe <a href="/ratgeber/typisch-deutsch/">Kapitel Pünktlichkeit</a>), Kleidung eine Stufe über der Erwartung, Handy weg im Meeting, Mails innerhalb von 24 Stunden, Kritik privat, Lob öffentlich — und: Der Name der Gegenüber ist das wichtigste Wort im Raum.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/etikette/business-knigge/">Business-Knigge: die 20 Regeln für Berufseinsteiger:innen</a></p>
<h2>Die 12 toten Regeln (Ruhet in Frieden)</h2>
<p><strong>Kurzantwort:</strong> Gestorbene oder sterbende Etikette-Regeln: Handschuhe beim Gruß, der Hut-Gruß, „Anstandswauwau&quot;-Logik, Frauen-zuerst-alles, der zinsschwere Besuchskarten-Tanz, die strikte Kleiderordnung ab 18 Uhr, das Verbot, Frauen die Rechnung zu überlassen — was bleibt, ist die Kern-Formel: Respekt ja, Rollenklischees nein.</p>
<p>Ein paar Traueranzeigen: <strong>Der Hutgruß</strong> (1900–1965, überlebt nur noch bei Königen). <strong>Die Besuchskarte mit Umschlag</strong> (1840–1990, ersetzt durch LinkedIn). <strong>„Die Dame zahlt nie&quot;</strong> (aufgelöst, glücklich, durch das Prinzip „Die einladende Person zahlt&quot;). <strong>Das Sonntagsruhe-Gebot fürs Handy</strong> (halbtot, verteidigt von der Generation Sonntagsruhe — siehe <a href="/ratgeber/typisch-deutsch/">unser Kapitel Sonntagsruhe</a>).</p>
<hr>
<h2>Häufige Fragen</h2>
<p><em>(FAQ-Inhalte 1:1 aus dem JSON-LD-Block oben rendern.)</em></p>
<hr>
<h2>CTA: Benimm für Menschen</h2>
<p>Etikette mit System und Pointe — das ist unser Kerngeschäft: <strong>„Hallo Welt&quot;</strong> (Benimm in der Lernvollzugsanstalt) und <strong>„Hallo Welt 2&quot;</strong> (Benimm gegenüber Ämtern und anderen Naturgewalten). 5,0 Sterne. Für alle, die höflich bleiben UND lachen wollen.</p>
<p><strong><a href="/shop">→ Zur Bücherübersicht</a></strong> · <strong><a href="/#newsletter">Newsletter: 1×/Woche Satire</a></strong> · <strong><a href="/worthaft">Täglich Worthaft</a></strong></p>
<hr>
<p><em>Geschrieben von <strong>Philipp Paulik &amp; Maximilian Reisch</strong> — geprüfte Tischmänner (Prüfung bestanden — Manieren: vorhanden, Taktgefühl: serienmäßig). <a href="/ueber/max-reisch">Über die Autoren</a></em></p>
<hr>
<h2>🗂️ CLUSTER-PLAN für Pillar 10 (12 Stück)</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Cluster-URL (<code>/ratgeber/etikette/…</code>)</th>
<th>Fokus-Keyword</th>
<th>Priorität</th>
</tr>
</thead>
<tbody><tr>
<td>10.1</td>
<td><code>suppe-loeffeln-etikette</code></td>
<td>suppe löffeln etikette</td>
<td>⭐⭐⭐ (bestehender Artikel als Basis!)</td>
</tr>
<tr>
<td>10.2</td>
<td><code>tischmanieren-regeln</code></td>
<td>tischmanieren regeln</td>
<td>⭐⭐⭐</td>
</tr>
<tr>
<td>10.3</td>
<td><code>handy-etikette</code></td>
<td>handy am tisch etikette</td>
<td>⭐⭐ (AEO!)</td>
</tr>
<tr>
<td>10.4</td>
<td><code>sie-oder-du</code></td>
<td>sie oder du regeln</td>
<td>⭐⭐⭐ (ewiges Volumen)</td>
</tr>
<tr>
<td>10.5</td>
<td><code>restaurant-knigge</code></td>
<td>restaurant knigge / wer zahhlt</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>10.6</td>
<td><code>gastgeschenk-regeln</code></td>
<td>gastgeschenk mitbringen</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>10.7</td>
<td><code>business-knigge</code></td>
<td>business knigge / beruf knigge</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>10.8</td>
<td><code>haendedruck-richtig</code></td>
<td>handschlag richtig</td>
<td>⭐</td>
</tr>
<tr>
<td>10.9</td>
<td><code>kleidung-dresscode</code></td>
<td>dresscode einladung</td>
<td>⭐</td>
</tr>
<tr>
<td>10.10</td>
<td><code>knigge-geschichte</code></td>
<td>knigge 1788 geschichte</td>
<td>⭐ (Referat-Keyword!)</td>
</tr>
<tr>
<td>10.11</td>
<td><code>trauer-etikette</code></td>
<td>kondolieren was sagen</td>
<td>⭐ (vorsichtig &amp; einfühlsam schreiben!)</td>
</tr>
<tr>
<td>10.12</td>
<td><code>internationale-etikette</code></td>
<td>etikette andere länder</td>
<td>⭐⭐</td>
</tr>
</tbody></table>
<h2>🎣 PROMO-HOOKS</h2>
<ol>
<li><strong>Neugier:</strong> „Die 12 toten Etikette-Regeln — und die 10, die für immer leben.&quot;</li>
<li><strong>Schmerz:</strong> „Du löffelst Suppe falsch. (Wir haben&#39;s dokumentiert.)&quot;</li>
<li><strong>Brand:</strong> „Knigge für Menschen, die Knigge-Bücher doof finden — von zwei Autoren mit Manieren.&quot;</li>
</ol>
<h2>🔗 VERLINKUNGS-PFLICHTEN</h2>
<ul>
<li><strong>Lateral:</strong> <code>/a/suppe-richtig-loeffeln-etikette</code> (Cluster-Verstärkung!), <code>/ratgeber/typisch-deutsch/</code> (Sonntagsruhe, Pünktlichkeit), <code>/ratgeber/geschenk-lehrer/</code> (Gastgeschenk-Logik), <code>/ratgeber/beamtendeutsch/</code> (förmliche Anrede), <code>/ratgeber/satire-schreiben/</code>.</li>
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
