# Worthaft: KI-Worterklärungen

Nach einem gelösten Spiel kann die Bedeutung des Lösungswortes auf Wunsch geladen werden. Die Erklärung wird als Klartext angezeigt und als KI-generiert gekennzeichnet; sie kann Fehler enthalten.

## Einrichtung

`OPENROUTER_API_KEY` in `.env.local` bzw. als Secret in der Hosting-Umgebung setzen. Den Schlüssel niemals mit `NEXT_PUBLIC_` veröffentlichen oder committen. Ohne Schlüssel bleibt das Spiel nutzbar, die Erklärung meldet eine verständliche Nichtverfügbarkeit.

Der Server verwendet fest `openrouter/free` über `https://openrouter.ai/api/v1/chat/completions`. Kein bezahltes Ersatzmodell ist konfiguriert. OpenRouter wählt das verfügbare kostenlose Modell; Verfügbarkeit und Anbieterlimits können schwanken. Es werden ausschließlich das angefragte Lösungswort und eine feste deutsche Definitionsanweisung gesendet, keine Spielhistorie, Namen oder Feedbackdaten. Die Anfrage erfolgt erst beim Öffnen der Erklärung.

## Schnittstelle und Begrenzungen

- `POST /api/worthaft/definition`, JSON `{ "word": "birne" }`.
- Erfolg: `{ "word": "birne", "definition": "…" }`.
- Fehler: `{ "error": "…" }`; 400 ungültiges Wort/JSON, 403 fremder Browser-Ursprung, 413 zu großer Request, 429 Limit, 503 fehlende Konfiguration/Anbieterfehler, 504 Zeitüberschreitung.
- Nur normalisierte Wörter aus der enthaltenen Worthaft-Liste; maximal 256 Request-Bytes, 260 Ausgabetokens, 32 KiB Anbieterantwort und 2.000 Zeichen Erklärung. Anbieterfehler und Schlüssel werden nicht an den Browser weitergegeben.
- Abbruch nach 20 Sekunden. Erfolgreiche Erklärungen werden 24 Stunden pro Serverinstanz gespeichert, maximal 512 Einträge. Gleichzeitige Anfragen desselben Wortes werden zusammengeführt; Fehler werden nicht gespeichert.
- Maximal 20 neue Anbieteranfragen pro Minute und drei gleichzeitig pro Serverinstanz. Cachetreffer verbrauchen dieses Limit nicht. Antworten werden vom Browser nicht zwischengespeichert.

Cache und Limits sind bewusst speicherbasiert und gelten je Prozess, nicht über Replikate oder Neustarts hinweg. Für ein globales Produktionslimit zusätzlich ein zentrales Rate-Limit am Hosting-Gateway einsetzen. Dies ist kein Nachweis, dass die Person das Wort tatsächlich gelöst hat; die lokale Spielhistorie ist kein Server-Geheimnis.

## Verifikation

Die Unit-Tests in `tests/unit/worthaft-definition.test.ts` verwenden simulierte Antworten und benötigen weder API-Schlüssel noch echte Modellanfragen. Sie decken Validierung, Normalisierung, Geheimnisschutz, Modellwahl, Cache, Deduplizierung, Limits, Anbieterfehler und Timeout ab. Für einen manuellen Produktionstest einen Schlüssel konfigurieren, ein Wort lösen und die Erklärung öffnen; anschließend auch den Zustand ohne Schlüssel prüfen.

Offizielle Referenzen: [Chat-Completions-API](https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion), [Free Models Router](https://openrouter.ai/openrouter/free).

## Firebase App Hosting

Zuerst in Firebase App Hosting / Google Secret Manager das Secret `OPENROUTER_API_KEY` mit dem API-Schlüssel anlegen und dem verwendeten Backend Zugriff geben. Danach in der vorhandenen `env`-Liste von `apphosting.yaml` folgenden Eintrag ergänzen (Versionsnummer entsprechend dem angelegten Secret wählen) und neu bereitstellen:

```yaml
  - variable: OPENROUTER_API_KEY
    secret: OPENROUTER_API_KEY@1
    availability:
      - RUNTIME
```

Der Eintrag ist absichtlich noch nicht im Hosting-Manifest aktiviert: Eine Referenz auf ein nicht vorhandenes oder nicht freigegebenes Secret würde das Deployment verhindern. Für dieses Feature wird der Schlüssel nur zur Laufzeit benötigt.
