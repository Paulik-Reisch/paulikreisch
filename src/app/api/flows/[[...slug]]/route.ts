'use server';
// KEIN 'use server' - das ist für Server Actions, nicht für API Routes!
import { nextApiRoute } from '@genkit-ai/next';
import { ai } from '@/ai/genkit';

// Flows importieren (werden bei Build & Runtime automatisch registriert)
import '@/ai/flows/continue-chapter-flow';
import '@/ai/flows/correct-html-flow';
import '@/ai/flows/generate-bureaucracy-flow';
import '@/ai/flows/generate-db-excuse-flow';
import '@/ai/flows/generate-footnote-flow';
import '@/ai/flows/generate-report-card-flow';
import '@/ai/flows/generate-satire-type-flow';
import '@/ai/flows/generate-testimonial';
import '@/ai/flows/pfeifer-translate-flow';

// Korrekte Export-Syntax für Next.js App Router
export const { GET, POST } = nextApiRoute({ ai });
