# Stack (neu) — GitHub + Claude Code statt Firebase Studio

**Kurz gesagt:** Der Code wird jetzt in **GitHub** gelagert (wie ein Google Drive
für Programmcode, nur mit Versionen). Zum Schreiben/Bauen nutzt ihr **Claude Code**
(oder GitHub's eigene KI "Antigravity"). Das *Veröffentlichen* ins Netz macht weiterhin
**Firebase App Hosting** — genau wie vorher.

---

## Der neue Stack in einer Grafik

```
   DU / MAX (lokal)
        │  schreibt Code mit Hilfe von KI
        ▼
 ┌──────────────────────────────────────────────┐
 │  Claude Code / GitHub Antigravity (KI)        │  ← ersetzt Firebase Studio
 │  • schlägt Code vor                            │
 │  • ihr bestätigt / ändert                     │
 └──────────────────────────────────────────────┘
        │  "Speichern" (= git push)
        ▼
 ┌──────────────────────────────────────────────┐
 │  GitHub  (repo: Paulik-Reisch/paulikreisch)   │  ← euer Code-Lager + Versionen
 │  • alle Versionen sicher                      │
 │  • du + Max arbeiten hier parallel             │
 └──────────────────────────────────────────────┘
        │  "Veröffentlichen" (firebase deploy)
        ▼
 ┌──────────────────────────────────────────────┐
 │  Firebase App Hosting                         │  ← stellt ins Netz
 │  + Firestore (DB) + Storage (Bilder)          │  ← bleibt bei Google
 └──────────────────────────────────────────────┘
        │
        ▼
   paulikreisch.de  (Live-Seite)
```

**Der Unterschied zu früher:** Es gibt jetzt *zwei neue Stationen* zwischen euch und
der Live-Seite: **GitHub** (Lager) und **Claude Code** (Schreib-Hilfe). Das macht es
einen Tick komplexer — aber ihr gewinnt **Versionskontrolle** und **sauberes
Zusammenarbeiten**.

---

## Die einzelnen Teile, einfach erklärt

### 1. GitHub — euer "Code-Drive" mit Zeitmaschine
- Speichert euren kompletten Code
- Jede Änderung ist als *Version* gespeichert → ihr könnt jederzeit zurück
- `Paulik-Reisch/paulikreisch` ist euer Projekt-Ordner dort
- **Kostenlos**, einfachster Weg, Code sicher zu lagern

### 2. Claude Code / GitHub Antigravity — eure Schreib-Hilfe
- **Claude Code:** KI-Tool, das ihr lokal im Terminal oder in VS Code nutzt. Es
  schreibt Code für euch, den ihr prüft und übernehmt.
- **GitHub Antigravity:** Googles/Harness' KI-IDE, die direkt mit GitHub verbunden
  ist (ähnlich wie Firebase Studio, nur auf GitHub-Basis).
- Beides ersetzt das, was Firebase Studio beim Coden gemacht hat.

### 3. OpenRouter + KI-Modelle — woher die KI kommt
Claude Code kann über **OpenRouter** (ein Sammel-Anbieter für viele KI-Modelle)
verschiedene Modelle nutzen. Ihr wählt z. B.:
- `anthropic/claude-*` (stark bei Code)
- `openai/gpt-*` (stark bei Text)
- `google/gemini-*` (gut für Bilder/Kontext)
- `meta/llama-*` (kostenlos/günstig)

OpenRouter ist wie ein "Marktplatz": ein Account, viele Modelle. Ihr habt das schon
in eurem Setup (Claude Code ist mit OpenRouter verbunden).

### 4. Firebase — bleibt eure Cloud
- **App Hosting** veröffentlicht die Seite
- **Firestore** = Datenbank
- **Storage** = Bilder
- Das ändert sich **nicht**.

---

## Der typische Ablauf (neu)

```
1. Ihr öffnet Claude Code (oder Antigravity)
2. Ihr sagt: "Ändere den Hero-Text auf der Startseite"
3. KI schreibt den Code, ihr schaut drüber
4. KI speichert es nach GitHub (git push)
5. Ihr sagt: "Veröffentlichen" → firebase deploy
6. paulikreisch.de zeigt die neue Version
```

Für Max (der weniger technisch ist) reicht meist: Schritt 2 + 5 sagen, den Rest
macht die KI + GitHub. Genaues dazu in `collaborate.md`.

---

## Was ihr dafür braucht (einmalig)

| Tool | Wofür | Auf welchem PC |
|------|-------|----------------|
| **Git** | Verbindung zu GitHub | beide |
| **GitHub-Account** | das Lager | beide |
| **Claude Code** oder **Antigravity** | KI-Schreiben | beide (oder nur einer) |
| **Node.js** | baut die Seite lokal | nur wer lokal testet |
| **Firebase CLI** | veröffentlicht | nur wer deployt |

Siehe `collaborate.md` für die genaue Einrichtung für dich + Max.
