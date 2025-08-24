'use server';
/**
 * @fileOverview An AI agent to generate satirical DB excuses.
 *
 * - generateDbExcuse - A function that handles the excuse generation.
 * - GenerateDbExcuseOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDbExcuseOutputSchema = z.object({
    part1: z.string().describe('Der erste Teil der Ausrede. Z.B. "Unerwartete Störung"'),
    part2: z.string().describe('Der zweite, absurde Teil der Ausrede. Z.B. "im Kaffebecher des Lokführers"'),
    part3: z.string().describe('Der dritte Teil, der den Ort oder die absurde Konsequenz beschreibt. Z.B. "führt zu einer alternativen Zeitwahrnehmung."'),
});
export type GenerateDbExcuseOutput = z.infer<typeof GenerateDbExcuseOutputSchema>;


export async function generateDbExcuse(): Promise<GenerateDbExcuseOutput> {
  return generateDbExcuseFlow();
}

const prompt = ai.definePrompt({
  name: 'generateDbExcusePrompt',
  output: {schema: GenerateDbExcuseOutputSchema},
  prompt: `Du bist ein KI-Generator für satirische und absurde Ausreden für die Deutsche Bahn im Stil des Buches "Hallo Welt".
Deine Aufgabe ist es, eine möglichst kreative, lustige und überzogene Ausrede für eine Zugverspätung zu generieren. Die Ausrede soll aus drei Teilen bestehen, die später wie bei einer Slot-Machine kombiniert werden können.

Beispiele für Teile:
Part 1: "Technische Störung", "Signalstörung", "Plötzliche Umkehrung", "Unerwartetes Auftauchen"
Part 2: "der Realität", "im Bordbistro", "am Gleis 9 3/4", "der Schwerkraft", "des Zeit-Raum-Kontinuums"
Part 3: "erfordert eine Neukalibrierung des Zuges.", "verzögert die Ankunft auf unbestimmte Zeit.", "macht eine Weiterfahrt unmöglich.", "führt zu spontaner Vegetation auf den Schienen."

Generiere eine neue, einzigartige Kombination im gleichen Stil. Antworte auf Deutsch.
`,
});

const generateDbExcuseFlow = ai.defineFlow(
  {
    name: 'generateDbExcuseFlow',
    outputSchema: GenerateDbExcuseOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
