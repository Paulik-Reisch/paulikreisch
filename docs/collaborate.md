# Collaborate — wie du + Max gemeinsam arbeitet

**Kurz gesagt:** Ihr arbeitet beide am *gleichen* GitHub-Projekt. Jeder arbeitet an
seinem Teil, zwischenspeichert ihn, und GitHub führt das zusammen. Keiner überschreibt
den anderen mehr — das war bei Firebase Studio das Problem.

Diese Datei ist für **Einsteiger** geschrieben. Keine Angst vor Begriffen — alles wird
erklärt.

---

## Die Grundidee: "Branch" = euer privater Arbeitsplatz

Stell dir GitHub wie ein großes gemeinsames Dokument vor.
- **`main`** = die "offizielle" Version, die live auf paulikreisch.de steht.
- Ein **Branch** = eine Kopie davon, an der du bastelst, ohne die offizielle zu
  gefährden.

```
        main (live)
          │
    ┌─────┴─────┐
   philipp     max        ← jeder arbeitet auf seinem Branch
  (Branch)    (Branch)
```

Wenn dein Teil fertig ist, wird er zurück in `main` gemischt (**"Merge"**).

---

## Rollen aufteilen (Beispiel)

Damit ihr euch nicht in die Quere kommt:

| Philipp | Max |
|---------|-----|
| Technik, Build, Deploy | Texte, Artikel, Shop-Inhalte |
| `worthaft`-Spiel | Landingpages / Copy |
| Firebase-Config | Newsletter-Inhalte |
| KI-Tooling (Claude/OpenRouter) | Review & "Gefällt mir?" |

Das ist nur ein Vorschlag — ihr könnt es frei teilen.

---

## Arbeitsablauf für Nicht-Techniker (Max)

Max braucht **kein Terminal**. Der einfachste Weg:

### Weg A — über GitHub Antigravity (KI-IDE, wie Firebase Studio)
1. Antigravity öffnen → mit GitHub verbinden
2. Projekt `Paulik-Reisch/paulikreisch` öffnen
3. KI sagen: "Ändere den Text auf der Über-Seite zu …"
4. KI zeigt Vorschau, Max sagt "Ja"
5. KI speichert es (Commit + Push) → fertig

### Weg B — über Claude Code (lokal)
1. Terminal/App öffnen
2. `cd` in den Projektordner
3. "Mach den Newsletter-Button größer"
4. KI macht es, Max schaut drüber, KI pushed

→ In beiden Fällen muss Max **nichts von Git verstehen**. Die KI macht
`git add / commit / push`.

---

## Arbeitsablauf für dich (Philipp, technischer)

```bash
# 1. Neueste Version holen
git pull origin main

# 2. Eigenen Arbeits-Zweig anlegen
git checkout -b feature/neuer-hero

# 3. Änderungen machen (mit Claude Code)
#    ...

# 4. Speichern
git add -A
git commit -m "Hero-Text modernisiert"
git push origin feature/neuer-hero

# 5. Auf GitHub: "Pull Request" öffnen → mergen
#    (oder lokal: git checkout main && git merge feature/neuer-hero)
```

---

## Was ist ein "Commit", "Push", "Pull Request"?

| Begriff | Einfach erklärt |
|---------|-----------------|
| **Commit** | "Zwischenspeichern" einer Änderung mit Notiz |
| **Push** | deine Commits zu GitHub hochladen |
| **Pull** | neuste Version von GitHub holen |
| **Pull Request (PR)** | "Bitte nimm meinen Branch in main auf" |
| **Merge** | Zusammenführen in main |
| **Conflict** | zwei haben dieselbe Zeile geändert → man muss entscheiden welche bleibt |

---

## Konflikte vermeiden (wichtig!)

- Arbeitet an **verschiedenen Dateien** → fast kein Konflikt
- Nutzt **verschiedene Branches** → sicher
- Macht vor jeder Session `git pull` → ihr seid auf dem Stand
- Bei Konflikt: nicht panisch sein. Die KI (Claude/Antigravity) löst die meisten
  automatisch, oder ihr sagt mir (Hermes) Bescheid.

---

## Tools im Überblick

| Tool | Wer nutzt es | Wozu |
|------|--------------|------|
| **GitHub** | beide | Code-Lager + Versionen |
| **GitHub Antigravity** | Max (einfach) | KI-IDE im Browser, wie Studio |
| **Claude Code** | Philipp | KI im Terminal / VS Code |
| **OpenRouter** | Philipp (Setup) | liefert die KI-Modelle |
| **VS Code** | wer will | Editor mit guter Übersicht |

---

## Erste Schritte (Checkliste)

- [ ] Beide haben einen GitHub-Account (ihr seid in `Paulik-Reisch` Org/Repo)
- [ ] Philipp: Git + Node.js + Firebase CLI installiert
- [ ] Max: Antigravity oder Claude Code eingerichtet
- [ ] Ein "Test-Branch" gemacht, um den Flow zu üben
- [ ] Erste gemeinsame Änderung gemergt

Siehe `publish.md` für das Live-Schalten und `version.md` für Versionsnummern.
