# Worthaft: Aussehen anpassen

Über das Zahnrad auf der Spieltastatur öffnet sich das Menü mit den Kategorien Aussehen, Spiel und Ton. Auf dem Desktop stehen sie links im Dialog, auf dem Smartphone oberhalb der Einstellungen. Unter Aussehen lassen sich Tastatur und Kacheln unabhängig einstellen. Alle sieben Regler zeigen Stufen von 0 bis 4. Die Vorschau und das Spiel reagieren sofort. Auf kleinen Bildschirmen werden breite Elemente an den verfügbaren Platz angepasst.

Worthaft verwendet Blau, Gelb und Grau. Klassisch verwendet Grün, Gelb und Grau. Die Farbauswahl gilt für Spielfeld, Tastatur und die Ergebnis-Emojis beim Teilen. Die Bedeutung bleibt gleich: richtig, enthalten, fehlt.

Auf der Tastatur werden ausgeschlossene Buchstaben ausgeblendet dargestellt. Der einmalige heiße Tipp markiert eine Taste mit einem Lösungsbuchstaben. Er verändert den aktuellen Versuch nicht und verrät keine Position. Beim Teilen wird der Versuch genannt, in dem der Tipp eingesetzt wurde.

Aussehen zurücksetzen stellt nur die visuellen Einstellungen zurück. Musik, heißer Tipp und Animationen bleiben erhalten. Gespeichert wird ausschließlich auf dem jeweiligen Gerät unter worthaft-settings. Bestehende Reglerwerte (0–4 oder ältere 0–100-Werte) werden übernommen; neue Kacheloptionen starten mit den Standardwerten. Unbekannte Felder und ungültige Typen werden verworfen, Zahlen begrenzt. Während der Einstellungen beeinflusst die Tastatur das Rätsel nicht.

## Blaue Buchstaben wiederholen

Auf dem Desktop übernimmt die Pfeiltaste nach oben alle bereits erkannten blauen Buchstaben aus früheren Versuchen an ihre Position in der aktuellen Zeile. Bereits getippte Buchstaben bleiben erhalten, der Cursor springt auf das erste freie Feld. Die Taste ist immer verfügbar. Unter Einstellungen > Spiel gibt es zusätzlich „Blaue Buchstaben wiederholen“ (Standard: aus, gespeichert als `repeatConfirmedLetters` unter worthaft-settings). Ist sie aktiv, starten neue Zeilen automatisch mit den erkannten Buchstaben, auch nach einem Neuladen. Gedacht ist das vor allem für das Smartphone.

## Freiwilliges Feedback

„Überspringen“ ist sowohl vor der Bewertung als auch nach der Auswahl von „Gut“ oder „Nicht gut“ verfügbar. Es öffnet direkt das Ergebnisfenster und sendet keine Bewertung an Firestore. Die Entscheidung wird nur lokal als `skipped` unter dem bisherigen Tagesschlüssel gespeichert; beim Neuladen am selben Tag wird das Feedbackfenster nicht erneut vorgeschaltet. Bei nicht verfügbarem Browserspeicher funktioniert das Überspringen weiterhin für den aktuellen Besuch.
