# Paulik & Reisch — Marketing Audit & Sales Funnel

**Stand:** 2025-09-05  
**Ziel:** Buch **Hallo Welt** auf Amazon verkaufen, Leads sammeln, Leser via **Worthaft** binden  
**Quelle:** 6 MarketingSkills (site-architecture, paywalls, lead-magnets, marketing-psychology, popups, product-marketing) + Live-Code-Audit (`/a`, `/shop`, `/worthaft`, `LeadWall`, `ShareWall`, `ExcerptGate`, `Hero`, `Newsletter`)  
**Dev:** `npm run dev` auf `http://localhost:9002` · Live: `paulikreisch.de`

> **Historischer Stand:** Das Satire-Magazin und der Artikelbereich wurden inzwischen entfernt. Verweise auf `/a`, Artikel, Walls und Magazin-Funnels in diesem Audit beschreiben den früheren Stand und sind keine aktuelle Produktempfehlung.

---

## Executive Summary

Euer Paywall-System **funktioniert technisch**, verkauft aber **kein Buch**.

Ihr habt eine **soft content gate** ("Mail oder Teilen oder trotzdem weiter") — gut für Vertrauen, schlecht für Conversion. Der Funnel ist gebrochen:

```
Artikel (free) → Wall (Email ODER Share) → Danke → Sackgasse
Worthaft (Retention-Tool) hängt isoliert daneben, ohne CTA zurück zum Buch
```

Kein natürlicher Weg führt von "lustiger Artikel gelesen" zu "Hallo Welt auf Amazon kaufen". Das Magazin ist als **Acquisition-Channel** gedacht, verhält sich aber wie ein Selbstzweck.

**Gesamt-Score: 4.5 / 10**

| Dimension | Score | Urteil |
|-----------|-------|--------|
| Site Architecture | 6/10 | Struktur ok, aber kein Funnel, keine Shop-Verlinkung im Content |
| Paywalls | 4/10 | Sauber gebaut, psychologisch leer |
| Lead Magnets | 3/10 | Nur "Newsletter" — kein spezifischer Magnet |
| Popups | 2/10 | `WorthaftPopup` deaktiviert, sonst nur Footer-Form |
| Marketing Psychology | 5/10 | Anker `20,99€ → 10,99€` gut, sonst kaum Hebel |
| Product Marketing | 6/10 | Starke Persona (Schule/Bürokratie), Positionierung schwimmt |

**Core-Thesis:** *Magazin = Kostprobe, Buch = Produkt, Worthaft = Retention.* Jede Seite braucht **einen** primären CTA in diese Richtung.

---

## 1. Site Architecture

### Ist
```
Home (/) → Hero "Jetzt kaufen" → /shop → Amazon
       ↘ WorthaftTeaser → /worthaft (isoliert)
       ↘ Features / Authors / Testimonials
/a → Grid → /a/[slug] → LeadWall/ShareWall → Sackgasse (nur Related Articles)
/exzerpt/[slug] → ExcerptGate → ähnlich
/shop → Buch 1+2 + ShopNewsletterForm + Testimonials
```

- URL-Pattern gut: `/a/[slug]`, `/autoren/[slug]`, `/worthaft`, `/wiki/*`
- 3-Click-Regel ok, aber **keine interne Verlinkung** vom Artikel zum Shop
- Keine Breadcrumbs, kein Hub-and-Spoke, keine kontextuellen Links im Fließtext
- `Worthaft` hat keinen Rückkanal (nach Spiel kein Buch-CTA)

### Soll (Skill: site-architecture)

- **Breadcrumbs** auf allen `/a/*`: `Home > Satire-Magazin > Gesellschaft > Artikel`
- **In-Article Injection** nach Absatz 2: `»Diese Szene stammt aus Hallo Welt, Kap. 3 — 106 Seiten mehr auf Amazon«` + Cover-Mini + Button (kontextuell, nicht Banner-blind)
- **Hub-and-Spoke:** Pillar `/wiki/satire-landschaft` verlinkt alle Artikel + Buch; jeder Artikel linkt zurück zum Hub → SEO + interne Verlinkung, Skill: *"No orphan pages"*
- **Worthaft-Loop:** Nach Spielende: `Teile dein Ergebnis → Hol dir Lesestoff für danach (Hallo Welt)` + Newsletter-Opt-in für tägliches Worthaft-Reminder

