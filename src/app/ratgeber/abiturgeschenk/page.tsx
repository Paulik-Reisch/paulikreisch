import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gamepad2, ArrowRight, Sparkles, Gift, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Abiturgeschenk: 25 Ideen + Sprüche, die sitzen | Paulik & Reisch",
  description: "Abiturgeschenk-Ideen für Abiturient:innen: kreative Geldgeschenke, Karten-Sprüche & Erinnerungsstücke — von zwei Autoren, die selbst Abi gemacht haben (überlebt).",
  keywords: ["abiturgeschenk","abschiedsgeschenk abiturienten","abi geschenk ideen","geschenk abitur bestanden","geldgeschenk abitur","abi sprüche geschenk karte","abschiedsgeschenk schulabschluss","geschenk abi junge","geschenk abi mädchen","abi geschenk beste freundin"],
  alternates: { canonical: "/ratgeber/abiturgeschenk" },
  openGraph: {
    title: "Abiturgeschenk: 25 Ideen + Sprüche, die sitzen",
    description: "Abiturgeschenk-Ideen für Abiturient:innen: kreative Geldgeschenke, Karten-Sprüche & Erinnerungsstücke — von zwei Autoren, die selbst Abi gemacht haben (übe",
    url: "https://paulikreisch.de/ratgeber/abiturgeschenk",
    siteName: "Paulik & Reisch",
    locale: "de_DE",
    type: "article",
    images: [{ url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7", width: 1200, height: 630, alt: "Abiturgeschenk: 25 Ideen + Sprüche, die sitzen" }],
  },
  twitter: { card: "summary_large_image", title: "Abiturgeschenk: 25 Ideen + Sprüche, die sitzen", description: "Abiturgeschenk-Ideen für Abiturient:innen: kreative Geldgeschenke, Karten-Sprüche & Erinnerungsstücke — von zwei Autoren, die selbst Abi gemacht haben (übe", images: ["https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"] },
  robots: { index: true, follow: true },
};

const jsonLd = {"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://paulikreisch.de/#organization","name":"Paulik & Reisch","url":"https://paulikreisch.de","logo":{"@type":"ImageObject","url":"https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"}},{"@type":"WebSite","@id":"https://paulikreisch.de/#website","url":"https://paulikreisch.de","name":"Paulik & Reisch","publisher":{"@id":"https://paulikreisch.de/#organization"},"inLanguage":"de-DE"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://paulikreisch.de/"},{"@type":"ListItem","position":2,"name":"Ratgeber","item":"https://paulikreisch.de/ratgeber"},{"@type":"ListItem","position":3,"name":"Abiturgeschenk: 25 Ideen + Sprüche, die sitzen","item":"https://paulikreisch.de/ratgeber/abiturgeschenk"}]},{"@type":"Article","headline":"Abiturgeschenk: 25 Ideen + Sprüche, die sitzen","description":"Abiturgeschenk-Ideen für Abiturient:innen: kreative Geldgeschenke, Karten-Sprüche & Erinnerungsstücke — von zwei Autoren, die selbst Abi gemacht haben (überlebt).","inLanguage":"de-DE","author":{"@type":"Organization","name":"Paulik & Reisch"},"publisher":{"@id":"https://paulikreisch.de/#organization"},"mainEntityOfPage":"https://paulikreisch.de/ratgeber/abiturgeschenk","image":"https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"},{"@type":"Book","name":"Hallo Welt","author":[{"@type":"Person","name":"Philipp Paulik"},{"@type":"Person","name":"Maximilian Reisch"}],"bookFormat":"https://schema.org/Paperback","numberOfPages":106,"offers":{"@type":"Offer","price":"10.99","priceCurrency":"EUR","availability":"https://schema.org/InStock","url":"https://amzn.eu/d/02nS59t2","seller":{"@type":"Organization","name":"Amazon"}}}]};

export default function Page(){
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
<Header/><main className="flex-1">
<div className="container px-4 md:px-6 py-8"><nav className="text-xs text-muted-foreground mb-4 flex gap-1.5 flex-wrap"><Link href="/" className="hover:underline">Home</Link><span>/</span><Link href="/ratgeber" className="hover:underline">Ratgeber</Link><span>/</span><span className="text-foreground font-medium">abiturgeschenk</span></nav><div className="max-w-3xl"><Badge variant="secondary" className="mb-3">Ratgeber · Paulik &amp; Reisch</Badge><h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-balance">Abiturgeschenk: 25 Ideen + Sprüche, die sitzen</h1><p className="mt-4 text-lg text-muted-foreground leading-relaxed">Abiturgeschenk-Ideen für Abiturient:innen: kreative Geldgeschenke, Karten-Sprüche &amp; Erinnerungsstücke — von zwei Autoren, die selbst Abi gemacht haben (überlebt).</p><div className="mt-6 flex flex-wrap gap-2"><Link href="/shop"><Button>Buch entdecken — 10,99 € <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/worthaft"><Button variant="outline"><Gamepad2 className="mr-2 h-4 w-4"/> Worthaft spielen</Button></Link><Link href="/checkliste"><Button variant="ghost"><FileText className="mr-2 h-4 w-4"/> Checkliste PDF</Button></Link></div></div></div>
<div className="container px-4 md:px-6 pb-4"><div className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/15 dark:border-amber-900/30 p-4 md:p-5 flex gap-4 items-start max-w-3xl"><img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&amp;token=42ce90a3-ed34-49d2-8e09-5258d0dfc484" alt="Hallo Welt Cover" className="w-14 h-20 object-cover rounded-md shadow-sm shrink-0" loading="lazy"/><div className="flex-1 min-w-0"><p className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span> Aus dem Buch — 106 Seiten, 4.8★</p><p className="text-sm md:text-[15px] leading-snug font-medium mt-1">Diese Szene stammt aus <em>Hallo Welt</em> — dort geht es noch tiefer in den Wahnsinn. 10,99 € statt 20,99 € bis Monatsende.</p><Link href="/shop" className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-primary hover:underline">Hier weiterlesen — 10,99 € auf Amazon →</Link></div></div></div>
<article className="container px-4 md:px-6 pb-10 max-w-3xl prose prose-zinc dark:prose-invert lg:prose-lg prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80">
<div dangerouslySetInnerHTML={{__html: `<blockquote>
<p><strong>Kennzeichnung:</strong> Ratgeber: recherchiert &amp; echt. Empfehlungen: satirisch kommentiert, persönlich gemeint. Wir haben selbst Abi gemacht — unser gesamtes Buch <a href="/shop">„Hallo Welt&quot;</a> ist quasi ein verpacktes Abiturgeschenk an die eigene Schulzeit.</p>
</blockquote>
<h1>Abiturgeschenk: 25 Ideen für den Abschied, den keiner vergisst</h1>
<p><strong>Geldgeschenke, Erinnerungsstücke, Karten-Sprüche und die Frage aller Fragen: Was schenkt man jemandem, der gerade 13 Jahre Schule überlebt hat?</strong></p>
<hr>
<h2>TL;DR — das Wichtigste in 30 Sekunden</h2>
<p>Gute Abi-Geschenke folgen der 3-Typen-Logik: <strong>Erinnerung</strong> (das Schulzeit-Buch mit Widmung, das Foto-Werk, das Abizeitschrift-Erinnerungsstück), <strong>Zukunft</strong> (Geld — kreativ verpackt! —, Reisegutschein, Studien-/Ausbildungs-Starterset) oder <strong>Persönliches</strong> (etwas, das nur zu diesem Menschen passt). Die Regeln: Zum letzten Schultag motivieren („Geschafft!&quot;-Sprüche sind verfrüht — die Prüfungen laufen noch), zur Zeugnisübergabe glückwünschen. Geld-Beträge: Freunde 20–50 €, Verwandte 50–200 €, Eltern nach Budget. Und die stärkste Erinnerungs-Strategie: <strong>ein Buch, das die 13 Jahre in 106 Seiten bündelt — mit Widmung.</strong> (Wir haben so eines geschrieben, Sie ahnen es. Unten mehr.) Alle 25 Ideen, Budgets und Sprüche — sortiert und erklärt.</p>
<p><em>Inhalt: 3 Geschenk-Typen · Ideen nach Schenker:in · Geldgeschenk kreativ · Karten-Sprüche · Klassengeschenke · Timing · Nicht bestanden? · FAQ</em></p>
<hr>
<h2>Die 3 Typen des Abi-Geschenks</h2>
<p><strong>Kurzantwort:</strong> Typ 1 Erinnerung (rückwärtsgerichtet, emotional), Typ 2 Zukunft (vorwärtsgerichtet, praktisch), Typ 3 Persönliches (seitwärtsgerichtet, unverwechselbar). Die besten Geschenke kombinieren zwei Typen — z. B. Zukunftsgeld mit Erinnerungs-Karte.</p>
<ol>
<li><strong>Erinnerung:</strong> Das Ziel ist: Der Mensch öffnet es in 20 Jahren und muss sitzen bleiben. (Beispiel gefällig? Ein Buch über die eigene Schulzeit. Mit Widmung der besten Freunde. Fragen Sie uns, warum wir genau das geschrieben haben.)</li>
<li><strong>Zukunft:</strong> Geld, Ausstattung, Reisen. Risiko: Es ist nützlich — und damit völlig vergessen, sobald es ausgegeben ist. Gegenmittel: Verpackung mit Erinnerungs-Faktor (siehe Geldgeschenke).</li>
<li><strong>Persönlich:</strong> Insider-Objekte, Handgemachtes, Verrücktes. Funktioniert nur mit echter Investition. Wer hier billig kauft, hat nur bewiesen, dass er nicht zugehört hat.</li>
</ol>
<h2>25 Ideen, sortiert nach Schenker:in</h2>
<p><strong>Kurzantwort:</strong> Eltern schenken Zukunft + Erinnerung (größere Beträge, emotionale Karte), Verwandte Geld und Praktisches, Freunde Erinnerung und Persönliches, die Klasse das Gemeinschaftswerk (Abizeitschrift, Geschenk zur Zeugnisübergabe).</p>
<p><strong>Von Eltern (6):</strong> ① Geld als Startkapital, verpackt als „Zinseszins-Witz&quot; ② Führerschein-Beitrag ③ Reise nach dem Abi ④ Laptop fürs Studium ⑤ <strong>Das Schulzeit-Buch mit Eltern-Widmung</strong> (<a href="/shop">„Hallo Welt&quot; eignet sich — es heißt schließlich, als würde es die eigene Schulzeit grüßen</a>) ⑥ Familien-Dinner mit Redemöglichkeit für das Kind (der einzige Anlass, wo die Eltern kurz reden und das Kind lang)</p>
<p><strong>Von Verwandten (5):</strong> ⑦ Geld (50–200 €, siehe Kreativ-Sektion) ⑧ Reisegutschein ⑨ Gepäck/Koffer für die Studienstadt ⑩ E-Book-Reader + Buch-Gutschein ⑪ Klassiker mit Wert: Uhr, Schmuck (nur wenn beigeistert bekannt ist, dass gewünscht)</p>
<p><strong>Von Freunden (7):</strong> ⑫ Das Insider-Paket (alle Gegenstände legendärer Schulzeit-Momente) ⑬ Fotoalbum der Freundschaft ⑭ <strong>Gemeinsam gelesenes/lustiges Buch mit Schnitt-Kommentaren</strong> ⑮ Selbstgedrehter Abschiedsfilm ⑯ Ausflug statt Ding (Konzert, Roadtrip) ⑰ „Offene Briefe an dich in 10 Jahren&quot; (Set, verschlossen) ⑱ Der Witz-Gegenstand eurer gemeinsamen Geschichte (jede Freundschaft hat einen)</p>
<p><strong>Von der Klasse (4):</strong> ⑲ Abizeitschrift / Jahrbuch-Alternative ⑳ Das Klassengeschenk zur Zeugnisübergabe ㉑ Gemeinsame Spende/Symbol ㉒ Die Tafel-Fotosession (letzter Schultag, Grundausstattung jedes Abi-Jahrgangs seit Erfindung der Tafel)</p>
<p><strong>Bonus (3):</strong> ㉓ Der „Erwachsenwerden-Starterpack&quot; (Bürokratie-Humor: Aktenordner, Blaulicht-Blatt, „Anleitung: Steuern&quot; — <em><a href="/ratgeber/beamtendeutsch/">der Humor übrigens frei nach unserem Band 2-Thema: Bürokratie</a></em>) ㉔ Abo oder Mitgliedschaft (Zukunft mit Laufzeit) ㉕ Die Karte, die alles richtig macht (siehe unten)</p>
<h2>Geldgeschenk zum Abi: kreativ verpacken (die 5 besten Formate)</h2>
<p><strong>Kurzantwort:</strong> Geld kreativ verschenken heißt: das Geld in ein Erlebnis oder eine Geschichte einpacken — als Geldbaum, Gutscheinkette mit Aufträgen, Geld im „Ernstfall-Glas&quot;, als Zettel-Puzzle oder im Buch (Geldscheine als Lesezeichen in einem Buch über die Schulzeit — clevereste Form aller Zeiten, sehr objektiv bewertet).</p>
<ol>
<li><strong>Der Geldbaum:</strong> Notizen als Blätter, Zweig in der Vase. Klassiker, funktioniert seit Generationen — weil Generationen nichts daran verbessern konnten.</li>
<li><strong>Die Gutscheinkette:</strong> Jeder Schein mit einem Auftrag („Für den ersten stressigen Semesterwochenende-Snack&quot;).</li>
<li><strong>Das Ernstfall-Glas:</strong> Glas mit Deckel, Geld drin, Aufschrift „Aufbrechen bei akuter Studien-Wochenende-Not&quot;. Emotion + Funktion.</li>
<li><strong>Das Zettel-Puzzle:</strong> Geldscheine + Erinnerungszettel gefaltet, Auflösung am Ende.</li>
<li><strong>Das Buch-Lesezeichen:</strong> Scheine als Lesezeichen in ein Buch über die Schulzeit — das Geld geht sofort ins Portemonnaie, <strong>das Buch bleibt 30 Jahre</strong>. (Falls Sie ein passendes Buch suchen: <a href="/shop">hm, hm</a>.)</li>
</ol>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/abiturgeschenk/geldgeschenk-abitur-kreativ/">Geldgeschenk Abi: 15 kreative Verpackungen mit Anleitung</a> · <a href="/ratgeber/abiturgeschenk/wie-viel-geld-zum-abi/">Geld zum Abi: Wie viel ist üblich?</a></p>
<h2>Abi-Sprüche für Karten (die guten, nicht die 08/15)</h2>
<p><strong>Kurzantwort:</strong> Gute Abi-Sprüche sind konkret, persönlich und frei von Stereotyp-Kitsch. Struktur: (1) gemeinsame Erinnerung, (2) ehrlicher Satz, (3) Augenzwinkern in die Zukunft.</p>
<p>Beispiele (frei zum Kopieren, gerne anpassen):</p>
<ul>
<li>„13 Jahre, in denen du vor allem eines gelernt hast: durchzuhalten. Das zahlst du jetzt ein.&quot;</li>
<li>„Für die Prüfungen hattest du einen Plan. Für danach auch — er heißt jetzt Leben.&quot;</li>
<li>„Schule hat dir beigebracht, Fragen zu beantworten. Jetzt lernst du, welche du stellen sollst.&quot;</li>
<li>„Wir sind zusammen in die erste Klasse gegangen — und du gehst als erster da raus. Sei stolz.&quot;</li>
<li>„Jetzt weißt du, was einen guten von einem austauschbaren Abi-Spruch trennt: konkrete Erinnerungen. (Danke für unsere.)&quot;</li>
</ul>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/abiturgeschenk/abi-sprueche-lustig/">120 Abi-Sprüche: lustig, kurz, für Karten &amp; Social Media</a> · <a href="/ratgeber/abiturgeschenk/abitur-karte-texte/">Karten-Texte für Eltern &amp; Verwandte</a></p>
<h2>Klassengeschenke &amp; Abizeitschrift</h2>
<p><strong>Kurzantwort:</strong> Klassengeschenke zum Abi funktionieren, wenn alle mitmachen durften (freiwillig!), sichtbar gemeinsame Handschrift haben und zur Zeugnisübergabe überreicht werden. Abizeitschrift-Alternativen: das gemeinsame Buch der Zitate, der Film, die Ausstellung.</p>
<p>Organisation: Sammel-Vater/-Mutter mit Liste (bundesdeutsches Naturgesetz), Deadline 6 Wochen vor Zeugnisübergabe, Budget-Deckel (keine pressure), Übergabe mit einem Satz pro Schüler:in.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/abiturgeschenk/abschiedsgeschenk-klasse/">Klassengeschenk Abi: die 10 besten Konzepte</a> · <a href="/ratgeber/abiturgeschenk/abizeitschrift-alternative/">Abizeitschrift-Alternativen für kleine Budgets</a></p>
<h2>Timing: Wann schenkt man was?</h2>
<p><strong>Kurzantwort:</strong> Letzter Schultag (vor den Prüfungen): Ermutigung, Humor, Abschied von der Schulzeit. Prüfungszeit: nichts (oder Pizza). Zeugnisübergabe/Abiball: die große Glückwunsch-Version. Danach: Reisegeschenke/Sommerversion.</p>
<table>
<thead>
<tr>
<th>Moment</th>
<th>Geschenk-Typ</th>
<th>Beispiel</th>
</tr>
</thead>
<tbody><tr>
<td>Letzter Schultag</td>
<td>Abschied &amp; Mut</td>
<td>Buch über die Schulzeit, Klassengeschenk</td>
</tr>
<tr>
<td>Prüfungsphase</td>
<td>Survivalkit</td>
<td>Snacks, Good-Luck-Karte, Pizza-Gutschein</td>
</tr>
<tr>
<td>Zeugnisübergabe</td>
<td>Glückwunsch groß</td>
<td>Geld + Erinnerung</td>
</tr>
<tr>
<td>Abiball</td>
<td>Emotional</td>
<td>Schmuck-Uhr-Upgrade oder die Widmungs-Ausgabe</td>
</tr>
<tr>
<td>Sommer danach</td>
<td>Zukunft</td>
<td>Reise, Startkapital</td>
</tr>
</tbody></table>
<h2>Wenn das Abi nicht bestanden wurde (der unterschätzte Abschnitt)</h2>
<p><strong>Kurzantwort:</strong> Trösten ohne Herablassen: Erinnerungen statt „Geschafft&quot;-Geschenke, Zukunftsperspektiven konkret aufzeigen (Nachprüfung, Wiederholung, Alternativwege mit Aufstiegsoptionen), und die Botschaft senden: Ein Abschluss ist ein Kapitel, nicht das Buch.</p>
<p>Die drei Sätze, die helfen: „Das ist ein Kapitel, kein Urteil.&quot; — „Optionen bleiben Optionen, auch morgen.&quot; — „Ich bin da.&quot; Die drei Sätze, die nicht helfen: „Wusstest du, dass Einstein…&quot; (Nein. Lassen.) / „Vielleicht warst du einfach nicht…&quot; (NICHT.) / „Wenigstens…&quot; (Aus. Ende. Verbeugung.)</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/abiturgeschenk/abi-nicht-bestanden-troesten/">Abi nicht bestanden: die 7 nächsten Schritte</a></p>
<h2>Das Geschenk, das 13 Jahre in 106 Seiten bündelt</h2>
<p>Unsere Empfehlung für den Typ „Erinnerung&quot;: <strong>„Hallo Welt — Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S&quot;</strong> — ein Buch, in dem die komplette Schulzeit steckt: Episoden, Wahnsinn, Zeugnissprache, Vertretungsstunden, alles. Mit Widmungsseite. Von zwei Autoren, die das Abi überlebt haben (die Narben tragen sie in Fußnoten). 5,0 Sterne, 10,99 €, auch als E-Book &amp; Gratis-Hörbuch.</p>
<p><strong><a href="/shop">→ „Hallo Welt&quot; als Abi-Geschenk ansehen</a></strong> · <strong><a href="/exzerpte">Gratis-Leseproben</a></strong> · <strong><a href="/#newsletter">Newsletter: 1×/Woche Satire</a></strong></p>
<hr>
<h2>Häufige Fragen</h2>
<p><em>(FAQ-Inhalte 1:1 aus dem JSON-LD-Block oben rendern.)</em></p>
<hr>
<p><em>Geschrieben von <strong>Philipp Paulik &amp; Maximilian Reisch</strong> — Abi überlebt, Buch darüber geschrieben, jetzt Professionelle in Sachen Abschied. <a href="/ueber/max-reisch">Über die Autoren</a></em></p>
<hr>
<h2>🗂️ CLUSTER-PLAN für Pillar 4 (12 Stück)</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Cluster-URL (<code>/ratgeber/abiturgeschenk/…</code>)</th>
<th>Fokus-Keyword</th>
<th>Priorität</th>
</tr>
</thead>
<tbody><tr>
<td>4.1</td>
<td><code>geldgeschenk-abitur-kreativ</code></td>
<td>geldgeschenk abitur kreativ</td>
<td>⭐⭐⭐ (Snippet!)</td>
</tr>
<tr>
<td>4.2</td>
<td><code>abi-sprueche-lustig</code></td>
<td>abi sprüche lustig</td>
<td>⭐⭐⭐ (Volumen!)</td>
</tr>
<tr>
<td>4.3</td>
<td><code>wie-viel-geld-zum-abi</code></td>
<td>wie viel geld zum abi</td>
<td>⭐⭐⭐</td>
</tr>
<tr>
<td>4.4</td>
<td><code>abitur-karte-texte</code></td>
<td>abitur glückwünsche karte</td>
<td>⭐⭐⭐</td>
</tr>
<tr>
<td>4.5</td>
<td><code>abschiedsgeschenk-klasse</code></td>
<td>abschiedsgeschenk klasse abitur</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>4.6</td>
<td><code>geschenk-abi-junge</code></td>
<td>geschenk abi junge / junge abiturient</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>4.7</td>
<td><code>geschenk-abi-maedchen</code></td>
<td>geschenk abiturientin</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>4.8</td>
<td><code>abi-geschenk-beste-freundin</code></td>
<td>abi geschenk beste freundin</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>4.9</td>
<td><code>abi-geschenk-eltern</code></td>
<td>abi geschenk von eltern</td>
<td>⭐⭐</td>
</tr>
<tr>
<td>4.10</td>
<td><code>abizeitschrift-alternative</code></td>
<td>abizeitschrift alternative</td>
<td>⭐</td>
</tr>
<tr>
<td>4.11</td>
<td><code>abi-nicht-bestanden-troesten</code></td>
<td>abi nicht bestanden / durchgefallen</td>
<td>⭐⭐ (AEO!)</td>
</tr>
<tr>
<td>4.12</td>
<td><code>geschenk-letzter-schultag</code></td>
<td>geschenk letzter schultag</td>
<td>⭐⭐</td>
</tr>
</tbody></table>
<h2>🎣 PROMO-HOOKS</h2>
<ol>
<li><strong>Neugier:</strong> „Das Abi-Geschenk, das alle anderen kopieren werden — 25 Ideen in 6 Minuten.&quot;</li>
<li><strong>Schmerz:</strong> „Geld im weißen Umschlag? Für die wichtigsten 13 Jahre? Besser wird&#39;s — und zwar hier.&quot;</li>
<li><strong>Brand:</strong> „13 Jahre Schule, 106 Seiten, eine Widmung: das Abi-Geschenk mit Erinnerungs-Garantie.&quot;</li>
</ol>
<h2>🔗 VERLINKUNGS-PFLICHTEN</h2>
<ul>
<li><strong>Lateral:</strong> <code>/ratgeber/geschenk-lehrer/</code> („Geschenk für die Lehrkraft zum Abschied? Hier&quot;), <code>/ratgeber/zeugnissprache/</code> („Was steht dann im Abi-Zeugnis?&quot;), <code>/ratgeber/schulalltag/</code> („was da alles reingeht in die 13 Jahre&quot;), <code>/ratgeber/satire-schreiben/</code>.</li>
<li><strong>CTA:</strong> /shop (Widmungs-Argument!), /exzerpte, Newsletter.</li>
<li><strong>Bottom-up:</strong> alle Cluster → hierher („unser großes Abi-Geschenk-Lexikon&quot;).</li>
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
