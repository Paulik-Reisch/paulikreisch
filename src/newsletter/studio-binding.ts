import 'server-only';
// @ts-ignore plain ESM modules without type declarations
import { createNewsletterSender } from './studio-api.mjs';
// @ts-ignore
import { createResend } from './resend.mjs';
import { getNewsletterSubscribers, newsletterStoreEnabled } from './server';

/** Studio send panel wiring. Preview and send both read the recipient store, so
 * they fail closed (503 in the studio) until NEWSLETTER_STORE_ENABLED=1.
 * Actual sending additionally needs NEWSLETTER_SEND_ENABLED=1, which is a
 * separate, deliberate switch. */
export function createStudioNewsletter() {
  if (!newsletterStoreEnabled()) return undefined;
  return createNewsletterSender({
    getSubscribers: getNewsletterSubscribers,
    getResend: () => {
      const apiKey = process.env.NEWSLETTER_RESEND_API_KEY || '';
      if (!apiKey) throw new Error('NEWSLETTER_RESEND_API_KEY missing');
      return createResend({ apiKey });
    },
    from: process.env.NEWSLETTER_FROM || '',
    replyTo: process.env.NEWSLETTER_REPLY_TO || undefined,
    baseUrl: process.env.NEWSLETTER_BASE_URL || 'https://paulikreisch.de',
    dailyLimit: Number(process.env.NEWSLETTER_DAILY_LIMIT) || 100,
    enabled: process.env.NEWSLETTER_SEND_ENABLED === '1',
  });
}
