export const funnelEmails = {
  day0: {
    subject: 'Deine Checkliste + Gratis-Kapitel sind da 🎉',
    html: (opts: { checklistUrl: string; shopUrl: string }) => `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6">
        <p style="font-size:12px;letter-spacing:0.12em;color:#2275d3;font-weight:800;text-transform:uppercase;margin:0">Paulik & Reisch • Funnel Tag 0</p>
        <h1 style="font-size:24px;margin:8px 0 12px">Deine Checkliste ist da — und ein Bonus-Kapitel dazu.</h1>
        <p>Danke! Du hast den besten Deal gemacht: 0 €, 0 Spam, 100% Satire.</p>
        <p><strong>1. Checkliste (PDF):</strong> <a href="${opts.checklistUrl}" style="color:#2275d3;font-weight:700">10 Anzeichen, dass deine Schule eine Lernvollzugsanstalt ist → PDF öffnen</a></p>
        <p><strong>2. Gratis-Kapitel:</strong> Unten ein Vorgeschmack aus <em>Hallo Welt</em> — Pfeffers legendärer Monolog. Wenn du danach nicht grinst, schulde ich dir einen Kaffee.</p>
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#f9fafb;margin:16px 0">
          <p style="margin:0;font-style:italic;color:#374151">„Wer hier nicht spurt, schreibt die Klausur eben im Stehen — und zwar mit links, damit die Handschrift auch leidet.“ — R. Pfeffer, Hallo Welt S.42</p>
        </div>
        <p>Das komplette Buch hat 106 Seiten davon. Wenn dir der Stil gefällt, ist der nächste Schritt einfach:</p>
        <p><a href="${opts.shopUrl}" style="display:inline-block;background:#2275d3;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:800">Zum Buch — 10,99 € auf Amazon →</a></p>
        <p style="font-size:13px;color:#6b7280">PS: Du bekommst in den nächsten Tagen noch 4 kurze Mails (Story, Reviews, Exzerpt, Angebot) — abbestellen jederzeit mit 1 Klick.</p>
        <p style="font-size:12px;color:#9ca3af">paulikreisch.de • Worthaft täglich: paulikreisch.de/worthaft</p>
      </div>
    `,
  },
  day1: {
    subject: 'Wie Hallo Welt entstanden ist (Küchen-Tisch + Spülmaschine)',
    html: (opts: { shopUrl: string }) => `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6">
        <p style="font-size:12px;letter-spacing:0.12em;color:#2275d3;font-weight:800;text-transform:uppercase;margin:0">Tag 1 • Die Story</p>
        <h2 style="font-size:22px;margin:8px 0">Zwei Typen, eine Spülmaschine, ein Buch.</h2>
        <p>Wir haben Hallo Welt nicht im Elfenbeinturm geschrieben. Sondern zwischen Spülmaschine ausräumen, Klausurpanik und dem Moment, in dem Pfeffer sagte: „Wer das System ernst nimmt, hat schon verloren.“</p>
        <p>Das Buch ist unsere Abrechnung — nicht gegen Lehrer, sondern gegen das System, das aus Neugier Noten macht. 106 Seiten Episoden: mal absurd, mal ehrlich, immer mit dem Wunsch, dass du dich weniger allein fühlst.</p>
        <p><strong>Ein Leser schrieb:</strong> „Ich habe im Zug meinen Halt verpasst, weil ich nicht aufhören konnte.“ — Genau dafür haben wir es gemacht.</p>
        <p><a href="${opts.shopUrl}" style="display:inline-block;background:#fecb2e;color:#111;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:800">Leseprobe + Shop ansehen →</a></p>
        <p style="font-size:12px;color:#9ca3af">Morgen: Was echte Leser sagen — ungeschönt.</p>
      </div>
    `,
  },
  day3: {
    subject: 'Was Leser wirklich sagen (und warum 4.8 Sterne lügen können)',
    html: (opts: { shopUrl: string }) => `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6">
        <p style="font-size:12px;letter-spacing:0.12em;color:#2275d3;font-weight:800;text-transform:uppercase;margin:0">Tag 3 • Social Proof</p>
        <h2 style="font-size:22px;margin:8px 0">„Mein Toaster will jetzt Anträge in dreifacher Ausführung.“</h2>
        <p>Echte Nachricht eines Lesers. Wir schwören.</p>
        <ul>
          <li><strong>Zufriedener Pendler:</strong> „Im Zug verpasst, 30km gelaufen — hat sich gelohnt.“</li>
          <li><strong>Seelenverwandter:</strong> „Endlich ein Buch, das so denkt wie ich.“</li>
          <li><strong>Amazon:</strong> 4.8 von 5 — und ja, das sind echte Menschen, keine Bots.</li>
        </ul>
        <p>Wir machen keine Hochglanz-Werbung. Wir machen Satire, die weh tut und heilt. Wenn du bis hier gelesen hast, bist du unsere Zielgruppe.</p>
        <p><a href="${opts.shopUrl}" style="display:inline-block;background:#2275d3;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:800">Reviews + Buch ansehen →</a></p>
      </div>
    `,
  },
  day5: {
    subject: 'Leseprobe: Das Kapitel, das alle zitieren (S.23-28)',
    html: (opts: { shopUrl: string }) => `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6">
        <p style="font-size:12px;letter-spacing:0.12em;color:#2275d3;font-weight:800;text-transform:uppercase;margin:0">Tag 5 • Exzerpt</p>
        <h2 style="font-size:22px;margin:8px 0">Pfeffer betritt den Raum. Alle halten die Luft an.</h2>
        <p><em>„Sie sprang mit heuchlerischem Enthusiasmus vor die Tafel“, erinnert sich einer der Autoren, „und lehrte uns die ersten wirklich nützlichen Wörter.“ Nicht hola, nicht gracias. Sondern das, was man braucht, wenn der Bus zu spät kommt oder das Mensaessen nach Kernschmelze schmeckt.</em></p>
        <p>Dieses Kapitel ist der Grund, warum Leser das Buch ihren Freunden geben. Es ist kurz, böse, und du erkennst deine eigene Schule wieder.</p>
        <p><a href="${opts.shopUrl}" style="display:inline-block;background:# fecb2e;color:#111;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:800">Weiterlesen im Buch →</a></p>
        <p style="font-size:13px;color:#6b7280">Tipp: Das Buch ist ideal zum Verschenken — an alle, die Schule überlebt haben.</p>
      </div>
    `,
  },
  day7: {
    subject: 'Letzte Chance: 10,99 € statt 20,99 € — Angebot endet bald ⏳',
    html: (opts: { shopUrl: string }) => `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6">
        <p style="font-size:12px;letter-spacing:0.12em;color:#d97706;font-weight:800;text-transform:uppercase;margin:0">Tag 7 • Letzter Call — ehrlich & knapp</p>
        <h2 style="font-size:22px;margin:8px 0">20,99 € → 10,99 €. Danach wieder normal.</h2>
        <p>Wir machen kein künstliches Drama. Aber: Unser Kurzzeit-Angebot (10,99 €) ist genau für Leute wie dich gedacht — die erst lesen, dann entscheiden. Du hast gelesen. Du hast gelacht. Jetzt fehlt nur noch das Buch im Regal.</p>
        <p><strong>106 Seiten, 1. Auflage, 4.8★. Für weniger als zwei Döner.</strong></p>
        <p><a href="${opts.shopUrl}" style="display:inline-block;background:#2275d3;color:#fff;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:800">Ja, ich will das Buch — 10,99 € →</a></p>
        <p style="font-size:13px;color:#6b7280">Kein Kaufzwang. Aber wenn du es nicht holst, verpasst du den besten Pfeffer-Moment. Und der ist es wert.</p>
        <p style="font-size:12px;color:#9ca3af">Du willst keine Mails mehr? <a href="{{unsubscribe_url}}">Hier abmelden</a> — wir nehmen's sportlich.</p>
      </div>
    `,
  },
} as const;

export type FunnelDay = keyof typeof funnelEmails;
