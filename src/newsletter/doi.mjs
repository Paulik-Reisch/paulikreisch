/** Must match the sentence on the /nl/confirm page word for word: that click is the consent evidence. */
export const CONSENT_VERSION='2026-11-confirm-page-v1';
export const CONSENT_TEXT='Mit einem Klick bestätigst du, dass du den Newsletter von Paulik & Reisch per E-Mail erhalten möchtest. Abmelden geht jederzeit.';
export function confirmUrl(base,token){return `${base.replace(/\/$/,'')}/nl/confirm?t=${encodeURIComponent(token)}`;}
export function confirmMessage({from,replyTo,email,url}){
  const text=`Hallo,\n\nbitte bestätige deine Anmeldung zum Newsletter von Paulik & Reisch:\n${url}\n\nDer Link gilt 7 Tage. Wenn du dich nicht angemeldet hast, ignoriere diese Mail. Dann passiert nichts.\n`;
  const html=`<p>Hallo,</p><p>bitte bestätige deine Anmeldung zum Newsletter von Paulik &amp; Reisch:</p><p><a href="${url}">Anmeldung bestätigen</a></p><p>Der Link gilt 7 Tage. Wenn du dich nicht angemeldet hast, ignoriere diese Mail. Dann passiert nichts.</p>`;
  return {from,replyTo,to:[email],subject:'Bitte bestätige deine Newsletter-Anmeldung',html,text};
}
/** Same outward answer for every outcome so addresses cannot be probed.
 * `hp` is a honeypot field; filled means silently ignored. */
export async function requestSubscription({subscribers,resend,from,replyTo,baseUrl,email,hp,source='website'}){
  if(hp)return {ok:true};
  const r=await subscribers.subscribe(email,{source,consentText:CONSENT_TEXT,consentVersion:CONSENT_VERSION});
  if(!r.ok)return {ok:false};
  if(r.confirmToken&&r.email){
    await resend.send(confirmMessage({from,replyTo,email:r.email,url:confirmUrl(baseUrl,r.confirmToken)}),{idempotencyKey:`doi:${r.confirmToken.slice(0,60)}`});
  }
  return {ok:true};
}
