import {createHmac,timingSafeEqual} from 'node:crypto';
/** Resend webhooks are signed with Svix. Verification follows the Svix manual
 * procedure (https://docs.svix.com/receiving/verifying-payloads/how-manual) and
 * Resend's note to use the RAW request body (https://resend.com/docs/webhooks/verify-webhooks-requests):
 * signed content `${svix-id}.${svix-timestamp}.${rawBody}`, HMAC-SHA256 with the
 * base64 part of the `whsec_` secret, compared in constant time against every
 * `v1,<base64>` entry of the space separated svix-signature header. The
 * timestamp must be within the tolerance, which limits replay; applying a
 * suppression twice is harmless, which covers Resend's own retries. */
export const TOLERANCE_S=300;
export class WebhookRefused extends Error{}
export function verifyWebhook({secret,rawBody,headers,nowMs=Date.now()}){
  if(typeof secret!=='string'||!secret.startsWith('whsec_'))throw new WebhookRefused('secret');
  const id=headers['svix-id'],ts=headers['svix-timestamp'],sig=headers['svix-signature'];
  if(!id||!ts||!sig||typeof rawBody!=='string')throw new WebhookRefused('headers');
  const t=Number(ts);
  if(!Number.isInteger(t)||Math.abs(nowMs/1000-t)>TOLERANCE_S)throw new WebhookRefused('timestamp');
  const key=Buffer.from(secret.slice(6),'base64');
  const expected=createHmac('sha256',key).update(`${id}.${ts}.${rawBody}`).digest();
  for(const part of sig.split(' ')){
    const [v,b64]=part.split(',');
    if(v!=='v1'||!b64)continue;
    const got=Buffer.from(b64,'base64');
    if(got.length===expected.length&&timingSafeEqual(got,expected))return JSON.parse(rawBody);
  }
  throw new WebhookRefused('signature');
}
/** Maps a verified event to suppressions. Only permanent bounces, spam
 * complaints and provider-side suppressions stop mail. Temporary issues do not. */
export function suppressionsFor(event){
  const d=event?.data;if(!d||!Array.isArray(d.to))return [];
  let reason=null;
  if(event.type==='email.bounced'&&d.bounce?.type==='Permanent')reason='bounce';
  else if(event.type==='email.complained')reason='complaint';
  else if(event.type==='email.suppressed')reason='provider-suppressed';
  return reason?d.to.filter(x=>typeof x==='string').map(email=>({email,reason})):[];
}
/** @param {{subscribers:any,secret:string,rawBody:string,headers:Record<string,string>,nowMs?:number}} p */
export async function handleWebhook({subscribers,secret,rawBody,headers,nowMs}){
  const event=verifyWebhook({secret,rawBody,headers,nowMs});
  const list=suppressionsFor(event);
  for(const x of list)await subscribers.suppress(x.email,x.reason);
  return {handled:list.length,type:event.type};
}
