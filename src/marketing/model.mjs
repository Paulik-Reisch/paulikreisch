import { isIP } from 'node:net';
export class MarketingError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const invalid = message => { throw new MarketingError(400, message); };
export const HOSTS = Object.freeze({manager:'m.paulikreisch.de', lp:'lp.paulikreisch.de', ads:'ads.paulikreisch.de'});
export function text(value, max, label, optional = false) {
  if (optional && (value == null || value === '')) return '';
  if (typeof value !== 'string') invalid(`${label}: Text erforderlich.`);
  const clean = value.trim().replace(/\r\n?/g, '\n');
  if (!clean || [...clean].length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(clean)) invalid(`${label}: maximal ${max} Zeichen.`);
  return clean;
}
export function slug(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]{0,58}[a-z0-9]$|^[a-z0-9]$/.test(value) || ['api','manage','login','logout','preview','assets','export'].includes(value)) invalid('Ungültiger URL-Name.');
  return value;
}
export function https(value) {
  if (typeof value !== 'string' || value.length > 2048 || /[\x00-\x20\x7f]/.test(value)) invalid('HTTPS-Ziel erforderlich.');
  let u; try { u = new URL(value); } catch { invalid('HTTPS-Ziel erforderlich.'); }
  if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443') || !u.hostname.includes('.') || isIP(u.hostname.replace(/^\[|\]$/g,'')) || u.hostname.endsWith('.local') || u.hostname.endsWith('.localhost')) invalid('Öffentliches HTTPS-Ziel ohne Zugangsdaten erforderlich.');
  return u.href;
}
export function image(value) {
  if (!value) return '';
  const u = new URL(https(value));
  if (u.hostname !== 'static.paulikreisch.de' || !/^\/f\/[a-f0-9-]{36}$/.test(u.pathname) || u.search || u.hash) invalid('Bild: freigegebene Datei von static.paulikreisch.de erforderlich.');
  return u.href;
}