---

## 2. Paywalls — Tiefen-Audit

### Code-Lage

- `src/components/article/article-renderer.tsx` — `accessLevel: free | leadwall | sharewall` pro Artikel (Firestore)
- `max-h-[30rem] + gradient` Blur — visuell gut
- `onUnlock = useState(true)` — nur Client-State, kein Cookie → Reload = Wall wieder da
- `LeadWall`, `ShareWall`, `ExcerptGate` teilen identische 12x "IMMER"-Liste (Duplikat)

### Was gut ist (Skill: Value before Ask, Respect the No)

- Soft gate, nicht hard → Vertrauen bleibt
- "Nein danke, ich möchte nur weiterlesen" → kein Dark Pattern
- Blur vermittelt "da ist mehr"

### Was Conversion killt

| # | Problem | Skill-Prinzip verletzt | Fix |
|---|---------|------------------------|-----|
| 1 | **Wall sofort beim Laden** | *Value before Ask* — User hat noch keinen Wert erlebt | **60%-Regel:** Erst bei 60% Scroll (ihr trackt schon 25/50/75/90%) Wall einblenden |
| 2 | **Headline generisch** "Lesen Sie den ganzen Artikel" | *Show, don't tell* | `🔒 Der beste Teil kommt jetzt — der Dialog aus Hallo Welt S.42` + 2 Zeilen geblurrter Preview + Buchcover daneben |
| 3 | **12x IMMER-Liste** | *Hick's Law* — zu viel, niemand liest 12 Punkte | 3 Value-Props: `✓ 1 Gratis-Kapitel PDF ✓ Worthaft Highscore speichern ✓ 1x/Woche Satire, kein Spam` |
| 4 | **Bypass zu prominent** | *Friction-Free Path* umgekehrt — 70%+ klicken "Nein danke" | Escape Hatch ja, aber de-emphasized: klein, grau, `Weiter ohne Bonus →` unterhalb. Nach Klick trotzdem sanfter Nudge: "Schade — hier 1 Gratis-Exzerpt als Vorgeschmack" |
| 5 | **Kein Produkt-Teaser in Wall** | *Natural next step* fehlt — Wall sammelt nur Mail, weckt kein Buch-Desire | Mini-Card in Wall: `Hallo Welt — 10,99€` Cover + Amazon-Button + "Leser lieben S.23-28" — Wall wird zum Soft-Upsell |
| 6 | **Kein Weg zum Shop** | *Friction-Free Path* — nach Unlock nur `SocialShare + Related` | Nach Unlock sofort Shop-Banner injizieren (zwischen Absatz 2+3) |
| 7 | **ShareWall veraltet** | *Liking/Similarity* — Twitter/FB/LinkedIn, Zielgruppe ist auf WhatsApp/Insta | WhatsApp + Link kopieren hinzu, LinkedIn raus. `handleShare` vor `window.open` tracken (Adblocker!) |
| 8 | **Keine Frequency Capping** | *Respect the No* — Reload = Wall wieder → nervt Stammleser | Cookie `pr_wall_dismissed=7d`, max 1x/Session |

### Copy-Vorschlag LeadWall 2.0

**Vorher:**
> "Lesen Sie den ganzen Artikel / Geben Sie Ihre E-Mail ein um sofort weiterzulesen" + 12x IMMER

**Nachher:**
> `🔒 Der beste Teil kommt jetzt — der Dialog, der im Buch auf S.42 steht.`  
> `Hol dir den Rest + 1 Gratis-Kapitel als PDF. 3.412 Leser sind schon dabei.`  
> `[ E-Mail          ] [ Artikel + PDF freischalten → ]`  
> `Kein Spam. 1x/Woche Satire, jederzeit kündbar. [ Weiter ohne Bonus → ]`  
> `↓ Vorschau: 2 Zeilen geblurrter Text + Buchcover daneben`

---

## 3. Lead Magnets — Ihr habt keinen

**Ist:** Nur `Newsletter` mit Value Prop "exklusive Inhalte und Updates" — zu vage. Skill-Regel: *"Solve a specific problem, High perceived value, Low time, Natural path to product"* → nicht erfüllt.

