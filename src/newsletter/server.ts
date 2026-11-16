import 'server-only';
import { getAdminDb } from '@/lib/firebase-admin';
// @ts-ignore plain ESM modules without type declarations
import { NewsletterSubscribers } from './subscribers.mjs';
// @ts-ignore
import { FirestoreSubscriberStore } from './firestore-store.mjs';
// @ts-ignore plain ESM token verifier
import { tokenId, checkToken } from './tokens.mjs';

/** Server secret for opaque tokens. Set as an App Hosting secret; never in the repo. */
export function newsletterSecret(): string {
  const s = process.env.NEWSLETTER_TOKEN_SECRET || '';
  if (s.length < 32) throw new Error('NEWSLETTER_TOKEN_SECRET missing');
  return s;
}

/** Public registration and ordinary recipient writes remain separately gated. */
export function newsletterStoreEnabled(): boolean {
  return process.env.NEWSLETTER_STORE_ENABLED === '1';
}

function buildNewsletterSubscribers() {
  const idKey = process.env.NEWSLETTER_ID_KEY || '';
  if (idKey.length < 32) throw new Error('NEWSLETTER_ID_KEY missing');
  const previousSecrets = (process.env.NEWSLETTER_TOKEN_SECRET_PREVIOUS || '').split(',').map((x) => x.trim()).filter((x) => x.length >= 32);
  return new NewsletterSubscribers(new FirestoreSubscriberStore(getAdminDb()), { secret: newsletterSecret(), previousSecrets, idKey });
}

export function getNewsletterSubscribers() {
  if (!newsletterStoreEnabled()) throw new Error('newsletter store disabled');
  return buildNewsletterSubscribers();
}

/** Only removal of an existing recipient with a valid signed token. It cannot
 * subscribe, confirm, list, or create a provider request. Off by default. */
export function getNewsletterUnsubscriber() {
  if (process.env.NEWSLETTER_UNSUBSCRIBE_ENABLED !== '1') throw new Error('newsletter unsubscribe disabled');
  return Object.freeze({
    async unsubscribe(token: string) {
      const id = tokenId(token);
      if (!id) return { ok: false };
      const previous = (process.env.NEWSLETTER_TOKEN_SECRET_PREVIOUS || '').split(',').map(x => x.trim()).filter(x => x.length >= 32);
      if (![newsletterSecret(), ...previous].some(secret => checkToken(secret, 'unsubscribe', token, id))) return { ok: false };
      return buildNewsletterSubscribers().unsubscribe(token);
    },
  });
}
