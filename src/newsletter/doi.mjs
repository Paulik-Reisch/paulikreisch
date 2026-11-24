/** Must match the sentence on the /nl/confirm page word for word: that click is the consent evidence. */
export const CONSENT_VERSION='2026-11-confirm-page-v4';
export const CONSENT_TEXT='Mit einem Klick bestätigst Du, dass Du den Newsletter von Paulik & Reisch per E-Mail erhalten möchtest. Abmelden geht jederzeit.';
export function confirmUrl(base,token){return `${base.replace(/\/$/,'')}/nl/confirm?t=${encodeURIComponent(token)}`;}
const esc=(v)=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
/** Table layout with inline styles only (mail clients ignore most CSS). Colors and logo follow the site. */
export function confirmHtml({url,base='https://paulikreisch.de'}){
  const root=base.replace(/\/$/,'');const u=esc(url);
  const ink='#1d1a15',cream='#f4ece0',card='#fffaf0',yellow='#ffe14d',muted='#6b6256';
  const serif="Georgia,'Times New Roman',serif",sans="-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>Bitte bestätige Deine Newsletter-Anmeldung</title></head>
<body style="margin:0;padding:0;background:${cream};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${cream};">Ein Klick noch, dann bist Du dabei. Der Link gilt 7 Tage.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${cream}" style="background:${cream};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
<tr><td align="center" style="padding:0 0 20px;"><a href="${root}" style="text-decoration:none;"><img src="${root}/logo.png" width="72" height="72" alt="Paulik &amp; Reisch" style="display:block;border:0;width:72px;height:72px;background:${card};border-radius:14px;"></a></td></tr>
<tr><td bgcolor="${card}" style="background:${card};border:2px solid ${ink};border-radius:16px;padding:32px 28px;">
<p style="margin:0 0 10px;font:700 12px ${sans};letter-spacing:1.5px;text-transform:uppercase;color:#8a2a1a;">Paulik &amp; Reisch · Newsletter</p>
<h1 style="margin:0 0 16px;font:700 28px/1.2 ${serif};color:${ink};">Ein Klick noch.</h1>
<p style="margin:0 0 24px;font:400 16px/1.6 ${sans};color:${ink};">Hallo, schön, dass Du den Newsletter von Paulik &amp; Reisch lesen möchtest. Bitte bestätige kurz Deine Anmeldung.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td bgcolor="${yellow}" style="background:${yellow};border:2px solid ${ink};border-radius:10px;"><a href="${u}" style="display:inline-block;padding:13px 26px;font:700 16px ${sans};color:${ink};text-decoration:none;">Anmeldung bestätigen</a></td></tr></table>
<p style="margin:0 0 6px;font:400 13px/1.5 ${sans};color:${muted};">Der Button funktioniert nicht? Kopiere diesen Link in Deinen Browser:</p>
<p style="margin:0 0 24px;font:400 12px/1.5 ${sans};color:${muted};word-break:break-all;"><a href="${u}" style="color:${muted};">${u}</a></p>
<p style="margin:0;font:400 13px/1.6 ${sans};color:${muted};">Der Link gilt 7 Tage. Du bekommst ca. einmal pro Woche eine Ausgabe und kannst Dich jederzeit abmelden. Wenn Du Dich nicht angemeldet hast, ignoriere diese Mail. Dann passiert nichts.</p>
</td></tr>
<tr><td align="center" style="padding:20px 8px 0;font:400 12px/1.6 ${sans};color:${muted};">Paulik &amp; Reisch · <a href="${root}" style="color:${muted};">paulikreisch.de</a> · <a href="${root}/datenschutz" style="color:${muted};">Datenschutz</a> · <a href="${root}/impressum" style="color:${muted};">Impressum</a></td></tr>
</table></td></tr></table></body></html>`;
}
export function confirmMessage({from,replyTo,email,url}){
  const text=`Hallo,\n\nbitte bestätige Deine Anmeldung zum Newsletter von Paulik & Reisch:\n${url}\n\nDer Link gilt 7 Tage. Du bekommst ca. einmal pro Woche eine Ausgabe und kannst Dich jederzeit abmelden. Wenn Du Dich nicht angemeldet hast, ignoriere diese Mail. Dann passiert nichts.\n`;
  let base='https://paulikreisch.de';try{base=new URL(url).origin;}catch{}
  return {from,replyTo,to:[email],subject:'Bitte bestätige Deine Newsletter-Anmeldung',html:confirmHtml({url,base}),text};
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
