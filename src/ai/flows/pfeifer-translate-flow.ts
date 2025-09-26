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
});
export type PfeiferTranslateInput = z.infer<typeof PfeiferTranslateInputSchema>;

const PfeiferTranslateOutputSchema = z.object({
  translation: z.string().describe('The translated text in "Pfeiferisch".'),
});
export type PfeiferTranslateOutput = z.infer<typeof PfeiferTranslateOutputSchema>;

export async function pfeiferTranslate(input: PfeiferTranslateInput): Promise<PfeiferTranslateOutput> {
  return pfeiferTranslateFlow(input);
}

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

**Beispiel:**
- **Input:** "Der Klassenraum ist leer, denn die Schüler schwänzen alle!"
- **Pfeiferisch Output:** "El Claseraum pfffff es ähhh no es lleno de phüü phüü estudiantes, weil tüdülülüü todos son am schwänzen - schon wieder [uuuhhh *pfeiferisches säufzen*]"

Übersetze jetzt den folgenden Text auf deine unnachahmliche Art ins Pfeiferische:

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
