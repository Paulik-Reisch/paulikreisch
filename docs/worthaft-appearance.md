# Worthaft: Aussehen anpassen

Über das Zahnrad auf der Spieltastatur lassen sich Tastatur und Kacheln unabhängig einstellen. Alle sieben Regler zeigen Pixelwerte; die Vorschau und das Spiel reagieren sofort. Auf kleinen Bildschirmen werden breite Elemente an den verfügbaren Platz angepasst. Die angezeigten Maße sind die Wunschgröße vor dieser Anpassung.

Worthaft verwendet Blau, Gelb und Grau. Klassisch verwendet Grün, Gelb und Grau. Die Farbauswahl gilt für Spielfeld, Tastatur und die Ergebnis-Emojis beim Teilen. Die Bedeutung bleibt gleich: richtig, enthalten, fehlt.

Aussehen zurücksetzen stellt nur die visuellen Einstellungen zurück. Musik, heißer Tipp und Animationen bleiben erhalten. Gespeichert wird ausschließlich auf dem jeweiligen Gerät unter worthaft-settings. Bestehende Reglerwerte (0–4 oder ältere 0–100-Werte) werden übernommen; neue Kacheloptionen starten mit den Standardwerten. Unbekannte Felder und ungültige Typen werden verworfen, Zahlen begrenzt. Während der Einstellungen beeinflusst die Tastatur das Rätsel nicht.

## Freiwilliges Feedback

„Überspringen“ ist sowohl vor der Bewertung als auch nach der Auswahl von „Gut“ oder „Nicht gut“ verfügbar. Es öffnet direkt das Ergebnisfenster und sendet keine Bewertung an Firestore. Die Entscheidung wird nur lokal als `skipped` unter dem bisherigen Tagesschlüssel gespeichert; beim Neuladen am selben Tag wird das Feedbackfenster nicht erneut vorgeschaltet. Bei nicht verfügbarem Browserspeicher funktioniert das Überspringen weiterhin für den aktuellen Besuch.
