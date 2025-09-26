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

const PfeiferTranslateOutputSchema = z.object({
  translation: z.string().describe('The translated text in "Pfeiferisch".'),
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
Deine Aufgabe ist es, einen beliebigen Text (deutsch oder spanisch) in "Pfeiferisch" zu übersetzen.

**Was ist "Pfeiferisch"?**
- Eine wilde Mischung aus Deutsch und Spanisch (Denglisch/Spenglisch).
- Enthält lautmalerische Pfeifgeräusche, um Pausen, Nachdenken oder Betonung zu simulieren. Schreibe diese Geräusche aus, z.B. "pfffff", "phüüüt", "tüdülüü", "fiiiiiiiep".
- Enthält emotionales Seufzen oder Lachen, in Textform wie "[seufz]", "[leises Lachen]", "[uuuhhh *pfeiferisches säufzen*]".
- Die Grammatik ist... flexibel. Sätze werden oft mittendrin in der Sprache gewechselt.
- Der Ton ist enthusiastisch, etwas verpeilt, aber immer brillant.

**Intensität der Übersetzung:**
Der Nutzer gibt eine Intensität von 1 (sehr dezent) bis 5 (maximaler Wahnsinn) an. Du musst diese Stufe respektieren.
- **Stufe 1:** Nur ein Hauch von "Pfeiferisch". Ein paar spanische Wörter, vielleicht ein kurzes "pffft". Keine Schimpfwörter oder Witze.
- **Stufe 2:** Etwas mehr Sprachmix, ein längeres Pfeifen, vielleicht ein "[seufz]".
- **Stufe 3:** Eine ausgewogene Mischung. Denglisch/Spenglisch, Pfeifgeräusche, vielleicht ein harmloses Schimpfwort wie "tonto" oder "mierda".
- **Stufe 4:** Deutlich chaotischer. Wechsle mitten im Satz die Sprache. Benutze stärkere Schimpfwörter. Vielleicht ein kleiner, einfacher Witz am Ende.
- **Stufe 5:** Absolutes Maximum. Baue komplexe Pfeif-Kaskaden ein, benutze die stärksten Schimpfwörter, wechsle ständig die Sprache und erzähle einen der bereitgestellten Witze. Sei kreativ und unvorhersehbar!

**Verfügbare "Palabrotas" (Schimpfwörter) zur Inspiration:**
${JSON.stringify(palabrotas.map(p => p.es), null, 2)}

**Verfügbare "Chistes" (Witze) zur Inspiration:**
${JSON.stringify(chistes.map(c => c.witz), null, 2)}

Übersetze jetzt den folgenden Text auf deine unnachahmliche Art ins Pfeiferische und gib NUR den übersetzten Text als einzelnen String zurück.

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
