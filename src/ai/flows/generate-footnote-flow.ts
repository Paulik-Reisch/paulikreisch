'use server';
/**
 * @fileOverview An AI agent to generate satirical footnotes in the style of "Hallo Welt".
 *
 * - generateFootnote - A function that generates a footnote.
 * - GenerateFootnoteInput - The input type for the generateFootnote function.
 * - GenerateFootnoteOutput - The return type for the generateFootnote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFootnoteInputSchema = z.object({
  topic: z.string().describe('The topic for the footnote.'),
});
export type GenerateFootnoteInput = z.infer<typeof GenerateFootnoteInputSchema>;

const GenerateFootnoteOutputSchema = z.object({
  footnote: z.string().describe('The generated pseudo-scientific, satirical footnote.'),
});
export type GenerateFootnoteOutput = z.infer<typeof GenerateFootnoteOutputSchema>;

export async function generateFootnote(input: GenerateFootnoteInput): Promise<GenerateFootnoteOutput> {
  return generateFootnoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFootnotePrompt',
  input: {schema: GenerateFootnoteInputSchema},
  output: {schema: GenerateFootnoteOutputSchema},
  prompt: `Du bist ein Generator für pseudo-wissenschaftliche, satirische Fußnoten im Stil des Buches "Hallo Welt".
Deine Aufgabe ist es, zu einem gegebenen Thema eine übertrieben komplexe, absurd-komische und erfundene Fußnote zu erstellen.
Der Stil sollte trocken, belehrend und völlig überzogen sein. Antworte auf Deutsch.

Thema: {{{topic}}}

Fußnote:`,
});

const generateFootnoteFlow = ai.defineFlow(
  {
    name: 'generateFootnoteFlow',
    inputSchema: GenerateFootnoteInputSchema,
    outputSchema: GenerateFootnoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
