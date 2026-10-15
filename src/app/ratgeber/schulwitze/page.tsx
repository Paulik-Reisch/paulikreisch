import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gamepad2, ArrowRight, Sparkles, Gift, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Schulwitze: Die besten Witze über Schule | Paulik & Reisch",
  description: "Witze über Schule: die besten Lehrerwitze, Schülerwitze, Mathe-Witze & Flachwitze — kuratiert von Satire-Autoren und sortiert nach Fach. Plus: Wie man einen Witz richtig erzählt.",
  keywords: ["schulwitze","witze über schule","lehrerwitze","schülerwitze","mathe witze","flachwitze schule","witze für pausen","abi witze","witz erzählen tipps","warum lachen wir"],
  alternates: { canonical: "/ratgeber/schulwitze" },
  openGraph: {
    title: "Schulwitze: Die besten Witze über Schule",
    description: "Witze über Schule: die besten Lehrerwitze, Schülerwitze, Mathe-Witze & Flachwitze — kuratiert von Satire-Autoren und sortiert nach Fach. Plus: Wie man eine",
    url: "https://paulikreisch.de/ratgeber/schulwitze",
    siteName: "Paulik & Reisch",
    locale: "de_DE",
    type: "article",
    images: [{ url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7", width: 1200, height: 630, alt: "Schulwitze: Die besten Witze über Schule" }],
  },
  twitter: { card: "summary_large_image", title: "Schulwitze: Die besten Witze über Schule", description: "Witze über Schule: die besten Lehrerwitze, Schülerwitze, Mathe-Witze & Flachwitze — kuratiert von Satire-Autoren und sortiert nach Fach. Plus: Wie man eine", images: ["https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"] },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "Was sind die besten Lehrerwitze?", "acceptedAnswer": {"@type": "Answer", "text": "Klassiker der Gattung: 'Warum wurde der Mathelehrer entlassen? Er hatte zu viele Probleme.' — 'Was sagt ein Lehrer, der nichts mehr sagen kann? Sie sind still.' — 'Frau Müller, nennen Sie mir ein unlösbares Problem. Die 4b.'"}},
    {"@type": "Question", "name": "Warum lachen wir über Witze?", "acceptedAnswer": {"@type": "Answer", "text": "Die Humorforschung kennt drei Haupttheorien: Die Inkongruenztheorie (wir lachen, wenn Erwartetes plötzlich gebrochen wird), die Überlegenheitstheorie (wir lachen über erkannte Dummheiten, auch die eigene) und die Entlastungstheorie (Lachen als Ventil für aufgestaute Anspannung). Gute Witze nutzen alle drei — Schule liefert das Rohmaterial gleich mit."}},
    {"@type": "Question", "name": "Wie erzählt man einen Witz richtig?", "acceptedAnswer": {"@type": "Answer", "text": "Mit vier Regeln: kurz vor der Pointe nie lachen, den Witz nicht ankündigen ('Jetzt kommt ein guter!'), die Pointe ans ENDE stellen und danach schweigen — der Witz braucht Stille zum Landen. Wer die Pointe erklärt, hat sie zerstört."}},
    {"@type": "Question", "name": "Was sind Flachwitze?", "acceptedAnswer": {"@type": "Answer", "text": "Flachwitze (auch 'Dad Jokes') funktionieren durch absichtsvolle Harmlosigkeit und Wortspiel statt Überraschungstiefe: 'Was macht ein Pirat am Computer? Er drückt die Enter-Taste.' Sie grooven auf der Ebene des Bewusstseins 'so schlecht, dass es wieder gut ist' — und sind gerade deshalb perfekt für Pausen, Elternabende und Lehrerzimmer."}},
    {"@type": "Question", "name": "Darf man über Schule lachen?", "acceptedAnswer": {"@type": "Answer", "text": "Ja — und zwar am besten von innen. Schulhumor lebt von der geteilten Erfahrung: Sitzordnungen, Vertretungsstunden, Zeugnissprache. Wer selbst 13 Jahre dabei war, darf lachen. Genau deshalb ist der humorvollste Schulbericht Deutschlands ein Buch von zwei Überlebenden: 'Hallo Welt' von Paulik & Reisch."}},
    {"@type": "Question", "name": "Was ist der Unterschied zwischen einem Witz und einer Pointe?", "acceptedAnswer": {"@type": "Answer", "text": "Der Witz ist die ganze Erzählung (Aufbau, Spannung, Rahmen), die Pointe ist der überraschende Schluss, der alles umdreht. Ein Witz ohne Pointe ist eine Anekdote; eine Pointe ohne Witz ist ein Zufall."}}
  ]
};