**Zielgruppe:** Schüler/Studenten/Genervte vom System — Problem: Schule/Bürokratie frisst Zeit/Nerven → Lösung: Humor/Abrechnung im Buch.

### 3 Magnet-Ideen (natürlicher Pfad zu Hallo Welt)

1. **Checkliste (Low Effort, 2h) — Empfehlung #1**
   `»Lernvollzugsanstalt-Check: 10 Anzeichen, dass deine Schule dich bricht«` — 1 Seite PDF, humorvoll, am Ende: "Die komplette Abrechnung: Hallo Welt, S.12-34" → CTA Amazon

2. **Mini-Lexikon (Medium, 4h)**
   `»Pfeffers Palabrotas: Das geheime Vokabelheft — 15 Schimpfwörter, die dir keine Lehrerin beibringt«` — aus `lp-templates/pfeifer.html` extrahieren, perfekt für ShareWall

3. **Quiz (High Engagement, 1 Woche)**
   `»Welcher Lehrer-Roboter bist du?«` — 5 Fragen → Ergebnis + passendes Exzerpt + Shop-Link. Läuft als Popup auf `/a` (Skill: Quiz = Segmentation)

### Gating-Strategie

| Ansatz | Wann | Trade-off |
|--------|------|-----------|
| **Full gate** | PDF-Download | Max Capture, geringere Reichweite |
| **Partial gate** | Artikel 60% frei, Rest + Magnet gegen Mail | Balance |
| **Content Upgrade** | Inline nach Absatz 2 pro Artikel | Kontextuell, 2-5x besser als Sidebar |

**Form-Regel:** Email only (jedes extra Feld -5-10% Conversion). Ihr fragt im LeadWall nur Mail → gut, aber Footer-Newsletter verlangt Checkbox-Pflicht → inkonsistent (DSGVO-Fix nötig).

---

## 4. Popups

**Ist:** `WorthaftPopup.tsx → return null` (deaktiviert), sonst nur Footer-Newsletter (unten, sieht keiner, braucht Checkbox). Keine Exit-Intent, kein Scroll-Trigger.

**Soll (Skill: popups — Timing is Everything, Respect the User):**

- **Exit-Intent auf `/a/*`:** "Warte — bevor du gehst: 1 Gratis-Kapitel + Worthaft Tagesrätsel als Bookmark?" → Magnet #1
- **Scroll 50% auf `/a`:** Slide-in rechts unten (nicht zentrales Modal!) → "Gefällt dir der Stil? Davon gibt's 106 Seiten mehr" + Cover + Amazon + Newsletter
- **Shop-Seite:** Sticky Top-Banner `Kurzzeit-Angebot` ist gut, aber ohne Timer/Proof. Füge echten Countdown (nur wenn echt!) oder `4.8★ bei 127 Reviews` hinzu. Aktuelle Zitate ("paranoider Leser") sind lustig, killen aber Trust für Kauf → als "Humor-Zitate" labeln oder echte ersetzen
- **Frequency:** 1x/Session, 7 Tage Snooze nach Dismiss, nie im Checkout (`/shop` → Amazon)
- **Mobile:** Exit-Intent → Back-Button/Scroll-Up Trigger, kein Full-Screen Overlay

**Benchmarks:** Email-Popup 2-5%, Exit-Intent 3-10%, Click-Triggered 10%+

---

## 5. Marketing Psychology — ungenutzte Hebel

**Genutzt:** Anchoring `20,99€ → 10,99€` im `CtaBanner` + `Hero` — gut.

**Liegen gelassen:**

