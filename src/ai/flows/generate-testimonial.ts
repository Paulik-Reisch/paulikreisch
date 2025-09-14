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
Das Buch "Hallo Welt" ist eine bitterböse Satire und KEIN Programmierbuch. Es behandelt Themen wie das deutsche Schulsystem, Lehrer als Beamtenroboter, Bürokratie, den Mietenwahnsinn und andere Absurditäten des Alltags in Deutschland. Der Ton ist zynisch, übertrieben und humorvoll.

Deine Aufgabe ist es, ein passendes, gefälschtes Testimonial zum folgenden Thema zu erstellen, als ob es vom angegebenen Kundentyp geschrieben worden wäre. Das Ziel ist es, lustig und unterhaltsam zu sein und den Stil des Buches zu treffen. Antworte auf Deutsch.

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
