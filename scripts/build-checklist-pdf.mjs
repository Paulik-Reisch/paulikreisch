import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function build() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const primary = rgb(0.13, 0.46, 0.82); // #2275d3 approx
  const muted = rgb(0.42, 0.44, 0.48);
  const dark = rgb(0.12, 0.12, 0.14);
  const accent = rgb(0.99, 0.80, 0.18);

  // Top bar
  page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: primary });
  page.drawText('PAULIK & REISCH', { x: 32, y: height - 38, size: 10, font: fontBold, color: rgb(1,1,1) });
  page.drawText('Hallo Welt - Satire', { x: 32, y: height - 52, size: 7, font, color: rgb(1,1,1) });
  page.drawText('paulikreisch.de', { x: width - 120, y: height - 38, size: 7, font, color: rgb(1,1,1) });

  let y = height - 105;
  page.drawText('CHECKLISTE', { x: 32, y, size: 9, font: fontBold, color: primary });
  y -= 18;
  // Title
  page.drawText('10 Anzeichen,', { x: 32, y, size: 26, font: fontBold, color: dark }); y -= 28;
  page.drawText('dass deine Schule', { x: 32, y, size: 26, font: fontBold, color: dark }); y -= 28;
  page.drawText('eine Lernvollzugsanstalt ist', { x: 32, y, size: 26, font: fontBold, color: dark }); y -= 16;
  page.drawText('Der humorvolle Selbsttest - und was du dagegen tun kannst.', { x: 32, y, size: 9, font: fontOblique, color: muted }); y -= 8;
  page.drawLine({ start: { x: 32, y }, end: { x: width - 32, y }, thickness: 0.7, color: rgb(0.9,0.9,0.9)}); y -= 18;

  const items = [
    ['Morgens um 7:45 Anwesenheitspflicht', 'Der Wecker klingelt, du bist schon im Minus. Wer zu spät kommt, schreibt Entschuldigungen wie Liebesbriefe.'],
    ['Hausaufgaben > Freizeit', 'Wenn "kurz was für morgen machen" 3 Stunden frisst, ist das kein Lernen - das ist Vollzug.'],
    ['Lehrer-Roboter Modus', 'Noten statt Neugier, Vorschriften statt Verstehen. Der Unterricht läuft auf Autopilot.'],
    ['Bürokratie-Bingo', 'Anträge, Formulare, Stempel - du brauchst einen Antrag, um einen Antrag zu stellen.'],
    ['Noten = Selbstwert', 'Eine Zahl entscheidet, ob du "gut genug" bist. Spoiler: Du bist mehr als eine 3,2.'],
    ['Flur = Gefängnishof', 'Pausenaufsicht, Durchsagen, Türen die nur in eine Richtung aufgehen.'],
    ['Pfeffer-Moment', 'Jemand zitiert Regeln, die niemand versteht - und alle nicken. Willkommen im Theater.'],
    ['To-Do ohne Ende', 'Kaum fertig, kommt das nächste Arbeitsblatt. Erholung ist als "Fehlzeit" markiert.'],
    ['Eigene Meinung = Risiko', 'Wer kritisch fragt, bekommt Zusatzaufgaben. Satire ist hier Notwehr.'],
    ['Du zählst die Tage', 'Ferien als Lichtblick, nicht als Pause. Wenn du nur noch auf den Gong wartest...'],
  ];

  const boxHeight = 48;
  const gap = 10;
  for (let i = 0; i < items.length; i++) {
    if (y - boxHeight < 90) break;
    const [title, desc] = items[i];
    // checkbox square
    page.drawRectangle({ x: 32, y: y - boxHeight + 12, width: 16, height: 16, borderColor: primary, borderWidth: 1.2, color: rgb(1,1,1) });
    page.drawText(String(i+1), { x: 64, y: y - 18, size: 11, font: fontBold, color: primary });
    page.drawText(title, { x: 84, y: y - 18, size: 10, font: fontBold, color: dark });
    // wrap desc manually (simple)
    const maxWidth = width - 100;
    // naive wrap: split at ~70 chars
    let descLine = desc;
    // just one line with smaller font, truncate if too long
    page.drawText(descLine, { x: 84, y: y - 32, size: 7.5, font, color: muted, maxWidth });
    // subtle card bg
    // border
    page.drawRectangle({ x: 28, y: y - boxHeight, width: width - 56, height: boxHeight, borderColor: rgb(0.92,0.92,0.93), borderWidth: 0.6 });
    y -= boxHeight + gap;
  }

  y -= 4;
  page.drawRectangle({ x: 28, y: y - 56, width: width - 56, height: 56, color: rgb(0.98, 0.98, 0.99), borderColor: rgb(0.9,0.9,0.9), borderWidth: 0.6 });
  page.drawText('Was jetzt? Die ganze Abrechnung liest du in "Hallo Welt" - 106 Seiten Satire', { x: 36, y: y - 18, size: 8, font: fontBold, color: dark });
  page.drawText('Kapitel 1-3 als Vorgeschmack hast du schon per Mail. Das Buch gibt\'s für 10,99 € auf Amazon.', { x: 36, y: y - 30, size: 7, font, color: muted });
  page.drawText('-> paulikreisch.de/shop  •  amazon.de/dp/3982548803', { x: 36, y: y - 42, size: 7, font: fontBold, color: primary });

  // Footer
  page.drawText('© Paulik & Reisch 2026 * paulikreisch.de * Worthaft täglich: paulikreisch.de/worthaft', { x: 32, y: 28, size: 6, font, color: muted });
  page.drawText('Hinweis: Satire. Kein pädagogischer Ratgeber. Lachen auf eigene Gefahr.', { x: 32, y: 18, size: 6, font: fontOblique, color: muted });

  const bytes = await doc.save();
  const out = path.join(process.cwd(), 'public', 'checkliste-lernvollzugsanstalt.pdf');
  fs.writeFileSync(out, bytes);
  console.log('PDF written to', out, bytes.length, 'bytes');
}
build().catch(e => { console.error(e); process.exit(1); });
