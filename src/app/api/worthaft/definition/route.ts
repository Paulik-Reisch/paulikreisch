import 'server-only';
import { createDefinitionHandler } from '@/lib/worthaft-definition';

export const runtime = 'nodejs';

export const POST = createDefinitionHandler({ apiKey: () => process.env.OPENROUTER_API_KEY });
