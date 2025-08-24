'use server';
/**
 * @fileOverview An AI agent to generate satirical bureaucratic responses.
 *
 * - generateBureaucracyResponse - A function that handles the response generation.
 * - GenerateBureaucracyInput - The input type for the function.
 * - GenerateBureaucracyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBureaucracyInputSchema = z.object({
  problem: z.string().describe("The user's problem or request to the authority."),
});
export type GenerateBureaucracyInput = z.infer<typeof GenerateBureaucracyInputSchema>;


const GenerateBureaucracyOutputSchema = z.object({
    department: z.string().describe('The name of the absurd and overly complex government department, e.g., "Sonderdezernat für die überbürokratische Abwicklung nicht dringlicher Angelegenheiten (SüDAA)".'),
    referenceNumber: z.string().describe("A long, complicated, and completely nonsensical reference number, e.g., 'AZ-2024/B-742.c-§3 Abs. 4b'."),
    date: z.string().describe("The current date in German format (DD.MM.YYYY)."),
    subject: z.string().describe("A formal and convoluted subject line for the letter."),
    responseBody: z.string().describe("The main body of the letter. It should be at least 4 long paragraphs. The text must be overly formal, passive-aggressive, full of bureaucratic jargon, refer to non-existent laws (e.g., 'gemäß der Verordnung zur Vereinheitlichung von Nichtigkeiten (VvN)'), and ultimately offer no real solution. It should be condescending and frustrating for the reader."),
    greeting: z.string().describe("A cold, formal closing line like 'Mit vorzüglicher Hochachtung' or 'In Erwartung Ihrer baldigen Zuarbeit'. "),
    officerName: z.string().describe("A funny/satirical name for the responsible officer, e.g., 'Hans-Peter Kleinkariert' or 'Sabine von Paragraphenreiter'."),
    officerTitle: z.string().describe("The equally absurd job title of the officer, e.g., 'Oberamtsrat für Formularwesen' or 'Sachbearbeiterin für die Entmutigung von Bürgern'.")
});
export type GenerateBureaucracyOutput = z.infer<typeof GenerateBureaucracyOutputSchema>;


export async function generateBureaucracyResponse(input: GenerateBureaucracyInput): Promise<GenerateBureaucracyOutput> {
  return generateBureaucracyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBureaucracyPrompt',
  input: {schema: GenerateBureaucracyInputSchema},
  output: {schema: GenerateBureaucracyOutputSchema},
  prompt: `Du bist ein KI-Generator für satirische Behörden-Antwortschreiben im Stil des Buches "Hallo Welt". Deine Aufgabe ist es, auf das vom Nutzer geschilderte Problem eine möglichst lange, komplizierte, bürokratische und absolut nicht hilfreiche Antwort zu verfassen.

Anfrage des Bürgers: {{{problem}}}

Erstelle einen kompletten Brief:
- Erfinde einen absurd langen und komplizierten Namen für die zuständige Behörde.
- Generiere ein übertrieben komplexes Aktenzeichen.
- Formuliere einen Betreff, der das einfache Problem unnötig verkompliziert.
- Der Haupttext (responseBody) muss mindestens 4 lange Absätze umfassen. Er muss extrem formell, passiv-aggressiv und voller Beamtendeutsch sein. Beziehe dich auf erfundene Gesetze und Verordnungen. Die Antwort darf keine Lösung bieten, sondern soll den Bürger frustrieren und verwirren.
- Formuliere eine kalte, distanzierte Grußformel.
- Erfinde einen passenden, satirischen Namen und Titel für den zuständigen Sachbearbeiter.
- Setze das heutige Datum ein.

Der Ton muss durchgehend trocken, belehrend und im Stil von "Hallo Welt" sein. Antworte auf Deutsch.
`,
});

const generateBureaucracyFlow = ai.defineFlow(
  {
    name: 'generateBureaucracyFlow',
    inputSchema: GenerateBureaucracyInputSchema,
    outputSchema: GenerateBureaucracyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
