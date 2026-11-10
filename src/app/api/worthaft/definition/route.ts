import 'server-only';
import { createDefinitionHandler } from '@/lib/worthaft-definition';
import { getWorthaftDailyData } from '@/lib/worthaft-daily-data';
import { getWorthaftDateString } from '@/lib/worthaft-daily-word';

export const runtime = 'nodejs';

// Load the allowed words the same way the Worthaft page does: via the cached
// Firestore REST read with the bundled lists as fallback. The client Firebase
// SDK path used before fails in the App Hosting server runtime, which made
// every definition request fail with a generic 503.
export const POST = createDefinitionHandler({
  apiKey: () => process.env.OPENROUTER_API_KEY,
  loadAllowedWords: async () => {
    const { words } = await getWorthaftDailyData(getWorthaftDateString());
    return words;
  },
});
