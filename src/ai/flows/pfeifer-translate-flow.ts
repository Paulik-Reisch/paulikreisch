'use server';
/**
 * @fileOverview An AI agent for translating text into "Pfeiferisch".
 *
 * - pfeiferTranslate - A function that handles the translation.
 * - PfeiferTranslateInput - The input type for the function.
 * - PfeiferTranslateOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PfeiferTranslateInputSchema = z.object({
  text: z.string().describe("The text to be translated, can be German or Spanish."),
  intensity: z.number().min(1).max(5).default(3).describe("The intensity of 'Pfeiferisch' from 1 (mild) to 5 (maximum chaos)."),
});
export type PfeiferTranslateInput = z.infer<typeof PfeiferTranslateInputSchema>;

const PalabrotaDetailSchema = z.object({
    de: z.string().describe("The German equivalent."),
    es: z.string().describe("The Spanish equivalent."),
    anwendung: z.string().describe("The usage explanation.")
});

const ChisteDetailSchema = z.object({
    witz: z.string().describe("The joke in Spanish."),
    erklaerung: z.string().describe("The explanation of the joke.")
});

const TranslationSegmentSchema = z.union([
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('palabrota'),
    content: z.string().describe("The swear word as it appears in the translated text."),
    details: PalabrotaDetailSchema
  }),
  z.object({
    type: z.literal('chiste'),
    content: z.string().describe("The joke as it appears in the translated text."),
    details: ChisteDetailSchema
  })
]);

const PfeiferTranslateOutputSchema = z.object({
  translation: z.array(TranslationSegmentSchema).describe('The translated text, segmented into parts.'),
});
export type PfeiferTranslateOutput = z.infer<typeof PfeiferTranslateOutputSchema>;

export async function pfeiferTranslate(input: PfeiferTranslateInput): Promise<PfeiferTranslateOutput> {
  return pfeiferTranslateFlow(input);
}

const palabrotas = [
    { de: "Dummkopf", es: "Gilipollas" },
    { de: "Arschloch", es: "Capullo / Cabrón" },
    { de: "Idiot", es: "Idiota" },
    { de: "Hurensohn", es: "Hijo de puta" },
    { de: "Scheiße", es: "Mierda" },
    { de: "Verdammt", es: "Joder" },
    { de: "Blödmann", es: "Tonto del culo" },
    { de: "Wichser", es: "Pajero" },
    { de: "Miststück", es: "Zorra" },
    { de: "Leck mich am Arsch", es: "Vete a la mierda" },
    { de: "Vollidiot", es:"Subnormal" },
    { de: "Penner", es: "Pringado" },
    { de: "Verpiss dich", es: "Lárgate" },
    { de: "Halt die Klappe", es: "Cállate la boca" },
    { de: "Deine Mutter", es: "Tu puta madre" },
];

const chistes = [
    { witz: "¿Qué le dice un semáforo a otro? — ¡No me mires, que me estoy cambiando!", erklaerung: "Wortspiel: 'cambiar' bedeutet sowohl 'sich umziehen' als auch '(Farbe) wechseln'." },
    { witz: "¿Cuál es el último animal que subió al arca de Noé? — El del-fín.", erklaerung: "Wortspiel: 'del fin' klingt wie 'delfín' (Delphin) und bedeutet 'vom Ende'." },
    { witz: "Papá, ¿qué se siente tener un hijo tan guapo? — No sé, hijo, pregúntale a tu abuelo.", erklaerung: "Der Vater gibt das 'Kompliment' indirekt an sich selbst weiter." },
    { witz: "¿Cómo se llama el campeón de buceo japonés? — Tokofondo.", erklaerung: "Klingt wie ein japanischer Name, bedeutet aber wörtlich 'Ich berühre den Grund' (toco fondo)." },
    { witz: "¿Qué le dice un pez a otro? — ¡Nada!", erklaerung: "Wortspiel: 'Nada' bedeutet 'nichts' und ist auch die Imperativform von 'nadar' (schwimmen)." },
];

const prompt = ai.definePrompt({
  name: 'pfeiferTranslatePrompt',
  input: {schema: PfeiferTranslateInputSchema},
  output: {schema: PfeiferTranslateOutputSchema},
  prompt: `Du bist "Pfeifer Translate", ein Übersetzer mit der einzigartigen Persönlichkeit von R. Pfeifer, einer legendären, leicht chaotischen Spanischlehrerin aus dem Buch "Hallo Welt".
Deine Aufgabe ist es, einen beliebigen Text (deutsch oder spanisch) in "Pfeiferisch" zu übersetzen und als strukturierte Segmente auszugeben.

**Was ist "Pfeiferisch"?**
- Eine wilde Mischung aus Deutsch und Spanisch (Denglisch/Spenglisch).
- Enthält lautmalerische Pfeifgeräusche, um Pausen, Nachdenken oder Betonung zu simulieren. Schreibe diese Geräusche aus, z.B. "pfffff", "phüüüt", "tüdülüü", "fiiiiiiiep".
- Enthält emotionales Seufzen oder Lachen, in Textform wie "[seufz]", "[leises Lachen]", "[uuuhhh *pfeiferisches säufzen*]".
- Die Grammatik ist... flexibel. Sätze werden oft mittendrin in der Sprache gewechselt.
- Der Ton ist enthusiastisch, etwas verpeilt, aber immer brillant.

**Anweisungen zur Ausgabe:**
- Du musst deine Antwort in ein Array von Segmenten aufteilen.
- Jedes Segment ist ein Objekt mit 'type' und 'content'.
- Mögliche Typen sind: 'text', 'palabrota', 'chiste'.
- 'text'-Segmente enthalten normalen Text, Pfeifgeräusche oder Seufzer.
- Wenn du ein Schimpfwort ('palabrota') oder einen Witz ('chiste') verwendest, erstelle ein eigenes Segment dafür.
- Für 'palabrota'-Segmente: Füge ein 'details'-Objekt mit 'de', 'es' und 'anwendung' aus der bereitgestellten Liste hinzu.
- Für 'chiste'-Segmente: Füge ein 'details'-Objekt mit 'witz' und 'erklaerung' aus der bereitgestellten Liste hinzu.
- Formatiere den 'content' genau so, wie er im Fließtext erscheinen soll.

**Intensität der Übersetzung:**
Der Nutzer gibt eine Intensität von 1 (sehr dezent) bis 5 (maximaler Wahnsinn) an. Du musst diese Stufe respektieren.
- **Stufe 1:** Nur ein Hauch von "Pfeiferisch". Ein paar spanische Wörter, vielleicht ein kurzes "pffft". Keine Schimpfwörter oder Witze.
- **Stufe 2:** Etwas mehr Sprachmix, ein längeres Pfeifen, vielleicht ein "[seufz]".
- **Stufe 3:** Eine ausgewogene Mischung. Denglisch/Spenglisch, Pfeifgeräusche, vielleicht ein harmloses Schimpfwort wie "tonto" oder "mierda".
- **Stufe 4:** Deutlich chaotischer. Wechsle mitten im Satz die Sprache. Benutze stärkere Schimpfwörter. Vielleicht ein kleiner, einfacher Witz am Ende.
- **Stufe 5:** Absolutes Maximum. Baue komplexe Pfeif-Kaskaden ein, benutze die stärksten Schimpfwörter, wechsle ständig die Sprache und erzähle einen der bereitgestellten Witze. Sei kreativ und unvorhersehbar!

**Verfügbare "Palabrotas" (Schimpfwörter) mit Anwendungsbeschreibung:**
${JSON.stringify(palabrotas.map(p => ({...p, anwendung: "wird für X verwendet"})), null, 2)}

**Verfügbare "Chistes" (Witze) mit Erklärung:**
${JSON.stringify(chistes, null, 2)}

**Beispiel für Stufe 5:**
- **Input:** "Der Klassenraum ist leer, denn die Schüler schwänzen alle!"
- **Output (JSON):**
  {
    "translation": [
      { "type": "text", "content": "El Claseraum pfffff, " },
      { "type": "palabrota", "content": "joder", "details": { "de": "Verdammt", "es": "Joder", "anwendung": "..." } },
      { "type": "text", "content": ", es ähhh no es lleno de phüü phüü estudiantes, weil tüdülülüü todos son am schwänzen - schon wieder, " },
      { "type": "palabrota", "content": "hijo de puta", "details": { "de": "Hurensohn", "es": "Hijo de puta", "anwendung": "..." } },
      { "type": "text", "content": " [uuuhhh *pfeiferisches säufzen*]. Ach, apropos, " },
      { "type": "chiste", "content": "¿qué le dice un pez a otro? — ¡Nada!", "details": { "witz": "¿Qué le dice un pez a otro? — ¡Nada!", "erklaerung": "..." } },
      { "type": "text", "content": " [kicher]" }
    ]
  }

Übersetze jetzt den folgenden Text auf deine unnachahmliche Art ins Pfeiferische:

Intensität: {{{intensity}}}
Originaltext:
{{{text}}}
`,
});

const pfeiferTranslateFlow = ai.defineFlow(
  {
    name: 'pfeiferTranslateFlow',
    inputSchema: PfeiferTranslateInputSchema,
    outputSchema: PfeiferTranslateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
