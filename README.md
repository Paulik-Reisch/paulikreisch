<div align="center">

# Paulik & Reisch — Web-Plattform

**Satirische Literatur · Content-Funnel · Worthaft & Wiki**
[![Live](https://img.shields.io/badge/Live-paulikreisch.de-brightgreen?style=for-the-badge)](https://paulikreisch.de)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=for-the-badge)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-App%20Hosting-orange?style=for-the-badge)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=for-the-badge)](#lizenz)

</div>

---

## Überblick

Monolithische **Next.js 15 (App Router)**-Plattform für das Satire-Duo Paulik & Reisch.
Eine Codebase vereint **vier** Domänen — Stand **05.09.2026, 75 Pages + 33 kB Middleware**:

| Modul | Pfad | Beschreibung |
|-------|------|--------------|
| **Marketing & Shop** | `src/app/page.tsx`, `src/app/shop` | Homepage, Buch-Store („Hallo Welt" 10,99 € via Amazon), Conversion-Funnel |
| **Satire-Magazin** | `src/app/a/[slug]`, `src/app/autoren` | Artikel-CMS (Firestore), Lead-/Share-Wall, Autoren-Seiten |
| **Wiki / Pillars** | `src/app/wiki/*` (11 Seiten) | 10 AEO-Pillars + Hub `satire-landschaft` — TL;DR, FAQ-Schema, Speakable |
| **Worthaft** (Game) | `src/app/worthaft` | Client-Side Wordle-Klon, 100 % lokal, ~2000 Wörter (`src/lib/worthaft-words.ts`) |
| **Game Labs** (Alpha) | `src/app/game-labs` | Hangman, Worthaft Classic — `robots: noindex`, nicht in Nav |
| **Admin-CMS** | `src/app/admin` | Redaktionsbackend (Artikel, Autoren, LP, SEO, Analytics, Storage, Logs) |

Infrastruktur: **Firebase** (Firestore + Storage) als Daten-/Asset-Layer, Deployment via **Firebase App Hosting** (`apphosting.yaml`, `standalone`).

---

## Was im September 2026 neu ist

- **Funnel #1 (Content-Funnel):** `/a` → 60 %-Scroll Soft-Wall mit Checkliste → Mail + PDF (`public/checkliste-lernvollzugsanstalt.pdf`) → 5-Mails Nurture Tag 0/1/3/5/7 → `/shop` → Amazon (10,99 € statt 20,99 €, ASIN `B0CVXT9X4J`, 5,0★) → Retention Daily via Worthaft.
- **10 Pillar Pages** (`/wiki/schulsystem-deutschland`, `/wiki/bildungskritik-satire`, … `/wiki/wortspiel-raetsel-kultur`): je `Header/Footer`, `canonical`, OG `1200×630`, `@graph` (Organization + WebSite + Breadcrumb + Article + FAQPage + Book).
- **SEO/AEO/OG-Paket:** `viewport` als `export const viewport`, Homepage-Title keyword-fähig, globale `Organization` + `WebSite` (`SearchAction`), `BlogPosting` + `Speakable` auf `a/[slug]`, `/shop` eigenes `Product/Offer`.
- **Domain-Move:** `paulik-reisch.de` → `paulikreisch.de` via `src/middleware.ts` (301, `host` + `x-forwarded-host`, Pfad+Query erhalten) für GSC-Adressänderung.
- **LLMs/AEO:** `public/llms.txt` vollständig (Start/Worthaft/Rechtliches + alle Pillars + Buch-Themen + Monetarisierung), `sitemap.xml/route.ts` (`force-dynamic`, deduped).

---

## Tech Stack

| Ebene | Technologie |
|-------|-------------|
| Framework | Next.js 15.5.9 (App Router, RSC, Turbopack in Dev) |
| Sprache | TypeScript 5 (strict), React 18.3 |
| Styling | Tailwind CSS 3.4 + `tailwindcss-animate`, shadcn/ui (Radix), `class-variance-authority` |
| Backend / Daten | Firebase Firestore (NoSQL), Firebase Storage (Assets) |
| Auth | Custom JWT-Session (`jose`, HS256), HTTP-Only-Cookie (`SESSION_SECRET`) |
| E-Mail | MailerSend (Newsletter/Campaigns), Resend-Webhook-Secret |
| Animation | Framer Motion, GSAP, `@gsap/react` |
| Analytics | Eigenes Event-Tracking in Firestore + `GlobalTracker` (`src/components/analytics/global-tracker.tsx`) |
| SEO/AEO | `generateMetadata` + JSON-LD `@graph`, `llms.txt`, `robots.txt`, `sitemap.xml/route.ts` |
| Deployment | Firebase App Hosting (`apphosting.yaml`, `standalone`, `maxInstances: 1`, `memoryMiB: 2048`) |
| Lint/Typecheck | `next lint`, `tsc --noEmit` (im Build derzeit deaktiviert) |

---

## Projektstruktur

```
src/
├── app/
│   ├── page.tsx                 # Homepage (Hero, WorthaftTeaser, Features, ...)
│   ├── layout.tsx               # Globales Layout: viewport, metadata, Organization+WebSite JSON-LD
│   ├── middleware.ts            # 301 paulik-reisch.de → paulikreisch.de (GSC-Move)
│   ├── a/[slug]/page.tsx        # Satire-Artikel (BreadcrumbList + BlogPosting + Speakable)
│   ├── wiki/                    # Wiki: satire-landschaft (Hub) + 10 Pillars
│   │   ├── [slug]/page.tsx      # Fallback für /wiki/satire (ohne Wikimedia-Hotlink)
│   │   ├── schulsystem-deutschland/
│   │   ├── bildungskritik-satire/  ... (10 Ordner)
│   │   └── wortspiel-raetsel-kultur/
│   ├── shop/                    # Buch-Store (layout.tsx: eigenes Product/OG, page.tsx: Client)
│   ├── worthaft/                # Wordle-Klon (layout.tsx: Wordle-Titel)
│   │   └── ueber/page.tsx
│   ├── lp-palabrotas/           # Off-Topic → noindex (layout.tsx), nicht in Sitemap
│   ├── vibecoding/              # Off-Topic → noindex (layout.tsx), nicht in Sitemap
│   ├── sitemap/                 # Visuelle /sitemap (Guest-Seiten)
│   ├── sitemap.xml/route.ts     # Dynamische XML-Sitemap (force-dynamic, dedup)
│   ├── api/funnel/process/      # Cron: Nurture Queue
│   ├── admin/                   # CMS (Artikel, Autoren, LP, SEO, Analytics, Storage, Logs)
│   ├── globals.css
│   └── ... (autoren, exzerpte, impressum, datenschutz, etc.)
├── components/
│   ├── ui/                      # shadcn/ui (Button, Card, Dialog, ...)
│   ├── landing/                 # Hero, Footer, Newsletter, CtaBanner, ...
│   ├── article/                 # ArticleRenderer, LeadWall, ShareWall, InArticleBookBanner
│   ├── admin/                   # CMS-Dashboard & Editoren
│   ├── analytics/               # GlobalTracker
│   └── theme-provider.tsx
├── firebase/                    # Client-Provider, Hooks, Error-Emitter
├── lib/
│   ├── firestore.ts             # Datenzugriff + Typen (Article, Author, Product, SeoMetadata)
│   ├── funnel.ts                # Funnel-State (localStorage, Wall-Dismiss)
│   ├── funnel-emails.ts / funnel-queue.ts
│   ├── resend.ts                # MailerSend
│   ├── session.ts               # JWT-Session (server-only)
│   └── worthaft-words.ts
├── hooks/ , emails/ , lib/lp-templates/
public/
├── llms.txt                     # Vollständig (Pillars + Buch + Worthaft + Rechtliches)
├── robots.txt                   # + Verweis auf llms.txt
├── sitemap.xml                  # Statischer Fallback (generiert via route.ts)
├── checkliste-lernvollzugsanstalt.pdf  # Lead-Magnet (Funnel #1)
├── site.webmanifest , logo.png , worthaft-sunshine.png
docs/
├── ads-pmax-brief.md            # PMax-Brief (Shop-Ads)
└── ... (stack.md, publish.md, ...)
```

---

## Architektur-Muster

### Datenzugriff (Firestore)
`src/lib/firestore.ts` ist der zentrale Daten-Layer. Alle Collections über typisierte Funktionen (`getArticles`, `addArticle`, `updateAuthor`, …). Beim ersten Lesezugriff teils Default-Seeding (`initializeArticles`).

### Authentifizierung
Server-Session via `jose` (HS256, 24 h). `src/lib/session.ts` liest `session`-Cookie; `src/app/admin/actions.ts` enthält `loginAction`. Admin durch Server-Actions abgesichert.

### Content-Pipelines
- **Artikel:** `accessLevel` = Frei / Lead-Wall / Share-Wall steuert Funnel.
- **Landingpages:** HTML/CSS/JS als Strings in Firestore (`src/lib/lp-templates/` als Vorlagen).
- **Newsletter:** Komponenten-basiert, MailerSend, Nurture-Queue via `src/app/api/funnel/process/route.ts`.
- **Wiki/Pillars:** Statische `page.tsx` je Pillar, AEO-optimiert (TL;DR, FAQPage, `speakable`), Book-Teaser amber Card.

### SEO / AEO / OG
- Jede Route via `SeoMetadata` überschreibbar (`src/lib/firestore.ts`). `generateMetadata` setzt `title`/`description`/`openGraph`/`twitter`/`canonical`/`robots`.
- Globale Defaults + `Organization`/`WebSite` (`SearchAction`) in `src/app/layout.tsx`.
- `a/[slug]`: `BreadcrumbList` + `BlogPosting` (`ImageObject 1200×630`, `speakable`, `articleSection`).
- `/shop`: `Book` + `Offer` (10,99 €, EUR, InStock) + `AggregateRating` in separatem `layout.tsx`.
- Off-Topic (`/lp-palabrotas`, `/vibecoding`) → `noindex`, nicht in `sitemap.xml`.

### Domain-Move
`src/middleware.ts` fängt `paulik-reisch.de` (alt) am Edge ab und leitet `301` auf `https://paulikreisch.de${pathname}${search}`. Prüft `host` + `x-forwarded-host` (Firebase App Hosting / Cloud Run setzt Original-Host dort).

---

## Lokale Entwicklung

```bash
# 1. Abhängigkeiten
npm install

# 2. Umgebungsvariablen
cp .env .env.local            # Werte siehe unten
#    (.env* ist via .gitignore ausgeschlossen)

# 3. Dev-Server (Turbopack, Port 9002)
npm run dev

# Production-Build testen
npm run build
npm run start
```

### Umgebungsvariablen

| Variable | Zweck |
|----------|-------|
| `SESSION_SECRET` | HS256-Key für Admin-Session (Pflicht in Prod) |
| `MAILERSEND_API_KEY` | MailerSend-Transport |
| `MAILERSEND_GROUP_ID` | Empfänger-Gruppe bei MailerSend |
| `GEMINI_API_KEY` | Genkit-/KI-Features im Admin |
| `RESEND_WEBHOOK_SECRET` | Signatur-Prüfung Resend-Webhook |

> Secrets in Firebase App Hosting via `apphosting.yaml` (`secrets:`) injiziert — lokal via `.env.local`. **Keine Secrets committen.**

### Skripte (`package.json`)

| Befehl | Funktion |
|--------|----------|
| `npm run dev` | Dev-Server, Turbopack, Port **9002** |
| `npm run build` | `next build` (Production, `output: standalone`) — aktuell **75 Pages + Middleware 33.2 kB** |
| `npm run start` | Production-Server |
| `npm run lint` | ESLint (Next) |
| `npm run typecheck` | `tsc --noEmit` |

---

## Deployment (Firebase App Hosting)

```bash
firebase deploy
```

`apphosting.yaml`:

```yaml
runConfig:
  maxInstances: 1
  secrets:
    - MAILERSEND_API_KEY
    - MAILERSEND_GROUP_ID
buildConfig:
  memoryMiB: 2048
```

`next.config.ts` wird beim Rollout automatisch um App-Hosting-Overrides ergänzt. Redirects (`/artikel → /a`, `/autor → /autoren`) + `remotePatterns` (placehold.co, Amazon, Firebase Storage, …) bleiben.

Firebase-Projekt: **`hallo-welt-paulik-reisch`** (`.firebaserc`).

---

## Hinweise & Tech-Debt

> ⚠️ **Firestore-Rules offen.** `firestore.rules` erlaubt `allow read, write: if true;` — vor Produktion durch rollenbasierte Regeln ersetzen.
> ⚠️ **Build-Checks deaktiviert.** `next.config.ts` setzt `typescript.ignoreBuildErrors` + `eslint.ignoreDuringBuilds` auf `true`. In CI `typecheck`/`lint` separat erzwingen.
> ℹ️ **Favicon:** `src/app/favicon.ico` (PNG-in-ICO) — Voraussetzung für fehlerfreien Build.
> ℹ️ **IDE-Configs** (`.idx/`, `.vscode/`, `.modified`) sind aus dem Repo entfernt und via `.gitignore` ausgeschlossen — waren Firebase-Studio-Relikte. `.agents/` (KI-Skills, 61 KB) bleibt getrackt.

---

## Lizenz

Alle Rechte vorbehalten. © Paulik & Reisch. Keine Weiterverwendung ohne Genehmigung.
