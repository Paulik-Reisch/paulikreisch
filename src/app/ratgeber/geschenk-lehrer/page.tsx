import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gamepad2, ArrowRight, Sparkles, Gift, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Geschenk für Lehrer: 27 Ideen, die ankommen | Paulik & Reisch",
  description: "Geschenk für Lehrerinnen & Lehrer: 27 Ideen nach Anlass & Budget — inkl. Sprüchen für die Karte und den Regeln, was Lehrer wirklich annehmen dürfen.",
  keywords: ["geschenk lehrer","geschenkideen lehrer","abschiedsgeschenk lehrerin","danke geschenk lehrer","geschenk lehrerin von der klasse","was schenkt man lehrern","lehrer geschenk weihnachten","geschenk lehrer budget","dürfen lehrer geschenke annehmen"],
  alternates: { canonical: "/ratgeber/geschenk-lehrer" },
  openGraph: {
    title: "Geschenk für Lehrer: 27 Ideen, die ankommen",
    description: "Geschenk für Lehrerinnen & Lehrer: 27 Ideen nach Anlass & Budget — inkl. Sprüchen für die Karte und den Regeln, was Lehrer wirklich annehmen dürfen.",
    url: "https://paulikreisch.de/ratgeber/geschenk-lehrer",
    siteName: "Paulik & Reisch",
    locale: "de_DE",
    type: "article",
    images: [{ url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7", width: 1200, height: 630, alt: "Geschenk für Lehrer: 27 Ideen, die ankommen" }],
  },
  twitter: { card: "summary_large_image", title: "Geschenk für Lehrer: 27 Ideen, die ankommen", description: "Geschenk für Lehrerinnen & Lehrer: 27 Ideen nach Anlass & Budget — inkl. Sprüchen für die Karte und den Regeln, was Lehrer wirklich annehmen dürfen.", images: ["https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"] },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "Was schenkt man einer Lehrerin zum Abschied?", "acceptedAnswer": {"@type": "Answer", "text": "Zum Abschied funktionieren persönlichste Geschenke am besten: ein Buch mit Widmung der Klasse, eine Karte mit Handschriftzeilen jedes Kindes, ein Foto-Erinnerungsstück oder ein gemeinsames Klassengeschenk ab ca. 10–20 Euro pro Kind. Die 15. Tasse mit 'Beste Lehrerin' hingegen überlebt keinen Sommer."}},
    {"@type": "Question", "name": "Dürfen Lehrer Geschenke annehmen?", "acceptedAnswer": {"@type": "Answer", "text": "Kleine Aufmerksamkeiten sozialadäquater Art (Karte, Blume, Kuchen, kleiner Buch-Gutschein) sind überall unproblematisch. Bei verbeamteten Lehrkräften gelten strenge Regeln zur Vorteilsannahme (§ 331 StGB): wertvollere Geschenke können problematisch sein, viele Schulen haben eigene Obergrenzen. Faustregel: unter ca. 15–20 Euro pro Anlass ist man sicher — im Zweifel bei der Schulleitung nachfragen."}},
    {"@type": "Question", "name": "Wie viel Geld für ein Lehrergeschenk?", "acceptedAnswer": {"@type": "Answer", "text": "Einzeln: 5–15 Euro sind der unhinterfragte Korridor. Als Klasse gesammelt: oft 20–50 Euro pro Kind, gesammelt über die Elternvertretung — wichtig ist Transparenz (Liste, freiwillige Teilnahme) und dass nichts gegen den Willen einzelner Eltern läuft."}},
    {"@type": "Question", "name": "Was darf man einer Lehrerin NICHT schenken?", "acceptedAnswer": {"@type": "Answer", "text": "Vermeiden: Parfum und Kosmetik (zu intim), Kleidung (Größen-Dilemma), Alkohol (Dienstliche Grauzone, niemals vor Schülern überreichen), persönliche Elektronik, Witze-Geschenke ohne echte Beziehung zur Person — und alles, was die Lehrkraft dann 30-fach im Regal hat: Tassen, Kerzen, Bonbenschalen. Regel: Wenn es im Lehrerzimmer-Mittelfach landen könnte, Finger weg."}},
    {"@type": "Question", "name": "Braucht man ein Geschenk für den Lehrer überhaupt?", "acceptedAnswer": {"@type": "Answer", "text": "Nein — und das ist die gute Nachricht: Lehrkräfte freuen sich am meisten über Karte mit handschriftlichen Sätzen der Schüler:innen. Ein Geschenk ist Bonus, keine Pflicht. Wenn geschenkt wird, lieber klein, persönlich und mit liebevollem Anlass als groß und generisch."}},
    {"@type": "Question", "name": "Welches Buch schenkt man einer Lehrkraft?", "acceptedAnswer": {"@type": "Answer", "text": "Bücher funktionieren, wenn sie zur Person passen: für humorvolle Lehrkräfte z. B. die satirische Schul-Reihe 'Hallo Welt' von Paulik & Reisch (10,99 €, 5 Sterne) — ein Buch über den Schulalltag, geschrieben von zwei Überlebenden. Es funktioniert, weil es die Perspektive der Schüler:innen spiegelt: genau das, wofür Lehrer sich beruflich interessieren müssten."}}
  ]
};

