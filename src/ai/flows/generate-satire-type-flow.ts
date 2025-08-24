'use server';
/**
 * @fileOverview An AI agent to determine a user's satire personality type based on a questionnaire.
 *
 * - generateSatireType - A function that handles the type generation.
 * - GenerateSatireTypeInput - The input type for the function.
 * - GenerateSatireTypeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSatireTypeInputSchema = z.object({
  q1: z.string().describe("Antwort auf die Frage nach der Reaktion auf den Wecker."),
  q2: z.string().describe("Antwort auf die Frage, wie man auf eine Bahndurchsage reagiert."),
  q3: z.string().describe("Antwort auf die Frage nach der Reaktion auf ein kompliziertes Formular."),
  q4: z.string().describe("Antwort auf die Frage nach der Einstellung zur Arbeit."),
  q5: z.string().describe("Antwort auf die Frage nach dem persönlichen Lebensmotto."),
});
export type GenerateSatireTypeInput = z.infer<typeof GenerateSatireTypeInputSchema>;


const GenerateSatireTypeOutputSchema = z.object({
    title: z.string().describe('Der Titel des Satire-Typs, z.B. "Der pedantische Privatpatient" oder "Der phlegmatische Formular-Phobiker".'),
    description: z.string().describe("Eine längere, satirische und humorvolle Beschreibung des Persönlichkeitstyps, die auf den gegebenen Antworten basiert. Sie sollte den Charakter, seine Stärken und Schwächen im 'Hallo Welt'-Stil beleuchten."),
    shareText: z.string().describe("Ein kurzer, bissiger Spruch, der für das Teilen in sozialen Medien geeignet ist. z.B. 'Offiziell bestätigt: Ich bin ein pedantischer Privatpatient. Mein Rezept gegen Chaos? Noch mehr Chaos.'"),
    imagePrompt: z.string().describe("Ein kurzer, prägnanter englischer Prompt (max. 10 Wörter) für eine KI-Bildgenerierung, der den Charakter visuell darstellt. z.B. 'grumpy patient in a suit complaining', 'overwhelmed person drowning in paperwork', 'a person happily sleeping in a chaotic office'.")
});
export type GenerateSatireTypeOutput = z.infer<typeof GenerateSatireTypeOutputSchema>;


export async function generateSatireType(input: GenerateSatireTypeInput): Promise<GenerateSatireTypeOutput> {
  return generateSatireTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSatireTypePrompt',
  input: {schema: GenerateSatireTypeInputSchema},
  output: {schema: GenerateSatireTypeOutputSchema},
  prompt: `Du bist ein Psychoanalytiker im "Hallo Welt"-Universum. Deine Aufgabe ist es, basierend auf den Antworten eines Fragebogens den satirischen Persönlichkeitstyp eines Nutzers zu bestimmen.

Hier sind die Antworten des Probanden:
- Wecker-Reaktion: {{{q1}}}
- Bahn-Reaktion: {{{q2}}}
- Formular-Reaktion: {{{q3}}}
- Arbeits-Einstellung: {{{q4}}}
- Lebensmotto: {{{q5}}}

Analysiere diese Antworten und erstelle ein komplettes Profil:
1.  **Titel:** Erfinde einen passenden, kreativen und satirischen Titel für den Typen. Beispiele: "Der pedantische Privatpatient", "Der desillusionierte Dauercamper", "Der phlegmatische Formular-Phobiker", "Der motivierte Minimalist".
2.  **Beschreibung:** Schreibe eine detaillierte, humorvolle und bissige Beschreibung dieses Charakters. Gehe darauf ein, wie dieser Typ durchs Leben geht, was ihn antreibt und was ihn zur Verzweiflung bringt. Der Stil muss dem von "Hallo Welt" entsprechen: trocken, überzogen, voller Ironie.
3.  **Share-Text:** Verfasse einen kurzen, prägnanten und lustigen Satz, den der Nutzer auf Social Media teilen kann, um sein Ergebnis zu verkünden.
4.  **Bild-Prompt:** Erstelle einen kurzen, englischen Prompt für eine Bild-KI, der den Charakter visuell treffend zusammenfasst. Maximal 10 Worte.

Der Ton muss durchgehend satirisch, analytisch und gnadenlos ehrlich sein. Antworte auf Deutsch.
`,
});

const generateSatireTypeFlow = ai.defineFlow(
  {
    name: 'generateSatireTypeFlow',
    inputSchema: GenerateSatireTypeInputSchema,
    outputSchema: GenerateSatireTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
