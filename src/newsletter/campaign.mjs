import {createHash} from 'node:crypto';
/** Send preparation and the accidental-send guard. Nothing in this file sends
 * on import or on preview. A real send needs: the feature flag, a preview digest
 * that still matches the current content and recipient set, the typed phrase,
 * and a recipient count within the daily cap. */
export const PLACEHOLDER='{{abmeldelink}}';
export class SendRefused extends Error {constructor(message){super(message);this.status=409;}}
const sha=value=>createHash('sha256').update(value).digest('hex');
export function unsubscribeUrl(base,token){return `${base.replace(/\/$/,'')}/nl/unsubscribe?t=${encodeURIComponent(token)}`;}
export function personalize({html,text},url){
  if(!html.includes(PLACEHOLDER)||!text.includes(PLACEHOLDER))throw new SendRefused('HTML und Plaintext brauchen den Abmeldelink-Platzhalter.');
  const out={html:html.replaceAll(PLACEHOLDER,url),text:text.replaceAll(PLACEHOLDER,url)};
  if(/\{\{[^}]*\}\}/.test(out.html+out.text))throw new SendRefused('Unbekannte Platzhalter im Inhalt.');
  if(/cid:/i.test(out.html))throw new SendRefused('cid-Bilder werden nicht mitgesendet.');
  return out;
}
export function listHeaders(url){return {'List-Unsubscribe':`<${url}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'};}
export function buildMessage({from,replyTo,subject,content,recipient,baseUrl}){
  const url=unsubscribeUrl(baseUrl,recipient.unsubscribeToken),body=personalize(content,url);
  return {from,replyTo,to:[recipient.email],subject,html:body.html,text:body.text,headers:listHeaders(url)};
}
/** Digest binds an approval to this exact content, sender and recipient set. */
export function previewDigest({from,replyTo,subject,content,recipients}){
  return sha(JSON.stringify({from,replyTo:replyTo??null,subject,html:content.html,text:content.text,ids:recipients.map(r=>r.id).sort()}));
}
export function previewSend({from,replyTo,subject,content,recipients,dailyLimit}){
  const digest=previewDigest({from,replyTo,subject,content,recipients});
  const count=recipients.length;
  return {digest,count,dailyLimit,overDailyLimit:count>dailyLimit,phrase:`SENDEN ${count}`,from,replyTo:replyTo??null,subject,sample:count?buildMessage({from,replyTo,subject,content,recipient:{...recipients[0],email:'beispiel@example.invalid'},baseUrl:'https://paulikreisch.de'}).headers:null};
}
/** sleep is injectable for pacing and tests. */
export async function sendCampaign({enabled,confirmation,from,replyTo,subject,content,recipients,dailyLimit,resend,baseUrl,campaignId,sleep=ms=>new Promise(r=>setTimeout(r,ms)),paceMs=600}){
  if(!enabled)throw new SendRefused('Versand ist nicht freigeschaltet.');
  if(!recipients.length)throw new SendRefused('Keine bestätigten Empfänger.');
  if(recipients.length>dailyLimit)throw new SendRefused(`Mehr Empfänger (${recipients.length}) als Tageslimit (${dailyLimit}).`);
  const preview=previewSend({from,replyTo,subject,content,recipients,dailyLimit});
  if(confirmation?.digest!==preview.digest)throw new SendRefused('Vorschau ist veraltet. Bitte neu prüfen.');
  if(confirmation?.phrase!==preview.phrase)throw new SendRefused('Bestätigungsphrase stimmt nicht.');
  if(!/^[A-Za-z0-9_-]{4,64}$/.test(campaignId))throw new SendRefused('Ungültige Kampagnen-ID.');
  // Build every message first so a content error aborts before the first send.
  const messages=recipients.map(recipient=>({recipient,message:buildMessage({from,replyTo,subject,content,recipient,baseUrl})}));
  const results=[];
  for(const [index,{recipient,message}] of messages.entries()){
    if(index)await sleep(paceMs);
    try{const {id}=await resend.send(message,{idempotencyKey:`${campaignId}:${recipient.id}`});results.push({id:recipient.id,ok:true,providerId:id});}
    catch(error){results.push({id:recipient.id,ok:false,status:error.status??0});if(error.status===429||error.status===401||error.status===403)break;}
  }
  return {sent:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).length,notAttempted:recipients.length-results.length,results};
}
