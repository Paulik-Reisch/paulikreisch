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
  prompt: `You are a satire testimonial generator. Create a fake testimonial about the following topic, as if it was written by the specified customer type.  The goal is to be funny and entertaining.

Topic: {{{topic}}}
Customer Type: {{{customerType}}}
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
