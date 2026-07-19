# Tools — was ihr braucht, was optional ist

**Kurz gesagt:** Hier steht, welche Tools **zwingend** nötig sind und welche ihr
euch aussuchen könnt. Firebase ist nur *bedingt* nötig (nur fürs Veröffentlichen),
Git ist Pflicht, VS Code / Claude / Hermes / OpenCode sind **optional** — ihr
braucht nur EINES davon zum Schreiben.

---

## Übersicht: Pflicht vs. Optional

| Tool | Nötig? | Wofür | Wer |
|------|--------|-------|-----|
| **Git** | ✅ Pflicht | Verbindung zu GitHub (speichern/holen) | beide |
| **GitHub-Account** | ✅ Pflicht | das Code-Lager | beide |
| **Firebase** | ⚠️ bedingt | nur zum **Live-schalten** (App Hosting) + DB/Bilder | Philipp (Deploy) |
| **Node.js** | ⚠️ bedingt | nur wer lokal baut/testet (`npm run build`) | Philipp |
| **KI-Schreib-Tool** | ✅ mind. 1 | Code schreiben/ändern | jeder wählt EINS |
| → Hermes | optional | KI-Chat (Max' Weg) | Max |
| → Claude Code | optional | KI im Terminal/VS Code | Philipp |
| → OpenCode | optional | KI-Alternative zu Claude Code | Philipp |
| → GitHub Antigravity | optional | KI-IDE im Browser | Max |
| **VS Code** | optional | Editor mit Übersicht (nicht zwingend) | wer will |
| **Firebase CLI** | ⚠️ nur fürs Deploy | `firebase` Befehle lokal | Philipp |

**Die Regel:** Git + GitHub sind Pflicht. Zum *Schreiben* braucht ihr genau **ein**
KI-Tool (Hermes reicht für Max). Firebase braucht ihr nur, wenn ihr wirklich live
geht — lokal arbeiten geht auch ohne.

---

## Die Pflicht-Tools (muss jeder haben)

### Git
- Verbindet euren PC mit GitHub
- Kostenlos, einmalig installieren
- Befehle: `git pull`, `git push`, `git commit` (macht meist die KI für euch)
- Download: https://git-scm.com

### GitHub-Account
- Euer gemeinsamer Code-Speicher
- Philipp fügt Max zum Repo `Paulik-Reisch/paulikreisch` hinzu
- Kostenlos
- Web: https://github.com

---

## Firebase — nur bedingt nötig

Firebase macht bei euch **drei Dinge**, aber keines ist zum *Arbeiten* zwingend:

| Firebase-Teil | Nötig zum … | Ohne geht? |
|---------------|-------------|------------|
| **App Hosting** | Seite live stellen | Nur fürs Deploy nötig |
| **Firestore (DB)** | Artikel/Daten speichern | Ja, solange ihr lokal testet |
| **Storage (Bilder)** | Bilder hochladen | Ja, solange ihr lokal testet |
| **Domain** `paulikreisch.de` | öffentlich erreichbar | Nur fürs Live |

**Fazit:** Ihr könnt den **ganzen Code schreiben und testen**, ohne Firebase
anzurühren. Firebase kommt erst ins Spiel, wenn ihr `paulikreisch.de` aktualisieren
wollt (Deploy). Dafür reicht Philipps Firebase-CLI + Login.

---

## Die KI-Schreib-Tools (wählt EINS pro Person)

Ihr braucht **nicht** alle. Jeder nimmt, was ihm liegt.

### Hermes (empfohlen für Max)
- **Was:** KI-Chat-App (Desktop), ihr sagt auf Deutsch, was ihr wollt
- **Vorteil:** am einfachsten, kein Terminal, kein git-Wissen
- **Für:** Max (Einsteiger)
- **Pflicht?** Nein, aber der angenehmste Weg für dich, Max

### Claude Code (Philipp)
- **Was:** KI im Terminal / in VS Code, schreibt Code für euch
- **Vorteil:** technisch stark, gut für Build/Fix/Deploy
- **Für:** Philipp (technischer)
- **Pflicht?** Nein, eine Alternative reicht

### OpenCode
- **Was:** wie Claude Code, aber anderer Anbieter (OpenRouter-basiert)
- **Vorteil:** ihr habt es schon eingerichtet, nutzt eure OpenRouter-Modelle
- **Für:** Philipp (Alternative zu Claude Code)
- **Pflicht?** Nein

### GitHub Antigravity
- **Was:** KI-IDE direkt im Browser, verbunden mit GitHub
- **Vorteil:** wie Firebase Studio, nichts installieren
- **Für:** Max (Browser-Weg)
- **Pflicht?** Nein

> **Wichtig:** Hermes, Claude Code, OpenCode, Antigravity machen alle das gleiche
> Grundprinzip — sie schreiben Code und sprechen GitHub. Ihr braucht nur **eines**.
> Max nimmt z. B. Hermes, Philipp nimmt Claude Code oder OpenCode.

---

## Optional, aber hilfreich

### VS Code
- Editor mit guter Datei-Übersicht und Suchfunktion
- Nicht zwingend — die KI-Tools zeigen euch den Code auch
- Kostenlos: https://code.visualstudio.com

### Node.js
- Nur nötig, wenn ihr `npm run build` / `npm run dev` **lokal** ausführt
- Philipp braucht es fürs Deploy-Testen, Max nicht zwingend
- Download: https://nodejs.org

### Firebase CLI
- Nur für Philipp, nur zum Deploy (`firebase apphosting:backends:deploy`)
- `npm install -g firebase-tools`

---

## Minimal-Setup pro Person

### Max (Einsteiger) — reicht das:
- [ ] GitHub-Account (von Philipp eingeladen)
- [ ] **Hermes** installiert (oder Antigravity im Browser)
- [ ] Fertig. Alles andere macht die KI.

### Philipp (technisch) — das:
- [ ] Git
- [ ] Node.js
- [ ] GitHub-Account
- [ ] **Claude Code** oder **OpenCode** (oder auch Hermes)
- [ ] Firebase CLI + Login (nur fürs Deploy)
- [ ] Optional: VS Code

---

## Zusammenfassung

```
PFLICHT:    Git + GitHub-Account + 1 KI-Schreib-Tool
BEDINGT:    Firebase (nur Deploy) + Node.js (nur lokaler Build)
OPTIONAL:   VS Code, Firebase CLI, Antigravity, OpenCode, Hermes (wähl 1)
```

Ihr kommt mit **Git + GitHub + einer KI** komplett klar. Firebase ist nur der
"Absender" fürs Live-Gehen. Alles andere ist Geschmacksache.

Siehe `collaborate.md` (zusammenarbeiten) und `commands.md` (Befehle).

---

© Paulik & Reisch
