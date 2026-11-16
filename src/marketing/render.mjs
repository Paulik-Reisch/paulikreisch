import {customFrame} from './custom.mjs';
import {escapeHTML as e, HOSTS, MarketingError, UNSUBSCRIBE_TOKEN} from './model.mjs';
export const PUBLIC_HEADERS = {'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src https://static.paulikreisch.de data:; media-src https://static.paulikreisch.de; font-src https://static.paulikreisch.de; frame-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"};
const legal = '<a href="https://paulikreisch.de/impressum">Impressum</a> · <a href="https://paulikreisch.de/datenschutz">Datenschutz</a>';
const paragraphs = value => value.split(/\n\s*\n/).map(p=>`<p>${e(p).replace(/\n/g,'<br>')}</p>`).join('');
const css = `*{box-sizing:border-box}body{margin:0;background:#f6f3ea;color:#20251f;font:18px/1.65 system-ui,sans-serif}header,main,footer{width:min(1040px,100%);margin:auto;padding:24px}header{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;letter-spacing:.07em}header a{color:inherit;text-decoration:none}main{padding-top:60px;padding-bottom:80px}h1{font:clamp(40px,7vw,78px)/1.08 Georgia,serif;letter-spacing:-.045em;margin:12px 0 28px;max-width:900px}.eyebrow{font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:#5b6853}p{max-width:720px}.button{display:inline-block;padding:15px 24px;background:#2d493a;color:#fff;text-decoration:none;border-radius:5px;font-weight:600;margin:18px 0}.image{display:block;width:100%;max-height:560px;object-fit:contain;margin:28px 0;border-radius:12px}li{margin-bottom:12px}footer{border-top:1px solid #d6d8cb;font-size:13px;color:#5d6358}footer a{color:inherit}.preview{background:#fff2cf;border:1px solid #dcc16d;padding:12px 18px;font-size:14px;border-radius:6px;margin-bottom:35px}.ad{max-width:660px;background:white;padding:28px;border:1px solid #d6d8cb;border-radius:12px}.ad h1{font:32px/1.2 system-ui;letter-spacing:-.02em}`;
const NEWSLETTER_CSP="default-src 'none'; img-src https://static.paulikreisch.de data:; style-src 'unsafe-inline'; script-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
// Newsletter preview: no scripts at all (mail clients would strip them). The
// unsubscribe token stays visibly unresolved so nobody mistakes it for a real link.
function newsletterFrame(doc){
  const cids=[...doc.code.html.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]).filter(t=>/\ssrc\s*=\s*["']cid:/i.test(t));
  const missing=cids.filter(t=>!/\sdata-preview-src\s*=/i.test(t)).length;
  let html=doc.code.html.split(UNSUBSCRIBE_TOKEN).join('#abmeldelink-fehlt');
  // Preview asset and export asset are separate: the preview swaps cid: for the
  // data-preview-src stand-in; the export keeps cid: and drops the stand-in.
  html=html.replace(/<img\b[^>]*>/gi,t=>{const m=t.match(/\sdata-preview-src\s*=\s*"([^"]*)"/i);return m&&/\ssrc\s*=\s*["']cid:/i.test(t)?t.replace(/\ssrc\s*=\s*"cid:[^"]*"/i,` src="${m[1]}"`):t;});
  const placeholder=html.replace(/(<a[^>]*href="#abmeldelink-fehlt"[^>]*>)/gi,'$1[Abmeldelink: wird vom Versandsystem eingesetzt] ');
  const child=`<meta http-equiv="Content-Security-Policy" content="${e(NEWSLETTER_CSP)}">${placeholder}`;
  const note=cids.length?`<p class="preview" style="margin:0 0 12px">${missing?`Vorschau: ${missing} cid-Bild(er) ohne Vorschaubild, sie laden hier nicht. Im Versand muss das Bild als Anhang mitgesendet werden.`:'Vorschau nutzt ein eingebettetes Vorschaubild als Stellvertreter. Im Versand wird das cid-Bild als Anhang mitgesendet.'}</p>`:'';
  return `${note}<iframe title="Newsletter-Vorschau" sandbox="" referrerpolicy="no-referrer" srcdoc="${e(child)}" style="display:block;width:100%;height:2400px;border:0;background:white"></iframe>`;
}
export function renderPage(doc,{stepSlug=null,preview=false,previewId=null}={}) {
  const customListener = doc.mode==='custom'?'<script>(function(){window.addEventListener("message",function(ev){var f=document.querySelector(\'iframe[title="Customseite"]\');if(!f||ev.source!==f.contentWindow)return;var d=ev.data;if(!d||typeof d!=="object")return;if(d.__prCustomFrame==="height"&&typeof d.value==="number"&&isFinite(d.value)){f.style.height=Math.min(Math.max(Math.ceil(d.value),300),50000)+"px";}else if(d.__prCustomFrame==="scroll"&&typeof d.value==="number"&&isFinite(d.value)){var top=f.getBoundingClientRect().top+(window.scrollY||window.pageYOffset||0)+d.value;var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;window.scrollTo({top:top,behavior:reduce?"auto":"smooth"});}});})();</script>':'';
  let body, title;
  if(doc.mode==='custom'&&doc.kind==='newsletter'){title=doc.subject;body=newsletterFrame(doc);}
  else if(doc.mode==='custom'){title=doc.title;body=customFrame(doc,{preview});}
  else if(doc.kind==='lp') {
    const step=stepSlug?doc.steps.find(s=>s.slug===stepSlug):doc.steps[0];
    if(!step) throw new MarketingError(404,'Schritt nicht gefunden.');
    title=step.title;
    const target=step.next?(preview&&previewId?`/preview/${encodeURIComponent(previewId)}?step=${encodeURIComponent(step.next)}`:`https://${HOSTS.lp}/${doc.slug}/${step.next}`):step.ctaUrl;
    body=`<div class="eyebrow">${e(step.eyebrow)}</div><h1>${e(step.title)}</h1>${step.image?`<img class="image" src="${e(step.image)}" alt="${e(step.imageAlt)}">`:''}${paragraphs(step.body)}${step.bullets.length?`<ul>${step.bullets.map(b=>`<li>${e(b)}</li>`).join('')}</ul>`:''}${target?`<a class="button" href="${e(target)}" rel="noopener noreferrer">${e(step.ctaLabel)}</a>`:''}`;
  } else {
    title=doc.title??doc.headlines[0];
    body=`<section class="ad"><div class="eyebrow">${preview?'Anzeigenentwurf':'Anzeige'} · ${e(doc.kind)}</div><h1>${e(title)}</h1>${doc.image?`<img class="image" src="${e(doc.image)}" alt="${e(doc.imageAlt)}">`:''}${paragraphs(doc.body??doc.descriptions.join('\n\n'))}<a class="button" href="${e(doc.target)}" rel="noopener noreferrer">${e(doc.ctaLabel??'Zum Ziel')}</a></section>`;
  }
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)} | Paulik &amp; Reisch</title>${preview?'<meta name="robots" content="noindex,nofollow">':''}<style>${css}${doc.mode==='custom'?'body{background:#fff}main{width:100%;max-width:none;padding:0}main>.preview{margin:0 0 20px;border-left:0;border-right:0;border-radius:0}footer{width:100%;max-width:none}header{display:none}':''}</style></head><body><header><a href="https://paulikreisch.de">PAULIK &amp; REISCH</a><span>BÜCHER &amp; DIGITALES</span></header><main>${preview?'<div class="preview">Private Entwurfsvorschau. Nicht veröffentlicht. Externe Schaltflächen zeigen auf das konfigurierte Ziel.</div>':''}${body}</main><footer>${legal}</footer>${customListener}</body></html>`;
}
export function newsletterExport(doc) {
  if(doc.kind!=='newsletter') throw new MarketingError(400,'Kein Newsletter.');
  if(doc.mode==='custom'){
    const warnings=[];
    if(!doc.code.html.includes(UNSUBSCRIBE_TOKEN)||!doc.code.text.includes(UNSUBSCRIBE_TOKEN))warnings.push('Abmeldeplatzhalter '+UNSUBSCRIBE_TOKEN+' fehlt in HTML oder Text.');
    if(/\ssrc\s*=\s*["']data:/i.test(doc.code.html))warnings.push('Bild als data:-URI: gängige Mailclients blockieren das. Vor Versand durch cid:-Anhang oder gehostetes Bild ersetzen.');
    if(!/\d{5}\s+\p{L}/u.test(doc.code.html))warnings.push('Keine Postadresse im HTML erkennbar.');
    const exportHtml=doc.code.html.replace(/\sdata-preview-src\s*=\s*("[^"]*"|'[^']*')/gi,'');
    const cidNames=[...new Set([...exportHtml.matchAll(/src\s*=\s*["']cid:([^"']+)/gi)].map(m=>m[1]))];
    if(cidNames.length)warnings.push('cid-Bilder ('+cidNames.join(', ')+') müssen vom Versandsystem als Inline-Anhang mit passender Content-ID mitgesendet werden; ohne Anhang erscheint kein Bild.');
    return {subject:doc.subject,preheader:doc.preheader,html:exportHtml,text:doc.code.text,cidImages:cidNames,sendReady:false,warnings,requirements:['Verified sender','Consent and suppression list','Real unsubscribe URL replacing '+UNSUBSCRIBE_TOKEN+' plus List-Unsubscribe and List-Unsubscribe-Post headers','Postal address in footer','Provider/client rendering test']};
  }
  // Mail-client rendering uses inline styles and table layout, never JavaScript,
  // remote fonts, forms or tracking images. Provider-specific unsubscribe data
  // must be inserted by the sending provider before any approved send.
  const html=`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(doc.subject)}</title></head><body style="margin:0;background:#f3f1e9;color:#20251f;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${e(doc.preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff"><tr><td style="padding:32px"><p style="font-size:12px;letter-spacing:2px;color:#4c6553">PAULIK &amp; REISCH</p><h1 style="font-size:30px;line-height:1.2;margin:20px 0">${e(doc.title)}</h1>${doc.image?`<img src="${e(doc.image)}" alt="${e(doc.imageAlt)}" width="536" style="width:100%;max-width:536px;height:auto;border:0;display:block">`:''}<div style="font-size:16px;line-height:1.65">${paragraphs(doc.body)}</div><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#2d493a" style="padding:14px 22px"><a href="${e(doc.target)}" style="font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none">${e(doc.ctaLabel)}</a></td></tr></table><p style="font-size:12px;line-height:1.5;color:#656b60;margin-top:32px">${legal}<br>Vor Versand: rechtssichere Absenderdaten, Empfängereinwilligung und personalisierten Abmeldelink beim Versanddienst einsetzen. Dieser Export versendet nichts.</p></td></tr></table></td></tr></table></body></html>`;
  const plain=`${doc.title}\n\n${doc.body}\n\n${doc.ctaLabel}: ${doc.target}\n\nImpressum: https://paulikreisch.de/impressum\nDatenschutz: https://paulikreisch.de/datenschutz\n\nVOR VERSAND: Absenderdaten und personalisierten Abmeldelink einsetzen.\n`;
  return {subject:doc.subject,preheader:doc.preheader,html,text:plain,sendReady:false,requirements:['Verified sender','Consent and suppression list','Personal unsubscribe URL','Provider/client rendering test']};
}
export function adExport(doc) {
  if(doc.kind==='lp'||doc.kind==='newsletter') throw new MarketingError(400,'Kein Anzeigenformat.');
  return {format:doc.kind,document:doc,connected:false,spendEnabled:false,note:'Asset-Export, keine Kampagne und keine Ausspielung. Plattformrichtlinien und Vorschau vor Import prüfen.'};
}
