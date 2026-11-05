import 'server-only';
import { initializeFirebase } from '@/firebase';
import { createDefinitionHandler } from '@/lib/worthaft-definition';
import { loadWorthaftWordLists } from '@/lib/worthaft-word-lists';

export const runtime = 'nodejs';

export const POST = createDefinitionHandler({
  apiKey: () => process.env.OPENROUTER_API_KEY,
  loadAllowedWords: async () => {
    try {
      const { firestore } = initializeFirebase();
      const { words } = await loadWorthaftWordLists(firestore);
      return words;
    } catch (error) {
      console.error('Failed to load the Worthaft word list for definitions.', error);
      throw error;
    }
  },
});
