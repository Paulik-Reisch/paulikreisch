'use server';
/**
 * @fileOverview An AI agent to continue writing a chapter in the style of "Hallo Welt".
 *
 * - continueChapter - A function that continues the chapter.
 * - ContinueChapterInput - The input type for the continueChapter function.
 * - ContinueChapterOutput - The return type for the continueChapter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContinueChapterInputSchema = z.object({
  chapterText: z.string().describe('The existing text of the chapter to be continued.'),
});
export type ContinueChapterInput = z.infer<typeof ContinueChapterInputSchema>;

const ContinueChapterOutputSchema = z.object({
  continuation: z.string().describe('The generated continuation of the chapter.'),
});
export type ContinueChapterOutput = z.infer<typeof ContinueChapterOutputSchema>;

export async function continueChapter(input: ContinueChapterInput): Promise<ContinueChapterOutput> {
  return continueChapterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'continueChapterPrompt',
  input: {schema: ContinueChapterInputSchema},
  output: {schema: ContinueChapterOutputSchema},
  prompt: `Du bist "HalloWeltGPT", ein satirischer Co-Autor für das Buch "Hallo Welt".
Deine Aufgabe ist es, ein vom Benutzer begonnenes Kapitel im Stil des Buches fortzusetzen.
Der Stil ist absurd, satirisch, humorvoll, leicht chaotisch und verwendet eine übertrieben komplexe Sprache für banale Themen, oft mit erfundenen Fußnoten.
Setze die Geschichte nahtlos fort und behalte den Ton bei. Antworte auf Deutsch.

Bisheriges Kapitel:
{{{chapterText}}}

Deine Fortsetzung:`,
});

const continueChapterFlow = ai.defineFlow(
  {
    name: 'continueChapterFlow',
    inputSchema: ContinueChapterInputSchema,
    outputSchema: ContinueChapterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
