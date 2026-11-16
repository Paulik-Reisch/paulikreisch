import 'server-only';
// @ts-ignore plain ESM modules without type declarations
import { createNewsletterSender } from './studio-api.mjs';
// @ts-ignore
import { createResend } from './resend.mjs';
import { getNewsletterSubscribers, newsletterStoreEnabled } from './server';
import { getNewsletterReadModel } from './read-model';

/** Private read/preflight is independent from public recipient writes. Actual
 * sending still needs both the existing write store and separate send gate. */
export function createStudioNewsletter() {
  return createNewsletterSender({
    getSubscribers: getNewsletterSubscribers,
    getReadModel: getNewsletterReadModel,
    getStatus: () => ({
      storeEnabled: newsletterStoreEnabled(),
      sendEnabled: process.env.NEWSLETTER_SEND_ENABLED === '1',
      day0Enabled: process.env.NEWSLETTER_FUNNEL_DAY0 === '1',
      providerConfigured: Boolean(process.env.NEWSLETTER_RESEND_API_KEY && process.env.NEWSLETTER_FROM),
      webhookConfigured: Boolean(process.env.RESEND_WEBHOOK_SECRET),
      tokenKeysConfigured: Boolean((process.env.NEWSLETTER_TOKEN_SECRET?.length ?? 0) >= 32 && (process.env.NEWSLETTER_ID_KEY?.length ?? 0) >= 32),
    }),
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
