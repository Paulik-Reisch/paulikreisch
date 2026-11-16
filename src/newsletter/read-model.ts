import 'server-only';
import { getAdminDb } from '@/lib/firebase-admin';
// @ts-ignore plain ESM projection
import { summarizeNewsletterRecipients } from './read-model.mjs';

/** Private, read-only capability used only after studio authentication. No
 * subscription/update methods and no personal-link signing. */
export function getNewsletterReadModel() {
  return Object.freeze({
    async snapshot() {
      const snapshot = await getAdminDb().collection('newsletter_recipients').get();
      return summarizeNewsletterRecipients(snapshot.docs.map(doc => doc.data()));
    },
  });
}
