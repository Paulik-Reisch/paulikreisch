<div align="center">

# Paulik & Reisch — Web-Plattform

**Satirische Literatur, deterministische Browser-Games & Content-Delivery**
[![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)](https://paulikreisch.de)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=for-the-badge)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-App%20Hosting-orange?style=for-the-badge)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=for-the-badge)](#)

</div>

---

## Überblick

Monolithische **Next.js 15 (App Router)**-Plattform für das Autoren-Duo Paulik & Reisch.
Eine einzige Codebase vereint drei Domänen:

| Modul | Pfad | Beschreibung |
|-------|------|--------------|
| **Marketing & Shop** | `src/app/page.tsx`, `src/app/shop`, `src/app/lp/*` | Landingpages, Buch-Store, Conversion-Funnel |
| **Satire-Magazin** | `src/app/a`, `src/app/wiki`, `src/app/autoren` | Artikel-CMS mit Lead-/Share-Wall, Autoren, Wiki |
| **Worthaft** (Game) | `src/app/worthaft` | Client-Side Wordle-Klon, 100 % lokal, ~2000 Wörter (`src/lib/worthaft-words.ts`) |
| **Admin-CMS** | `src/app/admin` | Redaktionsbackend für alle Inhalte |

Infrastruktur: **Firebase** (Firestore + Storage) als Daten-/Asset-Layer, Deployment über **Firebase App Hosting**.

---

## Tech Stack

| Ebene | Technologie |
|-------|-------------|
| Framework | Next.js 15.5.9 (App Router, RSC, Turbopack in Dev) |
| Sprache | TypeScript 5 (strict), React 18.3 |
| Styling | Tailwind CSS 3.4 + `tailwindcss-animate`, shadcn/ui (Radix), `class-variance-authority` |
| Backend / Daten | Firebase Firestore (NoSQL), Firebase Storage (Binär-Assets) |
| Auth | Custom JWT-Session (`jose`, HS256), HTTP-Only-Cookie (`SESSION_SECRET`) |
| E-Mail | MailerSend (Newsletter/Campaigns), Resend-Webhook-Secret |
| Animation | Framer Motion, GSAP, `@gsap/react` |
| Analytics | Eigenes Event-Tracking in Firestore + `GlobalTracker` |
| Deployment | Firebase App Hosting (`apphosting.yaml`, `standalone` Output) |
| Lint/Typecheck | `next lint`, `tsc --noEmit` (im Build derzeit deaktiviert) |

---

## Projektstruktur

```
src/
├── app/                      # App Router (Routen + Layouts)
│   ├── page.tsx              # Startseite (Marketing)
│   ├── a/[slug]/             # Satire-Artikel (SEO-optimiert, Lead-/Share-Wall)
│   ├── admin/                # Redaktions-CMS (Artikel, Autoren, LP, SEO, Analytics, Storage, Logs)
│   ├── worthaft/             # Browser-Wordle ("Worthaft")
│   ├── lp/ , lp-*            # Kampagnen-Landingpages
│   ├── wiki/ , autoren/      # Redaktionelle Sekundärseiten
│   ├── login/                # Auth-Einstieg
│   ├── shop/                 # Buch-Store + Newsletter-Form
│   ├── sitemap.ts            # Dynamische Sitemap
│   ├── firebase.ts           # Firebase-App-Init (Client)
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui-Primitives (Button, Card, Dialog, …)
│   ├── landing/              # Marketing-Sektionen (Hero, Footer, Newsletter, …)
│   ├── article/              # Artikel-Renderer, Cards, Walls
│   ├── admin/                # CMS-Dashboard & Editoren
│   ├── analytics/            # GlobalTracker
│   └── theme-provider.tsx    # Dark/Light (next-themes)
├── firebase/                 # Client-Provider, Firestore-Hooks, Error-Emitter
├── lib/
│   ├── firestore.ts          # Datenzugriff + Typen (Article, Author, Product, …)
│   ├── resend.ts             # Server-Action: MailerSend-Integration
│   ├── session.ts            # JWT-Session-Encrypt/Decrypt (server-only)
│   └── worthaft-words.ts     # Wortliste des Spiels
├── hooks/ , emails/ , lib/lp-templates/
public/                       # Statische Assets (logo, webmanifest, sitemap.xml)
```

---

## Architektur-Muster

### Datenzugriff (Firestore)
`src/lib/firestore.ts` ist der zentrale Daten-Layer. Alle Collections werden über
typisierte Funktionen (`getArticles`, `addArticle`, `updateAuthor`, …) angesprochen.
Einige Collections werden beim ersten Lesezugriff mit Default-Daten befüllt
(`initializeArticles`, Default-Author).

### Authentifizierung
Server-seitige Session via `jose` (HS256, 24 h Gültigkeit). `src/lib/session.ts`
liest das `session`-Cookie; `src/app/admin/actions.ts` enthält `loginAction`.
Der Admin-Bereich ist durch die Server-Actions abgesichert.

### Content-Pipelines
- **Artikel:** Frei / Lead-Wall / Share-Wall (`accessLevel`) steuert Monetarisierung.
- **Landingpages:** HTML/CSS/JS werden als Strings in Firestore gespeichert und
  eigenständig ausgeliefert (`src/lib/lp-templates/` enthält statische Vorlagen).
- **Newsletter:** Komponenten-basiert, Rendering zu HTML, Versand via MailerSend.

### SEO
Jede Route kann per `SeoMetadata`-Dokument (`src/lib/firestore.ts`) überschrieben
werden. `generateMetadata` (`src/app/page.tsx` u. a.) liest diese Felder aus und
setzt OpenGraph/Twitter/robots. Globale Defaults in `src/app/layout.tsx`.

---

## Lokale Entwicklung

```bash
# 1. Abhängigkeiten
npm install

# 2. Umgebungsvariablen
cp .env .env.local            # falls nötig; Werte siehe unten
#    (im Repo ist .env durch .gitignore ausgeschlossen)

# 3. Dev-Server (Turbopack, Port 9002)
npm run dev

# Production-Build testen
npm run build
npm run start
```

### Umgebungsvariablen

| Variable | Zweck |
|----------|-------|
| `SESSION_SECRET` | HS256-Key für die Admin-Session (Pflicht in Prod) |
| `MAILERSEND_API_KEY` | MailerSend-Transport (Newsletter/Campaigns) |
| `MAILERSEND_GROUP_ID` | Empfänger-Gruppe bei MailerSend |
| `GEMINI_API_KEY` | Genkit-/KI-Features im Admin |
| `RESEND_WEBHOOK_SECRET` | Signatur-Prüfung für Resend-Webhook |

> Secrets werden in Firebase App Hosting über `apphosting.yaml` (`secrets:`) injiziert —
> lokal über `.env.local`. **Keine Secrets committen.**

### Skripte (`package.json`)

| Befehl | Funktion |
|--------|----------|
| `npm run dev` | Dev-Server, Turbopack, Port 9002 |
| `npm run build` | `next build` (Production, `output: standalone`) |
| `npm run start` | Production-Server |
| `npm run lint` | ESLint (Next) |
| `npm run typecheck` | `tsc --noEmit` |

---

## Deployment (Firebase App Hosting)

Die Plattform läuft auf **Firebase App Hosting** mit `standalone`-Build-Output.

```bash
firebase deploy
```

Konfiguration in `apphosting.yaml`:

```yaml
runConfig:
  maxInstances: 1
  secrets:
    - MAILERSEND_API_KEY
    - MAILERSEND_GROUP_ID
buildConfig:
  memoryMiB: 2048
```

`next.config.ts` wird beim Rollout automatisch um App-Hosting-optimierte Overrides
ergänzt. Bestehende Redirects (`/artikel → /a`, `/autor → /autoren`) und
`remotePatterns` für externe Bilder (placehold.co, Amazon, Firebase Storage, …)
bleiben erhalten.

Firebase-Projekt: **`hallo-welt-paulik-reisch`** (`.firebaserc`).

---

## Wichtige Hinweise & Tech-Debt

> ⚠️ **Firestore-Security-Rules sind offen.** `firestore.rules` erlaubt derzeit
> `allow read, write: if true;` — also weltweiten Lese- **und** Schreibzugriff auf
> alle Collections. Vor Produktion durch authentifizierungs- und rollenbasierte
> Regeln ersetzen (Admin-Collection nur für eingeloggte Redakteure).

> ⚠️ **Build-Checks deaktiviert.** `next.config.ts` setzt
> `typescript.ignoreBuildErrors` und `eslint.ignoreDuringBuilds` auf `true`.
> Das verbirgt Typ-/Lint-Fehler im Build. Empfohlen: in CI `npm run typecheck`
> und `npm run lint` separat erzwingen.

> ℹ️ **Favicon:** `src/app/favicon.ico` ist ein valides ICO (PNG-in-ICO), das
> Next.js' Favicon-Loader akzeptiert — Voraussetzung für einen fehlerfreien Build.

---

## Lizenz

Alle Rechte vorbehalten. © Paulik & Reisch. Keine Weiterverwendung ohne Genehmigung.
