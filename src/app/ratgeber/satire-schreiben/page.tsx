import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Gamepad2, ArrowRight, Sparkles, Gift, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Satire schreiben: Merkmale, Stilmittel & Anleitung | Paulik & Reisch",
  description: "Satire schreiben, endlich verständlich: Merkmale, Stilmittel, Aufbau & 27 Themen — von den Autoren der Satire-Reihe „Hallo Welt\". Mit Beispielen.",
  keywords: ["satire schreiben","was ist satire","satire merkmale","satire stilmittel","satire beispiele","satire aufbau","satire themen","satire analyse","satire definition","satire ironie unterschied"],
  alternates: { canonical: "/ratgeber/satire-schreiben" },
  openGraph: {
    title: "Satire schreiben: Merkmale, Stilmittel & Anleitung",
    description: "Satire schreiben, endlich verständlich: Merkmale, Stilmittel, Aufbau & 27 Themen — von den Autoren der Satire-Reihe „Hallo Welt\". Mit Beispielen.",
    url: "https://paulikreisch.de/ratgeber/satire-schreiben",
    siteName: "Paulik & Reisch",
    locale: "de_DE",
    type: "article",
    images: [{ url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7", width: 1200, height: 630, alt: "Satire schreiben: Merkmale, Stilmittel & Anleitung" }],
  },
  twitter: { card: "summary_large_image", title: "Satire schreiben: Merkmale, Stilmittel & Anleitung", description: "Satire schreiben, endlich verständlich: Merkmale, Stilmittel, Aufbau & 27 Themen — von den Autoren der Satire-Reihe „Hallo Welt\". Mit Beispielen.", images: ["https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"] },
  robots: { index: true, follow: true },
};

const jsonLd = {"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://paulikreisch.de/#organization","name":"Paulik & Reisch","url":"https://paulikreisch.de","logo":{"@type":"ImageObject","url":"https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522"}},{"@type":"WebSite","@id":"https://paulikreisch.de/#website","url":"https://paulikreisch.de","name":"Paulik & Reisch","publisher":{"@id":"https://paulikreisch.de/#organization"},"inLanguage":"de-DE"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://paulikreisch.de/"},{"@type":"ListItem","position":2,"name":"Ratgeber","item":"https://paulikreisch.de/ratgeber"},{"@type":"ListItem","position":3,"name":"Satire schreiben: Merkmale, Stilmittel & Anleitung","item":"https://paulikreisch.de/ratgeber/satire-schreiben"}]},{"@type":"Article","headline":"Satire schreiben: Merkmale, Stilmittel & Anleitung","description":"Satire schreiben, endlich verständlich: Merkmale, Stilmittel, Aufbau & 27 Themen — von den Autoren der Satire-Reihe „Hallo Welt\". Mit Beispielen.","inLanguage":"de-DE","author":{"@type":"Organization","name":"Paulik & Reisch"},"publisher":{"@id":"https://paulikreisch.de/#organization"},"mainEntityOfPage":"https://paulikreisch.de/ratgeber/satire-schreiben","image":"https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7"},{"@type":"Book","name":"Hallo Welt","author":[{"@type":"Person","name":"Philipp Paulik"},{"@type":"Person","name":"Maximilian Reisch"}],"bookFormat":"https://schema.org/Paperback","numberOfPages":106,"offers":{"@type":"Offer","price":"10.99","priceCurrency":"EUR","availability":"https://schema.org/InStock","url":"https://amzn.eu/d/02nS59t2","seller":{"@type":"Organization","name":"Amazon"}}}]};

export default function Page(){
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
<Header/><main className="flex-1">
<div className="container px-4 md:px-6 py-8"><nav className="text-xs text-muted-foreground mb-4 flex gap-1.5 flex-wrap"><Link href="/" className="hover:underline">Home</Link><span>/</span><Link href="/ratgeber" className="hover:underline">Ratgeber</Link><span>/</span><span className="text-foreground font-medium">satire-schreiben</span></nav><div className="max-w-3xl"><Badge variant="secondary" className="mb-3">Ratgeber · Paulik & Reisch</Badge><h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-balance">Satire schreiben: Merkmale, Stilmittel &amp; Anleitung</h1><p className="mt-4 text-lg text-muted-foreground leading-relaxed">Satire schreiben, endlich verständlich: Merkmale, Stilmittel, Aufbau &amp; 27 Themen — von den Autoren der Satire-Reihe „Hallo Welt&quot;. Mit Beispielen.</p><div className="mt-6 flex flex-wrap gap-2"><Link href="/shop"><Button>Buch entdecken — 10,99 € <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/worthaft"><Button variant="outline"><Gamepad2 className="mr-2 h-4 w-4"/> Worthaft spielen</Button></Link><Link href="/checkliste"><Button variant="ghost"><FileText className="mr-2 h-4 w-4"/> Checkliste PDF</Button></Link></div></div></div>
<div className="container px-4 md:px-6 pb-4"><div className="not-prose my-6 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/15 dark:border-amber-900/30 p-4 md:p-5 flex gap-4 items-start max-w-3xl"><img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484" alt="Hallo Welt Cover" className="w-14 h-20 object-cover rounded-md shadow-sm shrink-0" loading="lazy"/><div className="flex-1 min-w-0"><p className="text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span> Aus dem Buch — 106 Seiten, 4.8★</p><p className="text-sm md:text-[15px] leading-snug font-medium mt-1">Diese Szene stammt aus <em>Hallo Welt</em> — dort geht es noch tiefer in den Wahnsinn. 10,99 € statt 20,99 € bis Monatsende.</p><Link href="/shop" className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-primary hover:underline">Hier weiterlesen — 10,99 € auf Amazon →</Link></div></div></div>
<article className="container px-4 md:px-6 pb-10 max-w-3xl prose prose-zinc dark:prose-invert lg:prose-lg prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80">
<div dangerouslySetInnerHTML={{__html: `<blockquote>
<p><strong>Kennzeichnung:</strong> Fakten: echt und geprüft. Ton: Satire. Genau so arbeiten wir auch an unserer Buchreihe „Hallo Welt&quot;. <em>(Badge über der TL;DR-Box)</em></p>
</blockquote>
<h1>Satire schreiben: Wie man Kritik so verpackt, dass sie sitzt</h1>
<p><strong>Zwei Autoren, ein Wortwitz, null Gnade: alles, was du über Satire wissen musst — von der Definition bis zur eigenen Pointe.</strong></p>
<hr>
<h2>Das Wichtigste in 30 Sekunden (TL;DR)</h2>
<p>Satire ist eine Kunstform, die Missstände durch Übertreibung, Ironie und Spott entlarvt — der Begriff kommt vom lateinischen <em>satura lanx</em>, der „mit Früchten gefüllten Schale&quot;. Eine gute Satire erkennst du an sechs Merkmalen: Übertreibung, Ironie, Spott, Verfremdung, echtem Kritikziel und realem Bezug. Um selbst Satire zu schreiben, brauchst du vier Zutaten: einen Missstand, den du wirklich loswerden willst, eine Haltung (zornig? melancholisch? unbeteiligt-nüchtern?), eine satirische Methode (übertreiben, verfremden, untertreiben, perspektivwechseln) und eine Pointe, die eher ausholt als zuschlägt. Satire ist rechtlich durch die Kunstfreiheit geschützt, endet aber bei Schmähkritik ohne Inhalt, Beleidigung und Volksverhetzung. Und das Beste: Satire kann man lernen — wir haben es auch. Auf dieser Seite findest du alles: Merkmale, Stilmittel mit Beispielen, den Aufbau in 7 Schritten, 27 Themen, die Anleitung für die Satire-Analyse im Deutschunterricht und die Frage, wie man Satire veröffentlicht (wir haben&#39;s per Selfpublishing gemacht).</p>
<p><em>Inhaltsverzeichnis: Was ist Satire · Merkmale · Stilmittel · Satire vs. Ironie · In 7 Schritten schreiben · 27 Themen · Beispiele · Analyse · Grenzen · Satire heute · Veröffentlichen · FAQ</em></p>
<hr>
<h2>Was ist Satire? (Definition, die auch dein Deutschlehrer akzeptiert)</h2>
<p><strong>Kurzantwort:</strong> Satire ist eine Text-, Bild- oder Kunstform, die gesellschaftliche, politische oder alltägliche Missstände mit den Mitteln des Humors — vor allem Übertreibung und Ironie — kritisiert und der Lächerlichkeit preisgibt. Das Wort stammt vom lateinischen <em>satura lanx</em> („mit Früchten gefüllte Schale&quot;) und meint: ein buntes, gemischtes Ganzes.</p>
<p>Die entscheidende Zutat, die viele vergessen: <strong>Satire braucht ein echtes Kritikziel.</strong> Ein Witz ohne Ziel ist ein Gag. Eine Übertreibung ohne Ziel ist Blödelei. Satire mit Ziel ist ein Sprengkopf mit lachhafter Zündschnur. (Das haben wir in der Schule gelernt. Indem wir alles andere ignoriert haben.)</p>
<p>Historisch reicht die Form von Aristophanes&#39; „Die Wolken&quot; (423 v. Chr., über einen gewissen Sokrates) über Horaz und Juvenal (die römischen Urväter der <em>satura</em>) bis zu Jonathan Swift, der 1729 mit „A Modest Proposal&quot; vorschlug, irische Babies zu essen — um auf die Hungersnot hinzuweisen. Der Vorschlag war ernst gemeint im hintersten Sinne: nämlich als Anklage. Genau das ist die Mechanik bis heute.</p>
<h2>Die 6 Merkmale einer Satire (Checkliste)</h2>
<p><strong>Kurzantwort:</strong> Die sechs Kernmerkmale sind Übertreibung (Hyperbel), Ironie (Gegenteil des Gesagten), Spott, Verfremdung (Bekanntes in neuem Kontext), ein erkennbares Kritikziel und der Realitätsbezug — die Satire zitiert die Wirklichkeit, sie erfindet sie nicht komplett.</p>
<ol>
<li><strong>Übertreibung (Hyperbel):</strong> „Der Unterricht dauerte gefühlt drei Jahreszeiten.&quot;</li>
<li><strong>Ironie:</strong> „Tausend Dank für diese 20 Sekunden Verständnis, Frau Lehrerin.&quot;</li>
<li><strong>Spott:</strong> Direkte Entlarvung durch Zuspitzung — „Das Heftführungsprinzip: Ordnung ist das halbe Leben, die andere Hälfte verbringt man mit dem Ordnen.&quot;</li>
<li><strong>Verfremdung:</strong> Der Schulalltag als „Lernvollzugsanstalt&quot; — plötzlich hörst du hin.</li>
<li><strong>Kritikziel:</strong> Ohne Ziel keine Satire. Immer fragen: Was will ich eigentlich?</li>
<li><strong>Realitätsbezug:</strong> Jede:r Leser:in muss nicken können — „genau so ist es&quot;.</li>
</ol>
<p>→ <strong>Vertiefung:</strong> Alle Stilmittel mit je 3 Beispielen haben wir hier aufbereitet: <a href="/ratgeber/satire-schreiben/stilmittel-mit-beispielen/">Die 15 Stilmittel der Satire — mit Beispielen</a>.</p>
<h2>Satire, Ironie, Sarkasmus, Parodie, Glosse — die Unterschiede endlich klären</h2>
<p><strong>Kurzantwort:</strong> Ironie und Sarkasmus sind Stilmittel (Ironie: Gegenteil sagen; Sarkasmus: verletzende Ironie), Parodie und Glosse sind Textformen (Parodie: nachahmender Stilspaß; Glosse: kurze meinungsstarke Kolumne), Satire ist die übergeordnete Kritikform, die alle diese Mittel einsetzen kann.</p>
<table>
<thead>
<tr>
<th>Form</th>
<th>Was es ist</th>
<th>Beispiel</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Ironie</strong></td>
<td>Stilmittel: Gegenteil des Gemeinten</td>
<td>„Super, schon wieder Baustelle.&quot;</td>
</tr>
<tr>
<td><strong>Sarkasmus</strong></td>
<td>Zähnefletschende Ironie, auf Personen zielend</td>
<td>„Krass, du hast den Termin vergessen, was für eine unerwartete Wendung.&quot;</td>
</tr>
<tr>
<td><strong>Zynismus</strong></td>
<td>Haltung: die Verachtung der Werte selbst</td>
<td>„Gerechtigkeit? Süße Illusion.&quot;</td>
</tr>
<tr>
<td><strong>Parodie</strong></td>
<td>Übertriebene Nachahmung eines Stils/Werks</td>
<td>Ein Sendung-mit-der-Maus-Intro, das Behördenformulare erklärt</td>
</tr>
<tr>
<td><strong>Glosse</strong></td>
<td>Kurze, subjektive Kolumne mit Pointe</td>
<td>300 Zeilen über die Zumutung von Sitzordnungen</td>
</tr>
<tr>
<td><strong>Karikatur</strong></td>
<td>Bildliche Satire</td>
<td>Das Schlussbild zu diesem Guide</td>
</tr>
<tr>
<td><strong>Satire</strong></td>
<td>Die Kritikform, die alle obigen benutzen darf</td>
<td>„Hallo Welt&quot; (unbescheiden, aber wahr)</td>
</tr>
</tbody></table>
<p>Merksatz für die Klausur: <strong>Parodie macht sich über die Form lustig, Satire über den Inhalt, Ironie über die Aussage.</strong> Und die Glosse macht sich über alles lustig, weil sie Mittwoch ist.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/satire-schreiben/satire-ironie-parodie-unterschied/">Satire vs. Parodie vs. Glosse: der große Vergleich</a></p>
<h2>Satire schreiben in 7 Schritten (die Anleitung)</h2>
<p><strong>Kurzantwort:</strong> Gute Satire entsteht in sieben Schritten: Missstand finden, Kritikziel definieren, Haltung wählen, satirische Methode bestimmen, Realitätsanker setzen, Pointe konstruieren, Rechtsgrenze prüfen. Der wichtigste Schritt ist der letzte: Die beste Pointe nützt nichts, wenn sie dich vor den Kadi bringt.</p>
<p><strong>Schritt 1 — Missstand finden.</strong> Nichts ist satirischer als die Realität — du musst sie nur fotografieren. Frag dich: Was ärgert dich so sehr, dass du es anderen erklären musst? (Bei uns: Schule. 13 Jahre Feldforschung.)</p>
<p><strong>Schritt 2 — Kritikziel definieren.</strong> „Die Schule&quot; ist zu groß. „Das Prinzip Referat: 10 Minuten Redezeit, 9 Minuten Todesangst, 1 Minute Erleichterung&quot; ist ein Ziel.</p>
<p><strong>Schritt 3 — Haltung wählen.</strong> Zornig (Juvenal), lächelnd-melancholisch (Tucholsky) oder nüchtern-beobachtend (Brecht-Linie)? Die Haltung ist deine Stimme. Unsere ist: liebenswert unerbittlich.</p>
<p><strong>Schritt 4 — Methode bestimmen.</strong> Übertreibung? Untertreibung? Perspektivwechsel (die Klassenarbeit erzählt aus Sicht des Bleistifts)? Scheinlogik (die Bürokratie als Kunstwerk ernst genommen)? Imitation (das Elternschreiben im Behördenstil)?</p>
<p><strong>Schritt 5 — Realitätsanker setzen.</strong> Je echter dein Detail („Antrag in dreifacher Ausführung&quot;), desto härter die Satire. Erfindung ist Blase, Detail ist Beweis.</p>
<p><strong>Schritt 6 — Pointe konstruieren.</strong> Die Pointe ist ein unverhoffter Rechter Haken nach freundlichem Zugeständnis. Aufbau: erst mitgehen („Ordnung ist das halbe Leben…&quot;), dann umdrehen („…die andere Hälfte verbringt man damit, Hefte zu ordnen&quot;). Timing: kurz. Satire atmet in kurzen Sätzen und langen Gedanken.</p>
<p><strong>Schritt 7 — Rechtsgrenze prüfen.</strong> Unten mehr. Faustregel: <strong>Punch up, not down.</strong> Satire zielt auf Systeme, Mächtige, Mechanismen — nicht auf Menschen, die sich nicht wehren können.</p>
<p>→ <strong>Vertiefung mit Übungen:</strong> <a href="/ratgeber/satire-schreiben/satire-aufbau-in-7-schritten/">Der Satire-Aufbau: Struktur, Gliederung, 3 Muster</a> · <a href="/ratgeber/satire-schreiben/satire-schreiben-uebungen/">Satire-Schreibübungen für Anfänger:innen</a></p>
<h2>27 Satire-Themen, die immer funktionieren</h2>
<p><strong>Kurzantwort:</strong> Die ergiebigsten Satire-Themen sind ewige Missstände mit täglichem Anlass: Schule, Bürokratie, Technik, Höflichkeit, Konsum, Arbeitswelt, Medien, Social-Media-Verhalten, Deutschlands Eigenarten — und alles, was „schon immer so gemacht wird&quot;.</p>
<p>Kurze Auswahl (alle 27 mit Angeln im Cluster): Zeugnissprache · Sitzordnungen · Vertretungsstunden · Heftführung · Betriebsversammlungen · Antrag in dreifacher Ausführung · Warteschleifen · „Wir nehmen Ihr Anliegen ernst&quot; · Handynutzung am Esstisch · Small Talk über Wetter · Karneval · Deutsche Baustellen · Pünktlichkeitswahn · fitnessstudio-Etikette · Bahnsteigansagen · Kassensysteme · Benutzerhandbücher · Cookie-Banner · Fastenzeit-Verhandlungen mit dem eigenen Kalender · Büro-Kaffeeküchen-Regeln · Mindesthaltbarkeit von Gut-vorsätze · Ranking-Logik von Streamingdiensten · „unser Team&quot;-Webseiten · Schul-Turnhallengeruch (universell) · Elternabende · WhatsApp-Familiengruppen · Konferenz-Sprech („Wir sollten das mal synergistisch denken&quot;).</p>
<p>→ <strong>Die komplette Themenliste mit Einstiegs-Sätzen:</strong> <a href="/ratgeber/satire-schreiben/satire-themen-finden/">27 Satire-Themen + wie du dein eigenes findest</a></p>
<h2>Die besten Satire-Beispiele (klassisch &amp; modern)</h2>
<p><strong>Kurzantwort:</strong> Klassische Satire-Beispiele sind Swifts „A Modest Proposal&quot; (1729), Voltaires „Candide&quot; (1759) und Tucholskys „Deutschland, Deutschland über alles&quot; (1929); moderne Beispiele sind Orwells „Farm der Tiere&quot; (1945), das Satiremagazin Titanic (seit 1979), Klings „Känguru-Chroniken&quot; (2009) und der Postillon (seit 2008) — bis runter zu Memes, die in 12 Sekunden dasselbe tun was Swift 3.000 Wörter brauchte.</p>
<p>Was sie eint: das Ziel. Swift kritisierte die englische Ausbeutung Irlands — mit einem Kinderrezept als Sprache der Ökonomie. Voltaire kritisierte den Optimismus — mit einem Helden, dem alles Mögliche zustößt (Erdbeben, Inquisition, Syphilis — historisch ziemlich akkurat, leider). Und der Postillon kritisiert Medienrealität, indem er sie nur 5 % überzeichnet. Die beste Satire ist die, bei der man zweimal hinschauen muss, ob sie echt ist.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/satire-schreiben/satire-beispiele-analysiert/">Die 20 besten Satire-Beispiele — analysiert</a> · <a href="/ratgeber/satire-schreiben/satire-kurzgeschichte-beispiele/">Satire-Kurzgeschichten: 8 Muster zum Nachschreiben</a></p>
<h2>Satire analysieren (für Schule, Abi &amp; Referat)</h2>
<p><strong>Kurzantwort:</strong> Eine Satire-Analyse in 5 Schritten: Inhalt zusammenfassen, Kritikziel bestimmen, Stilmittel mit Beleg und Wirkung benennen, Haltung/Sprechsituation klären, beabsichtigte Wirkung auf die Leserschaft begründen. Das Zauberwort für die Note: „Wirkung&quot; — nicht „der Autor benutzt Ironie&quot;, sondern „die Ironie bewirkt, dass…&quot;.</p>
<ol>
<li><strong>Inhaltsangabe</strong> (Präsens, knapp)</li>
<li><strong>Kritikziel:</strong> Was wird angegriffen? (Textstelle belegen!)</li>
<li><strong>Stilmittel + Wirkung:</strong> Übertreibung (Z. 12) bewirkt Entlarvung durch Zuspitzung…</li>
<li><strong>Sprechsituation:</strong> Wer erzählt? Ironischer Erzähler? Naiver Ich-Erzähler (der nichts merkt — stärkstes Satire-Werkzeug!)?</li>
<li><strong>Wirkungsabsicht:</strong> Was soll die Leserschaft tun/fühlen/erkennen?</li>
</ol>
<p><strong>Abi-relevanter Merksatz:</strong> Satire ist immer <em>indirekte</em> Kritik — die Analyse muss zeigen, wie die indirekte Ebene gebaut ist. Wer nur Zusammenfassung schreibt, hat die Satire nicht verstanden, nur bestaunt.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/satire-schreiben/satire-analyse-anleitung/">Satire-Analyse Schritt für Schritt + Musteranalyse</a></p>
<h2>Grenzen der Satire: Was erlaubt, was verboten?</h2>
<p><strong>Kurzantwort:</strong> In Deutschland ist Satire durch die Kunstfreiheit (Art. 5 Abs. 3 GG) geschützt; auch Schmähkritik kann von der Kunstfreiheit gedeckt sein (BVerfG bestätigte 2018 die Aufhebung der Böhmermann-Straffreiheits-Entscheidung zugunsten einer neuen Prüfung). Grenzen: Beleidigung (§ 185 StGB), üble Nachrede (§ 186), Verleumdung (§ 187) und Volksverhetzung (§ 130).</p>
<p>Die Linie, an der wir uns orientieren: <strong>Systeme ja, Einzelpersonen mit Schutzbedarf nein, und die Pointe muss mehr sein als die Herabsetzung.</strong> Wenn der ganze „Witz&quot; darin besteht, dass jemand dumm aussieht, ist es keine Satire, sondern ein Schulhof-Kommentar mit größerem Wortschatz.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/satire-schreiben/satire-recht-grenzen/">Satire &amp; Recht: Kunstfreiheit, Schmähkritik, die 4 Regeln</a></p>
<h2>Satire heute: Vom Postillon bis zum 12-Sekunden-Meme</h2>
<p><strong>Kurzantwort:</strong> Aktuelle Satire lebt vor allem digital: Nachrichten-Satire (Postillon, heute-show, ZDF Magazin Royale), Print (Titanic), Bücher (Känguru-Chroniken, „Hallo Welt&quot;), Podcasts, Social-Media-Memes und Parodie-Accounts. Die Aufmerksamkeitsspanne sinkt, das Kritikziel bleibt.</p>
<p>Für Schreibende heißt das: Der Markt ist offen. News-Satire ist hart umkämpft — Nischen-Satire (Schule! Bürokratie! deutsche Sprache!) sind fast unbesetzt. Genau deshalb existiert dieser Guide und unsere Buchreihe.</p>
<p>→ <strong>Vertiefung:</strong> <a href="/ratgeber/satire-schreiben/satire-landschaft-2026/">Die Satire-Landschaft 2026: wer macht was?</a> <em>(übernimmt Inhalt von /wiki/satire-landschaft)</em></p>
<h2>Satire veröffentlichen (wie wir es gemacht haben)</h2>
<p><strong>Kurzantwort:</strong> Satire veröffentlichen geht heute ohne Verlag: über Selfpublishing-Plattformen wie Kindle Direct Publishing (Taschenbuch + E-Book), Eigen-Website, Newsletter, Social Media oder Literaturwettbewerbe. Unser Weg: KDP fürs Buch, die eigene Website für Artikel, ein wöchentlicher Newsletter für die Gemeinde.</p>
<p>Wir schreiben das ungeschönt: „Hallo Welt&quot; (Band 1) ist über KDP erschienen — 106 Seiten, illustriert von Luin Schiffbauer, 5,0 Sterne. Der Weg dorthin war: Texte schreiben, roh und ehrlich, Illustration, Cover, Upload, fertig. Was folgt, ist der eigentliche Job: Menschen erreichen. (Deshalb liest du diese Zeilen. Es funktioniert.)</p>
<p>→ <strong>Der komplette Weg:</strong> <a href="/ratgeber/satire-schreiben/buch-selbst-veroeffentlichen-kdp/">Buch veröffentlichen bei Amazon KDP — unser Erfahrungsbericht</a></p>
<hr>
<h2>Häufige Fragen zur Satire</h2>
<p><strong>Was ist Satire?</strong>
Eine Kunstform, die Missstände durch Humor — vor allem Übertreibung und Ironie — kritisiert. Vom lateinischen <em>satura lanx</em> („gefüllte Schale&quot;). Sie will unterhalten <em>und</em> aufklären; wenn sie nur unterhält, ist sie Comedy, wenn sie nur anklagt, ist es Pamphlet.</p>
<p><strong>Welche Merkmale hat Satire?</strong>
Übertreibung, Ironie, Spott, Verfremdung, Kritikziel, Realitätsbezug. Die Kombination macht&#39;s: Übertreibung ohne Ziel ist Blödelei, Ziel ohne Humor ist Beschwerdebrief.</p>
<p><strong>Was ist der Unterschied zwischen Satire und Ironie?</strong>
Ironie ist ein einzelnes Stilmittel (Gegenteil sagen), Satire ist die ganze kritische Textform. Satire kann ironiebefreit funktionieren (z. B. rein über Übertreibung), Ironie braucht kein kritisches Ziel.</p>
<p><strong>Wie schreibe ich eine Satire für die Schule?</strong>
Missstand aus deinem Alltag wählen (Schulallbart ist unerschöpflichlich), Haltung festlegen, mit Scheinlogik oder Übertreibung durchziehen, Realitätsdetails einbauen, auf eine Pointe hinführen. Für die Schule: Kritikziel in der Einleitung erkennbar machen, Stilmittel gezielt (nicht alle!) einsetzen.</p>
<p><strong>Darf Satire alles?</strong>
Nein. Kunstfreiheit schützt viel (auch Unsittliches, Spitzes, Böhmermann&#39;sches), endet aber bei reiner Schmähung, Beleidigung, übler Nachrede und Volksverhetzung. Regel: Punch up, not down.</p>
<p><strong>Welche Bücher helfen beim Satire-Schreiben?</strong>
Lies Tucholsky (Sprache), Swift (Radikalität), Orwell (Systematik), Kling (Zeitgeist). Und — bescheiden — „Hallo Welt&quot;: Schul-Satire mit Episodenprinzip, die zeigt, wie man Alltagswahnsinn strukturiert. <a href="/shop">→ Zur Buchübersicht</a></p>
<hr>
<h2>Unser bestes Argument in Buchform</h2>
<p>Satire verstehen ist Schritt 1. Satire <em>lesen</em> ist Schritt 1,5. In <strong>„Hallo Welt — Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S&quot;</strong> findest du alles aus diesem Guide in Aktion: Verfremdung (Lernvollzugsanstalt), Scheinlogik (Formular-Deutsch im Klassenzimmer), Übertreibung (ortsüblich) — 106 Seiten, 5,0 Sterne, als Taschenbuch, E-Book und Gratis-Hörbuch.</p>
<p><strong><a href="/shop">→ Zum Shop</a></strong> · <strong><a href="/exzerpte">Gratis reinschauen (Exzerpte)</a></strong> · <strong><a href="/#newsletter">Newsletter: 1×/Woche Satire, sonst nichts</a></strong></p>
<hr>
<p><em>Geschrieben von <strong>Philipp Paulik &amp; Maximilian Reisch</strong> — Autoren der Satire-Reihe „Hallo Welt&quot;, überlebende der Lernvollzugsanstalt SK-S, Betreiber dieser Website und des Worträtsels <a href="/worthaft">Worthaft</a>. <a href="/ueber/philipp-paulik">Mehr über Philipp</a> · <a href="/ueber/max-reisch">Mehr über Max</a></em></p>
<hr>
<h2>🗂️ CLUSTER-PLAN für Pillar 1 (12 Stück — Reihenfolge = Priorität)</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Cluster-URL (<code>/ratgeber/satire-schreiben/…</code>)</th>
<th>Fokus-Keyword</th>
<th>Such-Intention</th>
<th>Anker aus der Pillar</th>
</tr>
</thead>
<tbody><tr>
<td>1.1</td>
<td><code>stilmittel-mit-beispielen</code></td>
<td>satire stilmittel</td>
<td>Info (Schüler)</td>
<td>„Alle Stilmittel mit Beispielen&quot;</td>
</tr>
<tr>
<td>1.2</td>
<td><code>satire-aufbau-in-7-schritten</code></td>
<td>satire aufbau struktur</td>
<td>Info</td>
<td>„Der Satire-Aufbau&quot;</td>
</tr>
<tr>
<td>1.3</td>
<td><code>satire-analyse-anleitung</code></td>
<td>satire analyse deutsch</td>
<td>Info (Abi!)</td>
<td>„Satire-Analyse Schritt für Schritt&quot;</td>
</tr>
<tr>
<td>1.4</td>
<td><code>satire-themen-finden</code></td>
<td>satire themen</td>
<td>Info/Inspiration</td>
<td>„27 Satire-Themen&quot;</td>
</tr>
<tr>
<td>1.5</td>
<td><code>satire-ironie-parodie-unterschied</code></td>
<td>satire ironie unterschied / parodie</td>
<td>Info</td>
<td>„Der große Vergleich&quot;</td>
</tr>
<tr>
<td>1.6</td>
<td><code>satire-beispiele-analysiert</code></td>
<td>satire beispiele</td>
<td>Info</td>
<td>„Die 20 besten Beispiele&quot;</td>
</tr>
<tr>
<td>1.7</td>
<td><code>satire-recht-grenzen</code></td>
<td>satire grenzen recht</td>
<td>Info</td>
<td>„Kunstfreiheit &amp; Schmähkritik&quot;</td>
</tr>
<tr>
<td>1.8</td>
<td><code>satire-geschichte</code></td>
<td>geschichte der satire</td>
<td>Info (Referat!)</td>
<td>(lateral)</td>
</tr>
<tr>
<td>1.9</td>
<td><code>satire-kurzgeschichte-beispiele</code></td>
<td>satirische kurzgeschichte</td>
<td>Info + Schreibübung</td>
<td>„8 Muster&quot;</td>
</tr>
<tr>
<td>1.10</td>
<td><code>satire-schreiben-uebungen</code></td>
<td>satire schreiben übung</td>
<td>Info</td>
<td>„Schreibübungen&quot;</td>
</tr>
<tr>
<td>1.11</td>
<td><code>satire-landschaft-2026</code></td>
<td>satire seiten / deutscher satire</td>
<td>Info</td>
<td>„Satire-Landschaft&quot; (übernimmt /wiki)</td>
</tr>
<tr>
<td>1.12</td>
<td><code>buch-selbst-veroeffentlichen-kdp</code></td>
<td>buch selbst veröffentlichen amazon</td>
<td>Kommerziell-Info</td>
<td>„Unser KDP-Erfahrungsbericht&quot;</td>
</tr>
</tbody></table>
<h2>🎣 PROMO-HOOKS (3 Varianten)</h2>
<ol>
<li><strong>Neugier:</strong> „Zwei Satire-Autoren verraten, wie Satire wirklich funktioniert — in 7 Schritten, ohne Kunstbegriffe.&quot;</li>
<li><strong>Schmerz:</strong> „Dein Satire-Referat ist morgen? Keine Panik — diese Anleitung ist in 20 Minuten gelesen.&quot;</li>
<li><strong>Brand:</strong> „Wir haben ein Buch über Schule geschrieben, das 5 Sterne hat. Hier ist das Handwerk dahinter.&quot;</li>
</ol>
<h2>🔗 VERLINKUNGS-PFLICHTEN dieser Pillar</h2>
<ul>
<li><strong>Nach unten (Top-down):</strong> Alle 12 Cluster (in den Sektionen oben bereits verankert).</li>
<li><strong>Nach oben:</strong> — (Pillar 1 ist die Mutter).</li>
<li><strong>Lateral:</strong> <code>/shop</code> (CTA), <code>/exzerpte</code>, <code>/worthaft</code> (Autorenbox), Pillar 5 Schulalltag („unsere 13 Jahre Feldforschung&quot; → verlinken), Pillar 8 Deutsche Sprache („Wortwitz&quot; erwähnen).</li>
<li><strong>Von anderen Pillars:</strong> ALLE 9 anderen Pillars verlinken mit „unser satirisches Handwerk&quot; o. ä. auf diese Seite (Authoritäts-Kern!).</li>
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