| Prinzip | Anwendung bei euch |
|---------|--------------------|
| **Reciprocity** | Erst Wert geben (voller Anfang + Witz), dann Mail fragen — aktuell umgekehrt |
| **Commitment & Consistency** | Kleine Steps: `Mail → Gratis-Kapitel → Worthaft Account → Kauf` statt `Mail oder Share` |
| **Social Proof / Bandwagon** | Echte Zahlen: `3.412 Leser`, `127× ★5,0 auf Amazon`, `892 spielen täglich Worthaft` statt poetischer Zitate |
| **Loss Aversion** | "Verpasse keine neue Episode aus der Lernvollzugsanstalt" > "Erhalte exklusive Inhalte" |
| **Scarcity** (nur wenn echt!) | Echten Countdown im `CountdownBanner` mit Datum füttern |
| **Curiosity Gap** | Teaser vor Wall mit Cliffhanger enden lassen, nicht mitten im Satz cutten |
| **Authority** | "Von 2 Autoren, die das System überlebt haben" + Presse/Logos wenn vorhanden |
| **Peak-End Rule** | Starkes Ende nach Unlock: Danke-Seite mit Buch-Teaser, nicht nur "erledigt" |

---

## 6. Product Marketing — Positionierung

**Hybrid:** Content (Magazin) + Game (Worthaft) + E-Commerce (Buch). Ohne klare Hierarchie konkurrieren die Ziele.

**Empfehlung:**

> **Paulik & Reisch — Satire, die aus dem Schul-Wahnsinn Bücher macht.**  
> Magazin = Kostprobe, Buch = Hauptprodukt, Worthaft = Retention.

- Jede Seite 1 primärer CTA: Home → "Buch entdecken", Artikel → "Buch holen", Worthaft → "Weiterlesen im Buch"
- Anti-Persona definieren (wer soll *nicht* kaufen?) → spart Streuverlust
- Proof Points sammeln: echte Amazon-Reviews, Presse, Worthaft-Zahlen

---

## 7. Roadmap — 10 To-Dos priorisiert

### Quick Wins (diese Woche, <4h)

1. **LeadWall Copy + Bypass fix** — 3 Bullets statt 12, de-emphasized "Weiter ohne", DSGVO-Checkbox angleichen
2. **ShareWall: WhatsApp + Copy-Link** statt LinkedIn
3. **60%-Scroll-Trigger** statt sofortiger Wall (1 Zeile in `article-renderer.tsx`)
4. **In-Article Buch-Banner** nach Absatz 2 (statisch, nur Text + Cover + Amazon-Link)
5. **Shop-Social-Proof echt machen** — echte Amazon-Sterne + Bestseller-Rang prominent, Fake-Zitate labeln

### Mittelfristig (2-3 Wochen)

6. **Lead Magnet #1 bauen** (Checkliste PDF) + als Content Upgrade in 3 Top-Artikeln + Exit-Intent Popup
7. **Cookie + Frequency Capping** für Walls (`localStorage pr_unlocked_until`)
8. **Worthaft Post-Game CTA** → Buch/Newsletter (nach Spielende)
9. **Breadcrumbs + Hub-Seite** `/wiki/satire-landschaft` als SEO-Hub
10. **A/B Test:** Wall-Headline A ("Gratis-Kapitel sichern") vs B ("Weiterlesen + PDF"), messen: `wall_view → wall_convert → book_click`

### Metriken (ab sofort tracken)

- `wall_view`, `wall_convert`, `wall_dismiss`, `book_click`, `amazon_click`, `newsletter_subscribe` (ihr trackt schon `article_scroll_depth 25/50/75/90` + `newsletter_subscription`)
- Funnel: `Artikel View → Wall View → Email → Shop View → Amazon Click`
- Benchmarks: Wall 2-5% auf Lead, Shop → Amazon 15-30% bei warmem Traffic

---

## 8. Nächster Schritt: Sales Funnel

Siehe Diskussion unten — Vorschlag für 5-Stufen-Funnel:

```
Acquisition (SEO / Magazin / Worthaft / Social)
  → Lead Capture (60% Wall + Magnet + Exit Popup)
    → Nurture (Resend Email Sequence 5 Mails)
      → Conversion (Shop → Amazon)
        → Retention & Advocacy (Worthaft Daily + ShareWall)
```

Detailvorschlag folgt im Chat. Wenn du willst, baue ich direkt **LeadWall 2.0 + Exit-Popup + In-Article Banner** als Code-Patch — sag welcher Magnet zuerst (Empfehlung: Checkliste, 2h live und verkauft am natürlichsten das Buch).

---

*Generiert aus MarketingSkills v2.0 (site-architecture, paywalls, lead-magnets, marketing-psychology, popups, product-marketing) + Live-Code-Audit 2025-09-05.*
