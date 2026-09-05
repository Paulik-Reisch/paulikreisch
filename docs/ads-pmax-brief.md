# Ads — PMax + Meta Andromeda Brief (paulikreisch)

> Low-budget Push für Buch "Hallo Welt" (10,99€, Anker 20,99€). Ziel CPA ≤4€. Quelle: marketingskills/ads.

## Warum PMax jetzt?

- Intent hoch: "satire buch", "lustiges buch schule", "hallo welt paulik reisch"
- Asset-light: Cover reicht + 3 Statics + RSA — kein Video nötig.
- Learning braucht 50 Conversions → 7 Tage nicht killen (Skill Guardrail).

## Setup Check (vor Start)

- [ ] Conversion Tracking getestet: `view_shop` (audience) + `click_amazon` (hard conversion) via gtag/fbq + Firestore `funnel_book_click` (siehe `src/app/shop/page.tsx`)
- [ ] Landing: `/shop` lädt <2s, mobil ok, canonical `https://paulikreisch.de/shop`
- [ ] UTM: `utm_source=google&utm_medium=cpc&utm_campaign=pmax_hw1&utm_content={asset}`
- [ ] Amazon Attribution Tag `paulikreisch-21` + `amzn.eu/d/02nS59t2?tag=paulikreisch-21`
- [ ] Budget 10€/Tag, Target ROAS, Location DE, Broad, keine Interessen-Stacks

## Statics — 5 Stück, 1h Produktion (FigPng 1080×1080 + 1080×1920)

1. **Cover pur** — Mockup + Preisbadge `20,99 → 10,99` + Claim "Eine Abrechnung mit der Schule."
2. **Zitat** — "Warum Ihr Drucker Sie hasst" + Cover klein + 4.8★
3. **Lehrer-Trigger** — Cover + Headline "Für Lehrer, die den Schulwahnsinn kennen" (Identity-Trigger, Andromeda-Hack)
4. **Eltern-Trigger** — gleiches Cover + "Für Eltern mit Schulkind — endlich versteht ihr das System"
5. **Scarcity** — Cover + "Aktion bis Monatsende — danach wieder 20,99 €" (echter Countdown, kein Fake)

> Statics > poliertes Video 2026 (Andromeda is a hungry panda — braucht Volumen, statics 10× billiger).

## RSA Headlines (15×30 Zeichen) + Descriptions (4×90)

Headlines:
1. Hallo Welt — Satire-Buch
2. Eine Abrechnung mit der Schule
3. 106 Seiten Premium-Humor
4. 4.8★ bei echten Lesern
5. 10,99€ statt 20,99€
6. Jetzt auf Amazon
7. Von Paulik & Reisch
8. Für Lehrer & Eltern
9. Schulsatire vom Feinsten
10. Witzig. Scharf. Ehrlich.
11. Das Buch, das Schule entlarvt
12. Lernvollzugsanstalt SK-S
13. Limited: Aktion bis Monatsende
14. In 2 Tagen bei dir
15. Satire, die wehtut (vor Lachen)

Descriptions:
1. Satirische Bildungskritik — 106 Seiten, die das System zerlegen. Jetzt 10,99€ auf Amazon.
2. 4.8★, 106 Seiten, 2 junge Autoren. Die Abrechnung, die jeder Lehrer fürchtet.
3. Aktion bis Monatsende: 10,99€ statt 20,99€. Danach wieder voll.
4. "Witzig, scharf, ehrlich" — Leserstimmen. Cover + Leseprobe auf paulikreisch.de/shop.

Sitelinks: /a (Magazin) | /worthaft (Spiel) | /checkliste (Gratis-PDF) | /worthaft/ueber
Callouts: 106 Seiten · 4.8★ · Amazon Prime · Aktion 10,99€ · Satire pur

## Retargeting — 4-Komponenten (Skill)

Audience: `view_shop` ohne `click_amazon` (7 Tage heiß, 30 Tage warm). Exkludiere Käufer 14 Tage.

1. **Objection-Ad** — "Zu teuer? 10,99 statt 20,99 — 106 Seiten für 2 Döner. Kein Abo."
2. **Proof Carousel** — 3 echte 5★ Zitate + Cover + "127 Leser lachen schon"
3. **Other-Offer CBO** — Checkliste statt Buch: "Hol dir das Gratis-Kapitel (PDF) — 0€, sofort"
4. **Value-First Audit** — "Teste deinen Satire-IQ: Welche Schul-MC-Falle bist du? → Worthaft"

> Retarget mit DIFFERENT offers, nicht selbes Buch nochmal. Original 2-3 ROAS → other-offer oft 6+ ROAS.

## Kill/Scale (keine festen Regeln, immer Sample checken)

- <7 Tage: nie killen (learning).
- Nach 7 Tagen CPA >6€ + <1 Conversion/Tag → pausieren, Creative tauschen (erst Headline-Mirror auf LP testen).
- Winning headline (höchste CTR + Conversion) 1:1 auf `/shop` H1 spiegeln → +15-20% Lift (headline-mirror trick).

## Nächster Schritt

1. 5 Statics in `/public/ads/` exportieren (1080²)
2. gtag + fbq in `layout.tsx` einbinden (noch TODO)
3. PMax Kampagne live, 10€/Tag, 7 Tage laufen lassen