export default function Page(){
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
<Header/><main className="flex-1">
<div className="container px-4 md:px-6 py-8"><nav className="text-xs text-muted-foreground mb-4 flex gap-1.5 flex-wrap"><Link href="/" className="hover:underline">Home</Link><span>/</span><Link href="/ratgeber" className="hover:underline">Ratgeber</Link><span>/</span><span className="text-foreground font-medium">schulwitze</span></nav><div className="max-w-3xl"><Badge variant="secondary" className="mb-3">Ratgeber · Paulik &amp; Reisch</Badge><h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-balance">Schulwitze: Die besten Witze über Schule</h1><p className="mt-4 text-lg text-muted-foreground leading-relaxed">Witze über Schule: die besten Lehrerwitze, Schülerwitze, Mathe-Witze &amp; Flachwitze — kuratiert von Satire-Autoren und sortiert nach Fach. Plus: Wie man einen Witz richtig erzählt.</p><div className="mt-6 flex flex-wrap gap-2"><Link href="/shop"><Button>Buch entdecken — 10,99 € <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/worthaft"><Button variant="outline"><Gamepad2 className="mr-2 h-4 w-4"/> Worthaft spielen</Button></Link><Link href="/checkliste"><Button variant="ghost"><FileText className="mr-2 h-4 w-4"/> Checkliste PDF</Button></Link></div></div></div>
<div className="container px-4 md:px-6 pb-4"><div className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/15 dark:border-amber-900/30 p-4 md:p-5 flex gap-4 items-start max-w-3xl"><img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&amp;token=42ce90a3-ed34-49d2-8e09-5258d0dfc484" alt="Hallo Welt Cover" className="w-14 h-20 object-cover rounded-md shadow-sm shrink-0" loading="lazy"/><div className="flex-1 min-w-0"><p className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span> Aus dem Buch — 106 Seiten, 4.8★</p><p className="text-sm md:text-[15px] leading-snug font-medium mt-1">Diese Szene stammt aus <em>Hallo Welt</em> — dort geht es noch tiefer in den Wahnsinn. 10,99 € statt 20,99 € bis Monatsende.</p><Link href="/shop" className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-primary hover:underline">Hier weiterlesen — 10,99 € auf Amazon →</Link></div></div></div>
<article className="container px-4 md:px-6 pb-10 max-w-3xl prose prose-zinc dark:prose-invert lg:prose-lg prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80">
<div dangerouslySetInnerHTML={{__html: `<blockquote>
<p><strong>Kennzeichnung:</strong> Witze: urheberrechtlich freie Volksware (die besten sind eh anonym). Kuratierung: satirisch professionell. Newsletter-Tipp: <a href="/#newsletter">1×/Woche der neue Witz</a> — Witze-Abonnement, existiert wirklich.</p>
</blockquote>
<h1>Witze über Schule: Das große Kompendium der Lachware</h1>
<p><strong>Lehrerwitze, Schülerwitze, Fach-Witze, Flachwitze — sortiert, kuratiert und kommentiert von zwei Profis des Schulhumors (Zertifikat: 13 Jahre Praxis, ein Buch, 5 Sterne).</strong></p>
<hr>
<h2>🎁 Witz der Woche <em>(dynamischer Block — jede Woche neu, Newsletter-Trigger)</em></h2>
<blockquote>
<p><strong>Lehrer: „Wenn Sie jetzt still sind, erzähle ich Ihnen etwas, das Sie in 20 Jahren noch wissen werden.&quot;</strong>
<strong>Klasse: „…?&quot;</strong>
<strong>Lehrer: „Genau. Das hier.&quot;</strong></p>
</blockquote>
<p><em><a href="/#newsletter">→ Diese und alle nächsten Witze wöchentlich ins Postfach</a></em></p>
<hr>
<h2>TL;DR — das Wichtigste in 30 Sekunden</h2>
<p>Schulwitze sind die stabilste Währung des Schulalltags: Sie funktionieren generationsübergreifend, weil sich Schule seit 150 Jahren nur in Details geändert hat. Auf dieser Seite: die <strong>Königsklasse Lehrerwitze</strong> (unten), <strong>Schülerwitze</strong> (die Gegenoffensive), <strong>Fach-Witze</strong> (Mathe, Deutsch, Physik, Chemie, Latein — jede Disziplin beliefert ihre eigene Komik), <strong>Flachwitze</strong> (bewusst bodenlos), die <strong>Wissenschaft des Lachens</strong> (Inkongruenz-, Überlegenheits-, Entlastungstheorie — echt, nachlesbar) und das <strong>Handwerk des Witz-Erzählens</strong> (4 Regeln, die 90 % aller misslungenen Witze verhindern). Kuratiert von zwei Autoren, die Schulhumor zum Beruf gemacht haben — unser Buch „Hallo Welt&quot; ist im Grunde ein 106-Seiten-Witz mit System.</p>
<p><em>Inhalt: Lehrerwitze · Schülerwitze · Fach-Witze · Flachwitze · Warum wir lachen · Witze erzählen · Witz-Kultur im Klassenzimmer · FAQ</em></p>
<hr>
<h2>Lehrerwitze: die Königsklasse</h2>
<p><strong>Kurzantwort:</strong> Lehrerwitze leben von der Umkehrung der Machtverhältnisse: Die Autorität des Lehrerzimmers wird mit einem Satz auf die Bühne des Pausenhofs gezogen. Die besten klassischen Vertreter arbeiten mit Wortspiel und Umkehrung statt mit Häme — deshalb überleben sie Jahrzehnte.</p>
<p>Die Top 10 (die Langversion mit 50 Stück im Cluster):</p>
<ol>
<li>Warum wurde der Mathelehrer entlassen? — Er hatte zu viele Probleme.</li>
<li>Lehrer: „Nennen Sie mir zwei Pronomen.&quot; — Schüler: „Wer, ich?&quot;</li>
<li>„Frau Klein, Sie stehen wieder am Fenster!&quot; — „Nein, ich sitze am Fensterrahmen.&quot;</li>
<li>Lehrer: „Wo sind Ihre Hausaufgaben?&quot; — Schüler: „Bei Ihnen — Sie haben sie ja eingesammelt.&quot;</li>
<li>Was ist der Unterschied zwischen einem Lehrer und der Bahn? — Die Bahn hat Verspätung, der Lehrer hat sie verursacht.</li>
<li>„Ich habe eine 6 geschrieben.&quot; — „Wegen mir?&quot; — „Nein, wegen Rechtschreibung.&quot;</li>
<li>Lehrer: „Was war zuerst da, Henne oder Ei?&quot; — „Die 6 auf dem Zeugnis.&quot;</li>
<li>Warum gehen Mathelehrer nicht in die Kirche? — Sie haben schon genug Probleme mit unendlichen Reihen.</li>
<li>„Der Satz ist unlogisch.&quot; — „Nein, er ist nur unbequem.&quot;</li>
<li>Lehrer: „Sie haben wieder abgeschrieben!&quot; — „Nein, wir haben kollaboriert. Das nennt man heute Projektarbeit.&quot;</li>
</ol>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/schulwitze/lehrerwitze-die-besten/">Die 50 besten Lehrerwitze — sortiert nach Fach und Bosheit</a></p>
<h2>Schülerwitze: die Gegenoffensive</h2>
<p><strong>Kurzantwort:</strong> Schülerwitze drehen den Spiegel: Hier lacht die Klasse über sich selbst — über die Ausreden, die Hausaufgaben-Ökonomie und die kollektive Strategie des Nicht-auffällig-Seins. Sie funktionieren, weil sie (im Gegensatz zu vielen Ausreden) nie neu erfunden werden müssen.</p>
<p>Die Top 5: </p>
<ol>
<li>Was macht ein Schüler um 23:58 Uhr? — Referate referieren referieren.</li>
<li>„Hast du die Hausaufgaben gemacht?&quot; — „Ich habe sie vorbereitet. Auf morgen.&quot;</li>
<li>Wie viele Schüler:innen braucht man, um eine Glühbirne zu wechseln? — Keinen. Das macht ja eh die eine Person aus der ersten Reihe.</li>
<li>Was ist der Lieblingsplatz eines Schülers in der Schule? — Der Parkplatz.</li>
<li>„Was willst du mal werden?&quot; — „Müde.&quot;</li>
</ol>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/schulwitze/schuelerwitze-die-besten/">Schülerwitze: die 40 besten Selbsttreffer</a></p>
<h2>Fach-Witze: jede Disziplin, ihre eigene Komik</h2>
<p><strong>Kurzantwort:</strong> Fach-Witze funktionieren über Fachlogik: Mathematik liefert unendliche Probleme, Physik die Fallgesetze, Chemie die Reaktionen, Deutsch die Wortspiele, Latein die tote Sprache, die trotzdem alle Wörter klaut. Der Humor steckt im Fach selbst — die Pointe ist nur sein Übersetzer.</p>
<p>Die Top 10 der Fächer (je Fach die 15–30 besten im Cluster):</p>
<ul>
<li><strong>Mathe:</strong> „Kommt ein Student zur Prüfung. Er besteht.&quot; (Minimalismus, Fach-Insider)</li>
<li><strong>Deutsch:</strong> „Was ist ein Komma? Der Moment, in dem der Satz kurz Luft holt.&quot; </li>
<li><strong>Physik:</strong> „Photon checkt ins Hotel. Gepäck? Nein, ich reise licht.&quot; </li>
<li><strong>Chemie:</strong> „Treffen sich zwei Atome. Sagt das eine: ‚Ich habe ein Elektron verloren.&#39; Sagt das andere: ‚Bist du sicher?&#39; — ‚Ich bin positiv.&#39;&quot; </li>
<li><strong>Latein:</strong> „Warum starb das Lateinische aus? Es hatte zu wenig Sprecher und zu viele Fälle.&quot;</li>
<li><strong>Geschichte:</strong> „Wann starb Napoleon?&quot; — „Auf jeden Fall nicht mehr.&quot; </li>
<li><strong>Bio:</strong> Zelle zur anderen: „Mir ist so komisch — ich glaube, ich bin gerade in Teilung.&quot;</li>
<li><strong>Englisch:</strong> „Wie sagt man ‚Ich habe die Hausaufgaben vergessen&#39; auf Englisch? — ‚My dog ate my homework&#39; — der einzige Satz, dem in beiden Sprachen nie geglaubt wird.&quot;</li>
<li><strong>Informatik:</strong> „Warum trinken Informatiker keinen Tee? Sie haben keine Java-Klasse dafür.&quot; (Schul-Informatik-nah genug.)</li>
<li><strong>Sport:</strong> Lehrer: „Sie sind wieder zu spät zum Sport!&quot; — Schüler: „Verspätung beim Umziehen — der Turnbeutel war im anderen Fach.&quot;</li>
</ul>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/schulwitze/mathe-witze/">Mathe-Witze: die 30 besten</a> · <a href="/ratgeber/schulwitze/deutsche-wortwitze/">Deutsch-Witze &amp; Wortspiele</a> · <a href="/ratgeber/schulwitze/physik-chemie-witze/">Physik- &amp; Chemie-Witze</a></p>
<h2>Flachwitze: die bodenlose Liga</h2>
<p><strong>Kurzantwort:</strong> Flachwitze funktionieren durch absichtsvolle Harmlosigkeit — sie sind so niedrig, dass sie den Boden streifen und dabei jede Attitüde verlieren. Genau deshalb retten sie Pausen, Elternabende und Montage.</p>
<p>Top 5: </p>
<ol>
<li>Was macht ein Pirat am Computer? — Er drückt die Enter-Taste. </li>
<li>Was ist grün und klopft an die Tür? — Ein Klopfsalat. </li>
<li>Warum können Geister so schlecht lügen? — Weil man durch sie hindurchsieht. </li>
<li>Was sagt ein Krokodil, das einen Clown gefressen hat? — „Schmeckt irgendwie komisch.&quot; </li>
<li>Kommt ein Pferd in eine Bar. Barkeeper: „Warum so ein langes Gesicht?&quot;</li>
</ol>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/schulwitze/flachwitze-schule/">Flachwitze für die Schule: die 50 flachsten</a></p>
<h2>Warum wir überhaupt lachen (die Wissenschaft dahinter)</h2>
<p><strong>Kurzantwort:</strong> Die Humorforschung kennt drei Haupttheorien: Inkongruenztheorie (Lachen entsteht, wenn eine Erwartung plötzlich gebrochen wird), Überlegenheitstheorie (wir lachen über erkannte Fehler, gern die eigenen) und Entlastungstheorie (Lachen als Druckventil). Schulwitze bedienen alle drei gleichzeitig — deshalb überleben sie jeden Schulwechsel.</p>
<p>Das ist der ernsthafte Teil, den keiner erwartet: Lachen ist Physiologie. Die Inkongruenz löst einen Mikro-Schreck aus, das Gehirn löst ihn auf, die Auflösung wird als Lachen abgelassen (Entlastung), und weil wir die eigene Schulzeit wiedererkennen (Überlegenheit über das System), lachen wir besonders bereitwillig. Schulhumor ist also angewandte Überlebenstechnik — deshalb singen Generationen dieselben Witze, ohne sich je getroffen zu haben.</p>
<h2>Wie man einen Witz erzählt (das Handwerk)</h2>
<p><strong>Kurzantwort:</strong> Vier Regeln: nicht ankündigen, nicht vorweglachen, die Pointe ans Ende stellen, danach Stille. Wer die Pointe erklärt, hat sie getötet; wer „Jetzt kommt ein Guter&quot; sagt, hat die Messlatte verdoppelt.</p>
<p>Die 4 Regeln im Detail: </p>
<ol>
<li><strong>Nicht ankündigen.</strong> Der Witz ist ein Überraschungsgast, kein Festredner. </li>
<li><strong>Pointe ans Ende.</strong> Sobald sie raus ist, ist alles danach Fußnote. </li>
<li><strong>Vor der Pointe: Ernst.</strong> Wer lacht, bevor er trifft, verrät den Treffer. </li>
<li><strong>Danach: Stille.</strong> Der Witz braucht Raum zum Landen. Wer die Stille mit Erklärungen füllt, räumt den Witz weg, bevor er saß.</li>
</ol>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/schulwitze/witz-erzaehlen-timing/">Witze erzählen: das Timing-Handwerk in 7 Lektionen</a></p>
<hr>
<h2>Häufige Fragen</h2>
<p><em>(FAQ-Inhalte 1:1 aus dem JSON-LD-Block oben rendern.)</em></p>
<hr>
<h2>CTA: Witze in Prosaform — das Buch</h2>
<p>Witze sind die Shorts des Schulhumors. <strong>„Hallo Welt&quot;</strong> ist der Langfilm: 106 Seiten Schulalltag mit System-Pointen statt Einzelgags — Episoden, Figuren, Wahnsinn, Herz. 5,0 Sterne. Für alle, die nach der 50sten Lehrerwitze-Seite mehr wollen.</p>
<p><strong><a href="/shop">→ „Hallo Welt&quot; ansehen</a></strong> · <strong><a href="/#newsletter">Witz der Woche per Newsletter</a></strong> · <strong><a href="/worthaft">Täglich ein Worträtsel: Worthaft</a></strong></p>
<hr>
<p><em>Kuratiert von <strong>Philipp Paulik &amp; Maximilian Reisch</strong> — professionelle Schulhumor-Verwerter seit dem Referat über Schwänzen. <a href="/ueber/philipp-paulik">Über die Autoren</a></em></p>
<hr>
<h2>🗂️ CLUSTER-PLAN für Pillar 6 (11 Stück)</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Cluster-URL (<code>/ratgeber/schulwitze/…</code>)</th>
<th>Fokus-Keyword</th>
<th>Priorität</th>
</tr>
</thead>
<tbody><tr>
<td>6.1</td>
<td><code>lehrerwitze-die-besten</code></td>
<td>lehrerwitze</td>
<td>⭐⭐⭐ (Volumen!)</td>
</tr>
<tr>
<td>6.2</td>
<td><code>schuelerwitze-die-besten</code></td>
<td>schülerwitze</td>
<td>⭐⭐⭐</td>
</tr>
<tr>
<td>6.3</td>
<td><code>mathe-witze</code></td>
<td>mathe witze</td>
<td>⭐⭐⭐</td>
</tr>
<tr>
<td>6.4</td>
<td><code>flachwitze-schule</code></td>
<td>flachwitze schule / dad jokes</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>6.5</td>
<td><code>deutsche-wortwitze</code></td>
<td>wortwitze / witze wortspiele</td>
<td>⭐⭐ (→ Pillar 8 lateral!)</td>
</tr>
<tr>
<td>6.6</td>
<td><code>physik-chemie-witze</code></td>
<td>physik witze, chemie witze</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>6.7</td>
<td><code>abi-witze-sprueche</code></td>
<td>abi witze, abi sprüche witzig</td>
<td>⭐⭐⭐ (→ Pillar 4 lateral!)</td>
</tr>
<tr>
<td>6.8</td>
<td><code>witz-erzaehlen-timing</code></td>
<td>witz erzählen lernen</td>
<td>⭐</td>
</tr>
<tr>
<td>6.9</td>
<td><code>warum-lachen-wir</code></td>
<td>warum lachen menschen</td>
<td>⭐⭐ (AEO!)</td>
</tr>
<tr>
<td>6.10</td>
<td><code>witze-fuer-elternabend</code></td>
<td>witze elternabend / rede</td>
<td>⭐</td>
</tr>
<tr>
<td>6.11</td>
<td><code>pausensprueche</code></td>
<td>sprüche für die pause</td>
<td>⭐</td>
</tr>
</tbody></table>
<h2>🎣 PROMO-HOOKS</h2>
<ol>
<li><strong>Neugier:</strong> „Die 50 besten Lehrerwitze — kuratiert von zwei Leuten, die sich vorm Lehrerzimmer nicht mehr retten konnten.&quot;</li>
<li><strong>Schmerz:</strong> „Dein Witz-Timing ist eine Katastrophe? Vier Regeln, versprochen.&quot;</li>
<li><strong>Brand:</strong> „Wir haben den Schulhumor zum Beruf gemacht. Hier ist die Rohware.&quot;</li>
</ol>
<h2>🔗 VERLINKUNGS-PFLICHTEN</h2>
<ul>
<li><strong>Lateral:</strong> <code>/ratgeber/schulalltag/</code> („die Welt, über die hier gelacht wird&quot;), <code>/ratgeber/deutsche-sprache/</code> („Wortwitze sind Sprachkunst — großer Guide&quot;), <code>/ratgeber/satire-schreiben/</code> („vom Witz zur Satire&quot;), <code>/ratgeber/abiturgeschenk/</code> („Witzbücher als Geschenk&quot;), <code>/worthaft</code> (CTA).</li>
<li><strong>CTA:</strong> Newsletter (Witz der Woche!), /shop.</li>
<li><strong>Bottom-up:</strong> alle Cluster → hierher („unser Witze-Kompendium&quot;).</li>
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
