# Publish — Live schalten (dev + production)

**Kurz gesagt:** Ihr habt eine **Live-Seite** (`paulikreisch.de`) und könnt eine
**Test-Seite** (`dev.paulikreisch.de`) haben. Neue Sachen testet ihr auf *dev*, wenn
es passt, schiebt ihr es auf *live*. So riskiert ihr nie, die echte Seite zu zerschießen.

---

## Die zwei Welten

```
  dev.paulikreisch.de   ← Spielwiese, Fehler sind OK
          │
          │  (wenn alles passt: "promote")
          ▼
  paulikreisch.de       ← die echte, öffentliche Seite
```

Das nennt man **Dev/Production-Trennung**. Standard in der Industrie, bei euch
bisher durch Firebase Studio verdeckt.

---

## Was Firebase kann (eure Domain)

In der Firebase-Config habt ihr die Domain `paulikreisch.de` plus die Wildcard
`*.paulikreisch.de`. Das heißt: ihr könnt **beliebige Subdomains** nutzen, z. B.:

- `paulikreisch.de` → Production (live)
- `dev.paulikreisch.de` → Dev/Staging (Test)
- `staging.paulikreisch.de` → optional weitere

> Die Wildcard `*.paulikreisch.de` ist der Kniff: jede Subdomain, die Firebase
> kennt, funktioniert automatisch — ihr müsst sie nur in Firebase Hosting verbinden.

---

## Wie man das einrichtet (einmalig)

### Schritt 1 — Dev-Deploy zu Firebase
In Firebase App Hosting könnt ihr **zwei Backends** anlegen:
- `paulikreisch-prod` → verbunden mit `paulikreisch.de`
- `paulikreisch-dev` → verbunden mit `dev.paulikreisch.de`

Oder (einfacher, solange klein): ein Backend, und ihr deployt mit unterschiedlichem
Channel/Target.

### Schritt 2 — DNS (einmalig bei eurem Domain-Anbieter)
Firebase gibt euch Records (TXT/CNAME) aus, die ihr bei eurem Domain-Hoster
(egal ob Namecheap, GoDaddy, IONOS) eintragt. Das machen wir einmalig — danach
läuft es.

---

## Der Publish-Ablauf (Alltag)

### Variante A — nur über GitHub (empfohlen für euch)

```
1. Ihr arbeitet auf einem Branch (siehe collaborate.md)
2. PR → merge in main
3. main wird automatisch zu dev.paulikreisch.de gebaut (GitHub Action / Firebase)
4. Ihr schaut drüber: "Passt!"
5. Ihr sagt: "Jetzt live" → Firebase promotet dev → paulikreisch.de
```

### Variante B — manuell (Philipp)

```bash
# Dev veröffentlichen
firebase deploy --only hosting:dev

# Wenn geprüft: Production veröffentlichen
firebase deploy --only hosting:prod
```

---

## Warum das sicher ist

- Fehler auf **dev** sehen nur ihr (oder kaum jemand)
- **live** wird nur angefasst, wenn dev grün ist
- Jeder Deploy ist ein Snapshot → bei Panik: zurück auf letzte Version

---

## Checkliste für "Go Live"

- [ ] Auf `dev.paulikreisch.de` alles durchgeklickt
- [ ] Favicon/Bilder laden
- [ ] Mobile-Ansicht geprüft
- [ ] Newsletter/Formulare getestet
- [ ] Dann: `firebase deploy` → production

Siehe `version.md` für Versionsnummern und `stack.md` für den Gesamtüberblick.
