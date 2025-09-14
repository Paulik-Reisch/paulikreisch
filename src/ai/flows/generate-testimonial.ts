'use server';
/**
 * @fileOverview A satire testimonial generator AI agent.
 *
 * - generateTestimonial - A function that handles the testimonial generation process.
 * - GenerateTestimonialInput - The input type for the generateTestimonial function.
 * - GenerateTestimonialOutput - The return type for the generateTestimonial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestimonialInputSchema = z.object({
  topic: z.string().describe('The topic for the testimonial.'),
  customerType: z.string().describe('The type of customer giving the testimonial (e.g., a professor, a dog, a celebrity).'),
});
export type GenerateTestimonialInput = z.infer<typeof GenerateTestimonialInputSchema>;

const GenerateTestimonialOutputSchema = z.object({
  testimonial: z.string().describe('The generated satire-styled fake testimonial.'),
});
export type GenerateTestimonialOutput = z.infer<typeof GenerateTestimonialOutputSchema>;

export async function generateTestimonial(input: GenerateTestimonialInput): Promise<GenerateTestimonialOutput> {
  return generateTestimonialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestimonialPrompt',
  input: {schema: GenerateTestimonialInputSchema},
  output: {schema: GenerateTestimonialOutputSchema},
  prompt: `Du bist ein Generator für satirische Testimonials für das Buch "Hallo Welt".
Das Buch "Hallo Welt" ist eine bitterböse Satire über die Absurditäten des deutschen Alltags und hat **ABSOLUT NICHTS** mit Programmierung zu tun. Ignoriere die wörtliche Bedeutung von "Hallo Welt" aus der IT.
Das Buch behandelt Themen wie:
- Das deutsche Schulsystem als "Lernvollzugsanstalt".
- Lehrer als seelenlose, kaffeesüchtige Beamtenroboter.
- Kafkaeske Bürokratie und Amtswahnsinn.
- Der tägliche Kampf mit dem Nahverkehr oder der Deutschen Bahn.
- Der Mietenwahnsinn in Großstädten.
- Die Absurdität von sozialen Normen und dem Arbeitsleben.

Der Ton ist zynisch, übertrieben, pessimistisch und voller schwarzem Humor.

Deine Aufgabe ist es, ein passendes, gefälschtes Testimonial zu erstellen, das sich auf eines dieser Themen bezieht. Es soll so klingen, als wäre es von der angegebenen "Kundenart" verfasst worden.

Thema: {{{topic}}}
Kundentyp: {{{customerType}}}
Testimonial:`,
});

const generateTestimonialFlow = ai.defineFlow(
  {
    name: 'generateTestimonialFlow',
    inputSchema: GenerateTestimonialInputSchema,
    outputSchema: GenerateTestimonialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
