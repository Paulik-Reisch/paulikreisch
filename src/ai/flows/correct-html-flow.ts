
'use server';
/**
 * @fileOverview An AI agent to correct HTML code.
 *
 * - correctHtml - A function that corrects HTML code.
 * - CorrectHtmlInput - The input type for the correctHtml function.
 * - CorrectHtmlOutput - The return type for the correctHtml function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrectHtmlInputSchema = z.object({
  html: z.string().describe('The HTML code to be corrected.'),
});
export type CorrectHtmlInput = z.infer<typeof CorrectHtmlInputSchema>;

const CorrectHtmlOutputSchema = z.object({
  correctedHtml: z.string().describe('The corrected HTML code.'),
});
export type CorrectHtmlOutput = z.infer<typeof CorrectHtmlOutputSchema>;

export async function correctHtml(input: CorrectHtmlInput): Promise<CorrectHtmlOutput> {
  return correctHtmlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctHtmlPrompt',
  input: {schema: CorrectHtmlInputSchema},
  output: {schema: CorrectHtmlOutputSchema},
  prompt: `You are an expert web developer specializing in clean, semantic HTML.
Your task is to correct the user-provided HTML code snippet.

**CRITICAL INSTRUCTIONS:**
1.  **DO NOT CHANGE THE TEXT CONTENT.** The visible text, such as headings, paragraphs, and link text, must remain exactly as provided.
2.  **ONLY FIX THE CODE.** Correct HTML syntax, fix broken tags, ensure proper nesting, and improve the structure.
3.  **DO NOT ADD ANY CSS.** Do not add any <style> tags, inline style attributes, or any CSS classes. The styling is handled by a global stylesheet.
4.  **OUTPUT ONLY HTML.** Ensure the output is clean HTML.

The goal is to perform quality management on the code for users who are not developers. Make it valid and well-structured, but keep the content untouched.

User's HTML code:
\'\'\'html
{{{html}}}
\'\'\'`,
});

const correctHtmlFlow = ai.defineFlow(
  {
    name: 'correctHtmlFlow',
    inputSchema: CorrectHtmlInputSchema,
    outputSchema: CorrectHtmlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
