import 'server-only';
import { createChatHandler } from '@/lib/gpt-chat';

export const runtime = 'nodejs';

export const POST = createChatHandler({ apiKey: () => process.env.OPENROUTER_API_KEY });