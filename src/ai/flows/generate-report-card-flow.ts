'use server';
/**
 * @fileOverview An AI agent to generate a satirical school report card.
 *
 * - generateReportCard - A function that handles the report card generation.
 * - GenerateReportCardInput - The input type for the generateReportCard function.
 * - GenerateReportCardOutput - The return type for the generateReportCard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportCardInputSchema = z.object({
  studentName: z.string().describe("The name of the student for the report card."),
});
export type GenerateReportCardInput = z.infer<typeof GenerateReportCardInputSchema>;

const SubjectGradeSchema = z.object({
    subject: z.string().describe("The name of the absurd school subject."),
    grade: z.string().describe("The grade for the subject, can be a number (1-6, with + or -) or a word like 'Exzellent' or 'Genickbruch'."),
    comment: z.string().describe("A short, satirical comment from the teacher about the student's performance in this subject."),
});

const GenerateReportCardOutputSchema = z.object({
    schoolName: z.string().describe('The name of the satirical school, e.g., "Staatliche Anstalt für angewandten Wahnsinn" or "Lernvollzugsanstalt Hallo Welt".'),
    studentName: z.string().describe("The name of the student."),
    class: z.string().describe("The student's class, e.g., 'Klasse 13 3/4' or 'Experimentalkurs 42'"),
    grades: z.array(SubjectGradeSchema).describe("An array of at least 6 subject grades."),
    finalComment: z.string().describe("A final, satirical comment or verdict from the headmaster on the student's overall performance and future prospects."),
    teacherSignature: z.string().describe("A funny/satirical name for the teacher/headmaster signing the report."),
});
export type GenerateReportCardOutput = z.infer<typeof GenerateReportCardOutputSchema>;


export async function generateReportCard(input: GenerateReportCardInput): Promise<GenerateReportCardOutput> {
  return generateReportCardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportCardPrompt',
  input: {schema: GenerateReportCardInputSchema},
  output: {schema: GenerateReportCardOutputSchema},
  prompt: `Du bist ein KI-Generator für satirische Schulzeugnisse im Stil des Buches "Hallo Welt". Deine Aufgabe ist es, für den Schüler {{{studentName}}} ein komplettes, überzogenes und humorvolles Zeugnis zu erstellen.

Denke dir einen absurden Schulnamen, eine kreative Klasse und mindestens 6 passende, lustige Fächer mit Noten und kurzen, bissigen Kommentaren aus. Die Noten können Zahlen (1-6, auch mit + oder -) oder beschreibende Worte sein (z.B. "Exzellent", "Katastrophal", "Genickbruch").

Beispiele für Fächer:
- Pausenbrot-Management
- Angewandte Apathie
- Professionelles Stuhlschaukeln
- Soziale Inkompetenz (Fortgeschritten)
- Praktische Prokrastination
- Ignoranz gegenüber Lehrkörpern

Schreibe am Ende einen längeren, finalen Kommentar aus der Sicht des Direktors, der die "Leistung" des Schülers zusammenfasst und eine düstere oder absurde Zukunftsprognose gibt.
Erfinde einen lustigen Namen für den unterzeichnenden Lehrer oder Direktor.
Der Ton muss durchgehend satirisch, trocken und im Stil von "Hallo Welt" sein. Antworte auf Deutsch.

Schüler: {{{studentName}}}
`,
});

const generateReportCardFlow = ai.defineFlow(
  {
    name: 'generateReportCardFlow',
    inputSchema: GenerateReportCardInputSchema,
    outputSchema: GenerateReportCardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