// Security note: the checks below are a lint for honest mail HTML, NOT an HTML sanitizer
// and not the security boundary. The boundary is the sandbox="" iframe plus a CSP with
// script-src 'none' used for every preview, and the fact that the studio never sends mail.
// Custom newsletter: mail-client HTML (tables, inline styles) plus plaintext.
// Never executable: mail clients strip scripts, so the studio refuses them
// instead of pretending they would run. Mails reference only https links,
// mailto links and the unsubscribe placeholder that a sender must replace.
export const UNSUBSCRIBE_TOKEN = '{{abmeldelink}}';
/** Link to the public browser view. The sender fills it in; it points to the published snapshot of this newsletter. */
export const WEB_VIEW_TOKEN = '{{webansicht}}';
export const NEWSLETTER_WEB_BASE = 'https://paulikreisch.de/nl/view/';
function validateNewsletterCode(input, base) {
  if (!input.code || typeof input.code !== 'object') invalid('Code erforderlich.');
  if (input.code.js) invalid('Newsletter: JavaScript wird von Mailclients entfernt und ist nicht erlaubt.');
  base.mode = 'custom';
  base.subject = text(input.subject, 200, 'Betreff');
  base.preheader = text(input.preheader, 200, 'Vorschautext', true);
  const html = text(input.code.html, 100000, 'HTML');
  const plain = text(input.code.text ?? input.code.css, 30000, 'Plaintext');
  if (/<\s*(script|iframe|object|embed|form|input|button|textarea|select|link|base|style[^>]*\bsrc)\b/i.test(html) || /<\s*meta[^>]+http-equiv/i.test(html)) invalid('Newsletter-HTML: Skripte, Formulare, eingebettete Frames und Fremd-Ressourcen sind nicht erlaubt.');
  if (/\son[a-z]+\s*=/i.test(html) || /javascript:|vbscript:/i.test(html) || /@import|expression\s*\(/i.test(html)) invalid('Newsletter-HTML: Eventhandler, javascript-Links und @import sind nicht erlaubt.');
  // data-preview-src is a preview-only stand-in for a cid: image. The export strips it.
  for (const m of html.matchAll(/\sdata-preview-src\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const v = (m[2] ?? m[3]).trim();
    if (v.length > 80000 || !/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v)) invalid('Newsletter-Vorschaubild: data:-Bild (png/jpeg/webp/gif, base64) bis ca. 60 KB erlaubt.');
  }
  for (const m of html.matchAll(/\s(?:href|src)\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const v = (m[2] ?? m[3]).trim();
    if (v === UNSUBSCRIBE_TOKEN || v === WEB_VIEW_TOKEN || /^mailto:[^\s]+$/i.test(v) || /^cid:[A-Za-z0-9._-]{1,80}$/.test(v) || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v)) continue;
    if (/^https:\/\//i.test(v)) { const clean=v.replace(/&amp;/g, '&'); if (/^\s*src/i.test(m[0])) image(clean); else https(clean); continue; }
    invalid('Newsletter-HTML: nur https-, mailto-, cid- und data-Bildlinks erlaubt.');
  }
  if (/url\(\s*['"]?\s*(?!data:)[a-z]+:/i.test(html)) invalid('Newsletter-HTML: CSS-url() mit Fremdadresse ist nicht erlaubt.');
  base.code = {html, css: '', js: '', text: plain};
  base.files = [];
  return base;
}
const array = (value, max, label) => { if (!Array.isArray(value) || value.length > max) invalid(`${label}: maximal ${max} Einträge.`); return value; };
export function validateDocument(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid('Dokument erforderlich.');
  if (!['lp','google','meta','other','newsletter'].includes(input.kind)) invalid('Unbekanntes Format.');
  const base = {kind:input.kind, slug:slug(input.slug), name:text(input.name,120,'Interner Name'), campaign:text(input.campaign,120,'Kampagne',true)};
  if (input.mode === 'custom') {
    if (input.kind === 'newsletter') return validateNewsletterCode(input, base);
    base.mode='custom'; base.title=text(input.title||input.name,200,'Seitentitel');
    if (!input.code || typeof input.code !== 'object') invalid('Code erforderlich.');
    base.code={html:text(input.code.html,100000,'HTML'),css:text(input.code.css,100000,'CSS',true),js:text(input.code.js,100000,'JavaScript',true)};
    const paths=new Set();base.files=array(input.files??[],100,'Dateipfade').map(file=>{const path=assetPath(file.path);if(paths.has(path))invalid('Virtueller Pfad doppelt.');paths.add(path);return {path,target:image(file.target)};});
    if(base.files.some(file=>!file.target))invalid('Static-Dateilink fehlt.');
    return base;
  }
  base.mode='structured';
  if (input.kind === 'lp') {
    const steps = array(input.steps,12,'Funnel-Schritte');
    if (!steps.length) invalid('Mindestens ein Funnel-Schritt erforderlich.');
    const seen = new Set();
    base.steps = steps.map(step => {
      const key = slug(step.slug); if (seen.has(key)) invalid('Doppelter Schritt.'); seen.add(key);
      return {slug:key, title:text(step.title,160,'Überschrift'), eyebrow:text(step.eyebrow,80,'Dachzeile',true), body:text(step.body,16000,'Seiteninhalt'), image:image(step.image), imageAlt:text(step.imageAlt,200,'Bildbeschreibung',true), ctaLabel:text(step.ctaLabel,80,'Button',true), ctaUrl:step.ctaUrl ? https(step.ctaUrl) : '', next:step.next ? slug(step.next) : '', bullets:array(step.bullets ?? [],8,'Vorteile').map(item=>text(item,240,'Vorteil'))};
    });
    for (const step of base.steps) {
      if (step.next && !seen.has(step.next)) invalid('Funnel-Ziel existiert nicht.');
      if (step.next && step.ctaUrl) invalid('Button braucht entweder einen Funnel-Schritt oder ein externes Ziel.');
      if (!!step.ctaLabel !== !!(step.next || step.ctaUrl)) invalid('Button-Beschriftung und Ziel gemeinsam ausfüllen.');
      if (step.image && !step.imageAlt) invalid('Bildbeschreibung erforderlich.');
    }
    // Cycles are almost always accidental and make the sales flow unusable.
    for (const step of base.steps) { const visited=new Set(); let current=step; while(current?.next) { if(visited.has(current.slug)) invalid('Funnel darf keinen Kreis enthalten.'); visited.add(current.slug); current=base.steps.find(s=>s.slug===current.next); } }
  } else if (input.kind === 'google') {
    base.target=https(input.target); base.headlines=array(input.headlines,15,'Überschriften').map(v=>text(v,30,'Überschrift')); base.descriptions=array(input.descriptions,4,'Beschreibungen').map(v=>text(v,90,'Beschreibung'));
    if(base.headlines.length<3 || base.descriptions.length<2) invalid('Suchanzeigen brauchen mindestens drei Überschriften und zwei Beschreibungen.');
  } else {
    base.title=text(input.title, input.kind==='meta'?40:200,'Titel'); base.body=text(input.body,input.kind==='newsletter'?30000:5000,'Inhalt'); base.target=https(input.target); base.ctaLabel=text(input.ctaLabel,80,'Button'); base.image=image(input.image); base.imageAlt=text(input.imageAlt,200,'Bildbeschreibung',true);
    if(base.image && !base.imageAlt) invalid('Bildbeschreibung erforderlich.');
    if(input.kind==='newsletter') { base.subject=text(input.subject,200,'Betreff'); base.preheader=text(input.preheader,200,'Vorschautext',true); }
  }
  return base;
}
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function publicationCheck(doc) {
  validateDocument(doc);
  if (doc.kind === 'newsletter') {
    if (doc.mode !== 'custom') throw new MarketingError(409, 'Nur Newsletter mit eigenem HTML haben eine Browseransicht.');
    // The public view cannot load cid: attachments. A stand-in image is needed for each one.
    const missing = [...doc.code.html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]).filter(t => /\ssrc\s*=\s*["']cid:/i.test(t) && !/\sdata-preview-src\s*=/i.test(t));
    if (missing.length) throw new MarketingError(409, 'Browseransicht: cid-Bild ohne Vorschaubild kann nicht veröffentlicht werden.');
  }

}

export const surface = kind => kind === 'lp' ? 'lp' : kind === 'newsletter' ? 'newsletter' : 'ads';

export function assetPath(value){if(typeof value!=='string'||value.length>180||!/^\/[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(value)||value.includes('//')||value.split('/').some(p=>p==='.'||p==='..')||value.endsWith('/'))invalid('Virtueller Pfad ungültig. Beispiel: /bilder/cover.jpg');return value;}
