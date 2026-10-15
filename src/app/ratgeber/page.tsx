import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Feather, FileText, Gift, GraduationCap, Languages, Laugh, Scale, School, Smile } from "lucide-react";

export const metadata: Metadata = {
  title: "Ratgeber — Satire, Schule, Sprache & Alltag | Paulik & Reisch",
  description: "10 Ratgeber: Satire schreiben, Zeugnissprache, Geschenk für Lehrer, Abiturgeschenk, Schulalltag, Schulwitze, Beamtendeutsch, Deutsche Sprache, Typisch Deutsch & Etikette — von den Hallo-Welt-Autoren.",
  alternates: { canonical: "/ratgeber" },
  openGraph: {
    title: "Ratgeber — Satire, Schule, Sprache & Alltag",
    description: "10 Ratgeber von Satire-Autoren: alles was Schule, Sprache & Bürokrampf betrifft — mit Checklisten & FAQ.",
    url: "https://paulikreisch.de/ratgeber",
    siteName: "Paulik & Reisch",
    locale: "de_DE",
    type: "website",
    images: [{ url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7", width: 1200, height: 630, alt: "Paulik & Reisch Ratgeber" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://paulikreisch.de/#organization", name: "Paulik & Reisch", url: "https://paulikreisch.de" },
    { "@type": "WebSite", "@id": "https://paulikreisch.de/#website", url: "https://paulikreisch.de", name: "Paulik & Reisch", publisher: { "@id": "https://paulikreisch.de/#organization" }, inLanguage: "de-DE" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://paulikreisch.de/" }, { "@type": "ListItem", position: 2, name: "Ratgeber", item: "https://paulikreisch.de/ratgeber" }] },
    { "@type": "CollectionPage", name: "Ratgeber — Paulik & Reisch", description: "10 Ratgeber zu Satire, Schule, Sprache und Alltag.", url: "https://paulikreisch.de/ratgeber", isPartOf: { "@id": "https://paulikreisch.de/#website" }, about: { "@id": "https://paulikreisch.de/#organization" } },
  ],
};

const items = [
  { slug: "satire-schreiben", title: "Satire schreiben", desc: "Merkmale, Stilmittel & Anleitung — 27 Themen plus Aufbau-Leitfaden.", icon: Feather, meta: "Fokus: satire schreiben" },
  { slug: "zeugnissprache", title: "Zeugnissprache übersetzt", desc: "40 Geheimcodes entziffert — inkl. Arbeitszeugnis.", icon: FileText, meta: "Fokus: zeugnissprache" },
  { slug: "geschenk-lehrer", title: "Geschenk für Lehrer", desc: "27 Ideen nach Anlass & Budget + Sprüche & Regeln.", icon: Gift, meta: "Fokus: geschenk lehrer" },
  { slug: "abiturgeschenk", title: "Abiturgeschenk", desc: "25 Ideen + Sprüche, die sitzen — Geldgeschenke & Karte.", icon: GraduationCap, meta: "Fokus: abiturgeschenk" },
  { slug: "schulalltag", title: "Schulalltag überleben", desc: "Der große Guide: Lehrertypen, Vertretung, Referate & Co.", icon: School, meta: "Fokus: schulalltag" },
  { slug: "schulwitze", title: "Schulwitze", desc: "Die besten Witze über Schule — nach Fach sortiert.", icon: Laugh, meta: "Fokus: schulwitze" },
  { slug: "beamtendeutsch", title: "Beamtendeutsch übersetzt", desc: "25 Behörden-Formulierungen + warum Ämter so schreiben.", icon: Scale, meta: "Fokus: beamtendeutsch" },
  { slug: "deutsche-sprache", title: "Deutsche Sprache", desc: "Warum sie so schwer ist — lange Wörter, Denglisch, Twain.", icon: Languages, meta: "Fokus: deutsche sprache" },
  { slug: "typisch-deutsch", title: "Typisch deutsch", desc: "12 Eigenheiten-Kapitel: Pünktlichkeit, Baustellen & Co.", icon: Smile, meta: "Fokus: typisch deutsch" },
  { slug: "etikette", title: "Etikette heute", desc: "Die Benimm-Regeln, die zählen — Tisch, Handy, Restaurant.", icon: BookOpen, meta: "Fokus: etikette regeln" },
];

export default function Page(){
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
<Header/><main className="flex-1">
<div className="container px-4 md:px-6 py-8">
<nav className="text-xs text-muted-foreground mb-4 flex gap-1.5"><Link href="/" className="hover:underline">Home</Link><span>/</span><span className="text-foreground font-medium">Ratgeber</span></nav>
<Badge variant="secondary" className="mb-3">Ratgeber · 10 Guides</Badge>
<h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-balance">Ratgeber</h1>
<p className="mt-3 text-lg text-muted-foreground max-w-3xl leading-relaxed">10 Guides von Satire-Autoren — Satire, Schule, Sprache &amp; Alltag. Jeweils mit TL;DR, 2–5k Wörtern, FAQ (AEO), Tabellen &amp; internen Links. Start mit <Link href="/ratgeber/satire-schreiben" className="underline">Satire schreiben</Link> oder <Link href="/ratgeber/zeugnissprache" className="underline">Zeugnissprache</Link>.</p>
<div className="mt-6 flex gap-2 flex-wrap"><Link href="/shop"><Button>Buch — 10,99 € <ArrowRight className="ml-2 h-4 w-4"/></Button></Link><Link href="/worthaft"><Button variant="outline">Worthaft spielen</Button></Link></div>
</div>

<div className="container px-4 md:px-6 pb-4"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
{items.map(it=>{ const Icon=it.icon; return (
<Link key={it.slug} href={`/ratgeber/${it.slug}`} className="group"><Card className="h-full hover:shadow-md transition-shadow border hover:border-primary/15">
<CardHeader className="pb-2"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/15 transition-colors"><Icon className="h-5 w-5 text-primary"/></div>
<CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{it.title}</CardTitle><CardDescription className="text-sm">{it.desc}</CardDescription></CardHeader><CardContent className="pt-0"><span className="text-[11px] tracking-wide uppercase text-muted-foreground">{it.meta}</span></CardContent></Card></Link>
);})}
</div></div>

<div className="container px-4 md:px-6 pb-10"><Card className="bg-muted/50 border-dashed"><CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4"/> Aus dem Buch</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground flex flex-wrap gap-2 items-center">Alle Ratgeber verweisen auf <strong>Hallo Welt</strong> — 106 Seiten Schulsatire für 10,99 €. <Link href="/shop"><Button size="sm">Zum Shop</Button></Link> <Link href="/checkliste"><Button size="sm" variant="outline">Checkliste PDF (gratis)</Button></Link></CardContent></Card></div>

<div className="container px-4 md:px-6 pb-10 text-xs text-muted-foreground">Mehr: <Link href="/wiki/satire-landschaft" className="underline">Wiki: Satire-Landschaft</Link> · <Link href="/sitemap" className="underline">Sitemap</Link></div>
</main><Footer/></>);
}