export default function Page(){
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
<Header/><main className="flex-1">
<div className="container px-4 md:px-6 py-8"><nav className="text-xs text-muted-foreground mb-4 flex gap-1.5 flex-wrap"><Link href="/" className="hover:underline">Home</Link><span>/</span><Link href="/ratgeber" className="hover:underline">Ratgeber</Link><span>/</span><span className="text-foreground font-medium">geschenk-lehrer</span></nav><div className="max-w-3xl"><Badge variant="secondary" className="mb-3">Ratgeber · Paulik &amp; Reisch</Badge><h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-balance">Geschenk für Lehrer: 27 Ideen, die ankommen</h1><p className="mt-4 text-lg text-muted-foreground leading-relaxed">Geschenk für Lehrerinnen &amp; Lehrer: 27 Ideen nach Anlass &amp; Budget — inkl. Sprüchen für die Karte und den Regeln, was Lehrer wirklich annehmen dürfen.</p><div className="mt-6 flex flex-wrap gap-2"><Link href="/shop"><Button>Buch entdecken — 10,99 € <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/worthaft"><Button variant="outline"><Gamepad2 className="mr-2 h-4 w-4"/> Worthaft spielen</Button></Link><Link href="/checkliste"><Button variant="ghost"><FileText className="mr-2 h-4 w-4"/> Checkliste PDF</Button></Link></div></div></div>
<div className="container px-4 md:px-6 pb-4"><div className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/15 dark:border-amber-900/30 p-4 md:p-5 flex gap-4 items-start max-w-3xl"><img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&amp;token=42ce90a3-ed34-49d2-8e09-5258d0dfc484" alt="Hallo Welt Cover" className="w-14 h-20 object-cover rounded-md shadow-sm shrink-0" loading="lazy"/><div className="flex-1 min-w-0"><p className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span> Aus dem Buch — 106 Seiten, 4.8★</p><p className="text-sm md:text-[15px] leading-snug font-medium mt-1">Diese Szene stammt aus <em>Hallo Welt</em> — dort geht es noch tiefer in den Wahnsinn. 10,99 € statt 20,99 € bis Monatsende.</p><Link href="/shop" className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-primary hover:underline">Hier weiterlesen — 10,99 € auf Amazon →</Link></div></div></div>
<article className="container px-4 md:px-6 pb-10 max-w-3xl prose prose-zinc dark:prose-invert lg:prose-lg prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80">
<div dangerouslySetInnerHTML={{__html: `<blockquote>
<p><strong>Kennzeichnung:</strong> Ratgeber-Inhalte: recherchiert &amp; echt (Anlässe, Budgets, Regeln). Empfehlungen: ausführlich satirisch kommentiert, aber mit echtem Herzen. <a href="/shop">Unsere Bücher</a> sind selbst das Ergebnis der Frage: „Was schenkt man jemandem, der Schule überlebt hat?&quot;</p>
</blockquote>
<h1>Geschenk für Lehrer:innen: 27 Ideen, die überleben</h1>
<p><strong>Vom Abschiedsgeschenk bis zum kleinen Dank — nach Anlass, Budget und Legitimität sortiert. Inklusive der Antwort auf die Frage, die sich traut niemand zu stellen: Dürfen Lehrer das überhaupt annehmen?</strong></p>
<hr>
<h2>TL;DR — das Wichtigste in 30 Sekunden</h2>
<p>Das perfekte Lehrergeschenk folgt drei Regeln: <strong>persönlich statt teuer</strong> (Handschrift schlägt Preisschild), <strong>ein Anlass</strong> (Abschied, Danke, Jahrgangsende, Ruhestand — nie „einfach so&quot;, das wirkt verdächtig) und <strong>kein Duplikat</strong> (Tassen, Kerzen, Bonbendosen haben alle schon 30-fach — jedes weitere Exemplar ist eine subtile Kriegserklärung). Budget-Korridor einzeln: 5–15 €, als Klasse gesammelt: mehr, aber organisiert über die Elternvertretung. Rechtlich sind kleine Aufmerksamkeiten immer okay; bei verbeamteten Lehrkräften gilt die Vorteilsannahme-Grenze (§ 331 StGB) — unter 15–20 € bewegt man sich im sozialadäquaten Bereich. Und: Das mutigste, aber beste Geschenk für humorvolle Lehrkräfte ist ein Buch, das den Schulalltag von der Schülerseite zeigt. Genau so eines haben wir geschrieben. Details unten, Sortiment oben, Tassen links liegen lassen.</p>
<p><em>Inhalt: Die 3 Regeln · Ideen nach Anlass · Ideen nach Budget · Klassengeschenk-Organisation · Dürfen-Lehrer-Geschenke-annehmen · Karten-Sprüche · No-Gos · FAQ</em></p>
<hr>
<h2>Die 3 Regeln des Lehrergeschenks</h2>
<p><strong>Kurzantwort:</strong> Persönlich schlägt teuer, ein Anlass schlägt Spontankauf, Einzigartigkeit schlägt Repeat. Und: Die Übergabe ist das Geschenk — der Moment zählt stärker als der Inhalt.</p>
<ol>
<li><strong>Persönlich schlägt teuer.</strong> Eine Karte mit handschriftlichem Satz bleibt 20 Jahre im Fach „Menschen, die es geschafft haben, mich zu überraschen&quot;. Der 20-€-Gutschein bleibt 20 Minuten in der Portemonnaie.</li>
<li><strong>Anlass schlägt Bauchgefühl.</strong> Ohne Anlass wirkt Schenken wie Bestechung mit schlechtem Timing.</li>
<li><strong>Die Übergabe ist der Kern.</strong> Vor der Klasse, mit einem Satz, den man vorher aufgeschrieben und dreimal gelesen hat. (Ja, den Satz aufschreiben. Wir haben es live gesehen. Es war schön.)</li>
</ol>
<h2>Ideen nach Anlass (die Anlass-Matrix)</h2>
<p><strong>Kurzantwort:</strong> Abschied → Persönliches &amp; Bleibendes (Buch mit Widmung, Kartenmappe der Klasse, Foto-Klassiker). Danke → Klein &amp; hochwertig (Buch, Gutschein Café, handgemachtes). Jahrgangsende → kollektiv &amp; leicht. Weihnachten → dezent &amp; optional. Ruhestand → das große Finale (Erinnerungswerk, Klassengeschenk, Humor-Absacker).</p>
<table>
<thead>
<tr>
<th>Anlass</th>
<th>Die 3 besten Ideen</th>
<th>Budget</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Abschied / Versetzung</strong></td>
<td>Buch mit Klassen-Widmung · Karten-Mappe (jedes Kind eine Handzeile) · personalisiertes Foto-Erinnerungsstück</td>
<td>10–30 €</td>
</tr>
<tr>
<td><strong>Danke (nach Projekt, Unterstützung)</strong></td>
<td>Buch-Gutschein Café · gutes Buch · Blume + Karte</td>
<td>5–20 €</td>
</tr>
<tr>
<td><strong>Schuljahresende</strong></td>
<td>Klassengeschenk (siehe unten) · gemeinsam gestalteter „Jahresrückblick in Zitaten&quot; · Kuchen</td>
<td>5–15 € / Person</td>
</tr>
<tr>
<td><strong>Weihnachten</strong></td>
<td>dezent: Karte + kleines Lesezeichen-Set · gemeinsames Klassen-Dankesvideo</td>
<td>3–10 €</td>
</tr>
<tr>
<td><strong>Ruhestand</strong></td>
<td>Das große Erinnerungswerk: Foto-Buch der Jahrgänge · Spende mit Urkunde · Buch + Flasche (privat übergeben!)</td>
<td>20–60 €</td>
</tr>
<tr>
<td><strong>Weltlehrertag (5. Okt.)</strong></td>
<td>Karte. Wirklich. Nur Karte.</td>
<td>1,50 €</td>
</tr>
</tbody></table>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/geschenk-lehrer/abschiedsgeschenk-lehrerin/">Abschiedsgeschenk Lehrerin: 15 Ideen mit Anleitung</a> · <a href="/ratgeber/geschenk-lehrer/danke-geschenk-lehrerin/">Danke-Geschenk: die 12 tastvollsten</a> · <a href="/ratgeber/geschenk-lehrer/geschenk-ruhestand-lehrer/">Ruhestand: das große Finale</a></p>
<h2>Ideen nach Budget (die Preisstufen)</h2>
<p><strong>Kurzantwort:</strong> Unter 10 €: Karte mit echtem Satz, Lesezeichen, kleine Pflanze, Klassenfoto gerahmt. 10–20 €: das Wunschfenster — Bücher, Café-Gutscheine, hochwertige Kleinigkeiten. Über 20 €: nur als Klassengeschenk oder zum Ruhestand.</p>
<p><strong>Unter 10 € (die unterschätzte Liga):</strong></p>
<ul>
<li>Handgeschriebene Karte (die unterschätzte Liga hat die höchste Erfolgsquote)</li>
<li>Lesezeichen mit Zitat aus „dem Unterricht dieses Jahres&quot; (Zitate authentisch, nicht nett)</li>
<li>Klassenfoto im Rahmen — aber bitte das ECHTE, nicht das retuschierte</li>
<li>Kleine Pflanze (überlebt bei Lehrkräften statistisch länger als bei Influencern)</li>
</ul>
<p><strong>10–20 € (das Wunschfenster):</strong></p>
<ul>
<li><strong>Ein Buch, das die eigene Schulzeit spiegelt</strong> — z. B. unsere Satire-Reihe <a href="/shop">„Hallo Welt&quot; (10,99 €)</a>: Der Lehrer liest die andere Seite. Mit Widmung. Fertig ist das Geschenk, das keinen Vergleich braucht.</li>
<li>Buch-Gutschein für die lokale Buchhandlung (schadet nie, wirkt aber wie 6 von 10 Mühe → immer mit Karte aufwerten)</li>
<li>Hochwertige Tee-/Kaffee-Ausstattung EINER Person (nicht: Tasse. Aufwand: Vorauswahl.)</li>
</ul>
<p><strong>Über 20 € (Klassengeschenk-Bereich):</strong></p>
<ul>
<li>Gesammelt über Elternvertretung: Erinnerungswerk, Gemeinschaftsgeschenk, Theaterkarten</li>
</ul>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/geschenk-lehrer/geschenk-lehrer-unter-10-euro/">Geschenke für Lehrer unter 10 € (die Retter-Liga)</a> · <a href="/ratgeber/geschenk-lehrer/klassengeschenk-organisieren/">Das Geschenk von der ganzen Klasse organisieren</a></p>
<h2>Dürfen Lehrer Geschenke annehmen? (Die Frage, die alle stellen, keiner googelt traut)</h2>
<p><strong>Kurzantwort:</strong> Kleine sozialadäquate Aufmerksamkeiten (Karte, Blume, Kuchen, kleines Buch) sind überall zulässig. Für verbeamtete Lehrkräfte gilt die Vorteilsannahme-Regelung (§ 331 StGB), die großzügige Geschenke problematisch macht; viele Schulen haben interne Orientierungsgrenzen. Faustregel: unter ca. 15–20 € pro Anlass und Kind ist man im sicheren Bereich — im Zweifel bei der Schulleitung nachfragen.</p>
<p>Warum wir das so genau wissen: weil wir ein Buch über Schule geschrieben haben und uns plötzlich alle diese Fragen stellen. Für alle, die es ganz genau wissen wollen: <a href="/ratgeber/geschenk-lehrer/duerfen-lehrer-geschenke-annehmen/">Dürfen Lehrer Geschenke annehmen? Die Regeln je Bundesland</a>.</p>
<p><strong>Und die Verbeamteten unter den Lehrkräften?</strong> Für die gilt: Amtsträgerstatus, § 331 StGB (Vorteilsannahme), im Zweifel Offenlegung bei der Schulleitung. Das klingt strenger, als es gelebt wird — aber es erklärt, warum die Flasche Wein besser privat und diskret übergeben wird, nicht vor versammelter 9b. Und falls Sie jetzt denken „ist das nicht alles ein bisschen viel Bürokratie für ein Geschenk?&quot;: Ja. Willkommen in Deutschland. <a href="/ratgeber/beamtendeutsch/">Wir haben dazu einen eigenen Guide.</a></p>
<h2>Die Karte: 12 Sprüche, die Lehrer wirklich mögen</h2>
<p><strong>Kurzantwort:</strong> Gute Karten-Sprüche für Lehrer sind konkret („Danke, dass Sie immer zuerst durchgeatmet haben&quot;), persönlich (Detail aus dem Unterricht) und kurz. Schlechte sind generisch („Danke für alles&quot;).</p>
<p>Beispiele aus dem Repertoire:</p>
<ul>
<li>„Danke, dass Sie nie so getan haben, als wäre alles einfach.&quot;</li>
<li>„Sie haben mir nicht alles beigebracht. Aber das Wichtigste: dass ich fragen darf.&quot;</li>
<li>„Für die Pünktlichkeit unter Zeitdruck: Danke. (Ich arbeite dran.)&quot;</li>
<li>„Danke für drei Jahre Gelassenheit. Ich war der Test.&quot;</li>
<li>„Sie sagten immer: ‚Werdet besser als ich.&#39; Herausforderung angenommen.&quot;</li>
</ul>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/geschenk-lehrer/sprueche-dankeskarte-lehrer/">50 Sprüche für Lehrer-Karten — sortiert nach Tonlage</a></p>
<h2>Die No-Gos (bitte wirklich nicht)</h2>
<p><strong>Kurzantwort:</strong> Keine Parfums/Kosmetik (zu intim), keine Kleidung (Größenroulette), kein Alkohol im dienstlichen Kontext, keine persönlichen Elektroartikel, keine 31. Tasse/Kerze/Bonbondose, keine Witzgeschenke ohne echte Beziehung — und nichts, was im Lehrerzimmer-Mittelfach landen könnte.</p>
<h2>Das Buch als Lehrergeschenk (unserere ehrliche Empfehlung, klar)</h2>
<p>Warum ein Buch über Schule aus Schülersicht das unterschätzteste Lehrergeschenk ist: Lehrkräfte sehen Schule 30 Jahre lang von ihrer Seite. <strong>„Hallo Welt&quot; ist die andere Seite — 106 Seiten, die zeigen, was Schüler:innen wirklich denken, fürchten und lustig finden.</strong> 5,0 Sterne bei Amazon. 10,99 € (= Wunschfenster, siehe oben). Mit Widmungs-Seite. Und das schönste: Wenn die Lehrkraft laut lacht, war der Unterricht wenigstens für ein Buch gut.</p>
<p><strong><a href="/shop">→ „Hallo Welt&quot; als Lehrergeschenk ansehen</a></strong> — Taschenbuch, E-Book &amp; Gratis-Hörbuch. <em>(Falls die Lehrkraft kein Humor-Buch mag: unsere <a href="/exzerpte">Exzerpte</a> zum Reinschauen weitergeben ist auch eine Strategie.)</em></p>
<hr>
<h2>Häufige Fragen</h2>
<p><em>(FAQ-Inhalte 1:1 aus dem JSON-LD-Block oben rendern — die 6 Fragen decken die PAA-Queries „was schenken&quot;, „dürfen Lehrer Geschenke annehmen&quot;, „wie viel Geld&quot;, „was nicht schenken&quot; ab.)</em></p>
<hr>
<h2>CTA-Block</h2>
<p><strong>Kurzcheck:</strong> Anlass? ✅ Budget? ✅ Kein Tassen-Duplikat? ✅ — dann fehlt nur noch <a href="/shop">das Buch</a>. Und wenn Sie ganz unsicher sind: <a href="/#newsletter">Newsletter abonnieren</a>, wir haben jedes Jahr vor Schuljahresende eine Geschenk-Ausgabe.</p>
<hr>
<p><em>Recherchiert &amp; geschrieben von <strong>Philipp Paulik &amp; Maximilian Reisch</strong> — zwei Autoren, die wissen, was in Lehrerfächern landet, weil sie eins hatten. <a href="/ueber/philipp-paulik">Über die Autoren</a></em></p>
<hr>
<h2>🗂️ CLUSTER-PLAN für Pillar 3 (12 Stück)</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Cluster-URL (<code>/ratgeber/geschenk-lehrer/…</code>)</th>
<th>Fokus-Keyword</th>
<th>Priorität</th>
</tr>
</thead>
<tbody><tr>
<td>3.1</td>
<td><code>abschiedsgeschenk-lehrerin</code></td>
<td>abschiedsgeschenk lehrerin</td>
<td>⭐⭐⭐</td>
</tr>
<tr>
<td>3.2</td>
<td><code>duerfen-lehrer-geschenke-annehmen</code></td>
<td>dürfen lehrer geschenke annehmen</td>
<td>⭐⭐⭐ (AEO!)</td>
</tr>
<tr>
<td>3.3</td>
<td><code>danke-geschenk-lehrerin</code></td>
<td>danke geschenk lehrerin</td>
<td>⭐⭐⭐</td>
</tr>
<tr>
<td>3.4</td>
<td><code>geschenk-lehrer-unter-10-euro</code></td>
<td>geschenk lehrer unter 10 euro</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>3.5</td>
<td><code>sprueche-dankeskarte-lehrer</code></td>
<td>sprüche danke lehrer karte</td>
<td>⭐⭐⭐ (Snippet!)</td>
</tr>
<tr>
<td>3.6</td>
<td><code>klassengeschenk-organisieren</code></td>
<td>klassengeschenk lehrer sammeln</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>3.7</td>
<td><code>geschenk-lehrer-weihnachten</code></td>
<td>geschenk lehrer weihnachten</td>
<td>⭐⭐ (Saisonal!)</td>
</tr>
<tr>
<td>3.8</td>
<td><code>geschenk-ruhestand-lehrer</code></td>
<td>geschenk lehrer ruhestand</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>3.9</td>
<td><code>geschenk-maennlicher-lehrer</code></td>
<td>geschenk für lehrer männlich</td>
<td>⭐</td>
</tr>
<tr>
<td>3.10</td>
<td><code>buecher-als-geschenk</code></td>
<td>buch als geschenk / lustiges buch geschenkt</td>
<td>⭐⭐ (→ Shop-Funnel!)</td>
</tr>
<tr>
<td>3.11</td>
<td><code>geschenk-erzieherin-schule</code></td>
<td>geschenk erzieherin / referendar</td>
<td>⭐</td>
</tr>
<tr>
<td>3.12</td>
<td><code>elternbrief-geschenk-sammeln</code></td>
<td>brief eltern geschenk lehrer sammeln</td>
<td>⭐</td>
</tr>
</tbody></table>
<h2>🎣 PROMO-HOOKS</h2>
<ol>
<li><strong>Neugier:</strong> „27 Lehrer-Geschenke — nur eines überlebt den Juli.&quot;</li>
<li><strong>Schmerz:</strong> „Die 15. ‚Beste Lehrerin&#39;-Tasse war ein Fehler. Hier sind 27 bessere.&quot;</li>
<li><strong>Brand:</strong> „Das Geschenk, das jede Lehrerin heimlich will: die Sicht ihrer Schüler. In Buchform, 10,99 €.&quot;</li>
</ol>
<h2>🔗 VERLINKUNGS-PFLICHTEN</h2>
<ul>
<li><strong>Lateral:</strong> <code>/ratgeber/abiturgeschenk/</code> („Auch Abi-Geschenke? → hier&quot;), <code>/ratgeber/beamtendeutsch/</code> („Warum Geschenke an Beamte geregelt sind&quot;), <code>/ratgeber/satire-schreiben/</code> („unsere Handwerksecke&quot;), <code>/ratgeber/schulalltag/</code> („woher wir das wissen&quot;).</li>
<li><strong>CTA:</strong> /shop primär; Newsletter sekundär.</li>
<li><strong>Bottom-up:</strong> alle Cluster verlinken hierher („unser großes Geschenk-Lexikon für Lehrer:innen&quot;) + lateral zu max. 2 Geschwistern.</li>
</ul>
`}} />
</article>
<div className="container px-4 md:px-6 pb-6 max-w-3xl"><div className="not-prose mt-4 grid sm:grid-cols-2 gap-3"><Card className="border-primary/20 bg-primary/5"><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Gift className="h-4 w-4"/> Gratis-Kapitel</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Hol dir das Checkliste-PDF + Leseprobe — 0 €, sofort.<Link href="/checkliste" className="block mt-3"><Button size="sm" className="w-full">Checkliste holen</Button></Link></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Gamepad2 className="h-4 w-4"/> Worthaft Daily</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Ein Wort, 6 Versuche, täglich neu.<Link href="/worthaft" className="block mt-3"><Button size="sm" variant="outline" className="w-full">Jetzt spielen</Button></Link></CardContent></Card></div></div>
<div className="container px-4 md:px-6 pb-10"><div className="max-w-3xl"><h2 className="font-headline text-2xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Mehr aus dem Ratgeber</h2><div className="mt-4 grid sm:grid-cols-2 gap-3">
<Link href="/ratgeber/satire-schreiben" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Satire schreiben</div><div className="text-xs text-muted-foreground mt-1">Merkmale, Stilmittel &amp; Anleitung</div></Link>
<Link href="/ratgeber/zeugnissprache" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Zeugnissprache</div><div className="text-xs text-muted-foreground mt-1">40 Geheimcodes entziffert</div></Link>
<Link href="/ratgeber/geschenk-lehrer" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Geschenk für Lehrer</div><div className="text-xs text-muted-foreground mt-1">27 Ideen die ankommen</div></Link>
<Link href="/ratgeber/etikette" className="rounded-xl border p-4 hover:bg-muted transition-colors"><div className="text-sm font-semibold">Etikette heute</div><div className="text-xs text-muted-foreground mt-1">Benimm-Regeln die zählen</div></Link>
</div><div className="mt-6 flex flex-wrap gap-2 text-xs"><Link href="/ratgeber" className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 hover:bg-muted"><BookOpen className="h-3.5 w-3.5"/> Alle Ratgeber</Link><Link href="/shop" className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1.5 font-semibold">Buch — 10,99 €</Link></div></div></div>
</main><Footer/></>);
}
