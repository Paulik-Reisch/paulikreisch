'use server';
/**
 * @fileOverview An AI agent to translate text into the satirical "Pfeifer-Style".
 *
 * - pfeiferTranslate - A function that handles the translation.
 * - PfeiferTranslateInput - The input type for the function.
 * - PfeiferTranslateOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PfeiferTranslateInputSchema = z.object({
  text: z.string().describe("The text to be translated."),
  intensity: z.coerce.number().min(1).max(5).describe("A number from 1 to 5 indicating the desired intensity of 'Pfeifer-Style' chaos. 1 is subtle, 5 is maximum chaos."),
});
export type PfeiferTranslateInput = z.infer<typeof PfeiferTranslateInputSchema>;


const PfeiferTranslateOutputSchema = z.object({
    translation: z.string().describe("The translated text in 'Pfeifer-Style'. It should be a chaotic, funny, Denglish-Spanish mix."),
});
export type PfeiferTranslateOutput = z.infer<typeof PfeiferTranslateOutputSchema>;


export async function pfeiferTranslate(input: PfeiferTranslateInput): Promise<PfeiferTranslateOutput> {
  return pfeiferTranslateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pfeiferTranslatePrompt',
  input: {schema: PfeiferTranslateInputSchema},
  output: {schema: PfeiferTranslateOutputSchema},
  prompt: `Du bist "Pfeifer Translate", ein satirischer Übersetzer, der den einzigartigen Stil der Spanischlehrerin "La Silbadora Pfeifer" aus dem Buch "Hallo Welt" imitiert.

Dein Stil ist eine chaotische, aber liebenswerte Mischung aus Deutsch, Spanisch (manchmal falsch), Denglisch und absurden, pfeifenden Lauten. Du bist immer enthusiastisch, aber leicht verwirrt.

**Anweisungen:**
1.  Übersetze den gegebenen Text in diesen "Pfeifer-Stil".
2.  Baue spanische Wörter ein, gerne auch falsch dekliniert.
3.  Benutze übertriebene, enthusiastische Ausrufe wie "¡Claro que sí!", "¡Venga!", "¡Maravilloso!".
4.  Füge lautmalerische, gepfiffene Geräusche ein, die in Klammern stehen, z.B. (pfeif, pfeif), (triller), (melodisches Pfeifen).
5.  Die Intensität (1-5) bestimmt das Ausmaß des Chaos:
    - 1: Hauptsächlich Deutsch mit ein paar spanischen Wörtern.
    - 3: Guter Mix aus Denglisch, Spanisch und Gepfeife.
    - 5: Maximales Chaos, kaum noch verständlich, viele falsche spanische Wörter und absurde Pfeif-Symphonien.

**Zu übersetzender Text:**
{{{text}}}

**Gewünschte Intensität:**
{{{intensity}}}
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
