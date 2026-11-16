import 'server-only';
import type {Bucket} from '@google-cloud/storage';
// @ts-ignore plain ESM
import {createTransportTest, TRANSPORT_PROBE} from './transport-test.mjs';
// @ts-ignore plain ESM
import {createResend} from './resend.mjs';

/** Uses the already protected private bucket namespace, never public Firestore. */
export function createStudioTransportTest(bucket: Bucket) {
  return createTransportTest({
    enabled: process.env.NEWSLETTER_TRANSPORT_TEST_ENABLED === '1',
    configured: Boolean(process.env.NEWSLETTER_RESEND_API_KEY && process.env.NEWSLETTER_FROM === TRANSPORT_PROBE.from && process.env.NEWSLETTER_REPLY_TO === TRANSPORT_PROBE.replyTo),
    getProvider: () => createResend({apiKey: process.env.NEWSLETTER_RESEND_API_KEY || ''}),
    async claim(id: string) {
      try {
        await bucket.file('managed-private-v1/newsletter-control/'+id+'.json').save(JSON.stringify({state:'claimed',at:new Date().toISOString()}),{
          resumable:false,predefinedAcl:'private',validation:'crc32c',preconditionOpts:{ifGenerationMatch:0},
          metadata:{contentType:'application/json',cacheControl:'private, no-store'},
        });
        return true;
      } catch (error) {
        if ((error as {code?:number}).code === 412) return false;
        throw error;
      }
    },
  });
}
