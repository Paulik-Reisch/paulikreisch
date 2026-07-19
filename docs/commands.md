# Commands — die wichtigsten Befehle (Cheat Sheet)

**Kurz gesagt:** Hier stehen alle Befehle, die du im Terminal brauchst — von
"Code holen" bis "Live schalten". Einfach erklärt, mit Beispiel. Keine Panik,
die meisten macht eh die KI (Claude Code) für dich.

> 💡 **Tipp:** Wenn du Claude Code oder Antigravity nutzt, kannst du oft einfach
> sagen: *"Pushe das"* oder *"Deploye auf live"* — die KI tippt diese Befehle
> für dich. Diese Liste ist dein Nachschlagewerk.

---

## 0. Einmalig: Setup

```bash
# Node.js prüfen (muss installiert sein)
node --version

# Git prüfen
git --version

# Firebase CLI installieren (einmalig)
npm install -g firebase-tools

# Bei Firebase anmelden (öffnet Browser)
firebase login

# Bei GitHub anmelden (einmalig)
gh auth login
```

---

## 1. Projekt zum ersten Mal holen (Clone)

```bash
git clone https://github.com/Paulik-Reisch/paulikreisch.git
cd paulikreisch
npm install          # alle Abhängigkeiten laden
```

**Was das macht:** Kopiert das komplette Projekt von GitHub auf deinen PC.

---

## 2. Jeden Tag: Neusten Stand holen (Pull)

```bash
git pull origin main
```

**Erklärung:** Holt die neuesten Änderungen (z. B. von Max) auf deinen PC.
**Immer machen, bevor du anfängst zu arbeiten.**

---

## 3. Eigenen Arbeits-Zweig machen (Branch)

```bash
git checkout -b feature/neuer-hero
```

**Erklärung:** `feature/neuer-hero` ist ein Name, den du frei wählst. Du arbeitest
darauf, ohne die Live-Version (`main`) zu gefährden.

```bash
git checkout main          # zurück zur Hauptversion wechseln
git branch                 # alle Zweige anzeigen
git branch -d feature/xyz  # einen Zweig löschen (wenn fertig)
```

---

## 4. Änderungen speichern (Add + Commit)

```bash
git add -A                       # alle geänderten Dateien markieren
git commit -m "Hero-Text geändert"   # speichern mit Beschreibung
```

**Erklärung:**
- `add` = "ich will diese Dateien speichern"
- `commit` = "Schnappschuss mit Notiz"
- Die Nachricht (`-m "..."`) sollte kurz sagen, WAS du gemacht hast.

```bash
git status          # zeigt, was geändert ist (nicht gespeichert)
git diff            # zeigt genau die Unterschiede im Code
git log --oneline   # zeigt die Versions-Historie
```

---

## 5. Hochladen (Push)

```bash
git push origin main                 # auf die Hauptversion
git push origin feature/neuer-hero   # auf deinen Zweig
```

**Erklärung:** Schickt deine gespeicherten Änderungen zu GitHub.

---

## 6. Zusammenführen (Merge / Pull Request)

**Weg A — auf GitHub (empfohlen, sicher):**
1. Du pushst deinen Branch
2. Auf GitHub klickst du **"New Pull Request"**
3. Du vergleichst `feature/...` → `main`
4. Klick **"Merge"** → fertig

**Weg B — lokal:**
```bash
git checkout main
git merge feature/neuer-hero
git push origin main
```

**Erklärung:** Merge = dein Zweig wird in die Hauptversion eingebaut.

---

## 7. Konflikte lösen (Conflict)

Wenn zwei die gleiche Zeile geändert haben:

```bash
git status          # zeigt die konflikt-Dateien
# Datei öffnen, die <<<<<<< Markierungen enthalten
# richtige Version behalten, anderen Teil löschen
git add -A
git commit -m "Konflikt gelöst"
```

**Tipp:** Meist löst die KI (Claude/Antigravity) das automatisch. Bei Panik einfach
mich (Hermes) oder die KI fragen.

---

## 8. Veröffentlichen (Firebase Deploy)

```bash
# Alles veröffentlichen (App Hosting)
firebase deploy

# Nur Hosting
firebase deploy --only hosting

# Auf Dev-Subdomain (wenn eingerichtet)
firebase deploy --only hosting:dev

# Auf Production
firebase deploy --only hosting:prod
```

**Wichtig:** Vorher immer `npm run build` testen, damit du siehst, ob es kompiliert:
```bash
npm run build
```

---

## 9. Versionen markieren (Tag / Release)

```bash
git tag v1.2.0              # Version markeren
git push origin v1.2.0      # hochladen
```

**Erklärung:** Ein Meilenstein-Snapshot, zu dem du später zurückkehren kannst.

---

## 10. Zurückrollen (Rollback)

```bash
# Zur letzten guten Version springen
git checkout v1.1.0
firebase deploy
```

Oder in Firebase App Hosting: **Rollback-Button** pro Deploy (jeder Build ist
gespeichert).

---

## 11. Lokaler Test (Dev-Server)

```bash
npm run dev       # Startseite läuft auf http://localhost:9002
npm run build     # Production-Build testen
npm run start     # gebauten Build lokal starten
npm run lint      # Code-Prüfung
npm run typecheck # TypeScript-Prüfung
```

---

## 12. GitHub CLI (gh) — nützlich

```bash
gh repo view                      # Repo-Infos
gh pr create                      # Pull Request erstellen
gh pr list                        # offene PRs
gh auth login                     # bei GitHub anmelden
gh release create v1.2.0          # Release auf GitHub
```

---

## Schnell-Referenz (Spickzettel)

| Was du willst | Befehl |
|---------------|--------|
| Neuen Stand holen | `git pull origin main` |
| Neuen Zweig | `git checkout -b name` |
| Änderung speichern | `git add -A && git commit -m "..."` |
| Hochladen | `git push origin main` |
| Live schalten | `firebase deploy` |
| Build testen | `npm run build` |
| Lokal ansehen | `npm run dev` |
| Version markeren | `git tag v1.2.0 && git push origin v1.2.0` |
| Zurück | `git checkout v1.1.0` |

---

© Paulik & Reisch
