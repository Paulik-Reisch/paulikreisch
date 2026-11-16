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
const array = (value, max, label) => { if (!Array.isArray(value) || value.length > max) invalid(`${label}: maximal ${max} Einträge.`); return value; };
export function validateDocument(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid('Dokument erforderlich.');
  if (!['lp','google','meta','other','newsletter'].includes(input.kind)) invalid('Unbekanntes Format.');
  const base = {kind:input.kind, slug:slug(input.slug), name:text(input.name,120,'Interner Name'), campaign:text(input.campaign,120,'Kampagne',true)};
  if (input.mode === 'custom') {
    if (input.kind === 'newsletter') invalid('Newsletter unterstützen keinen ausführbaren Customcode.');
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
  if (doc.kind === 'newsletter') throw new MarketingError(409, 'Newsletter werden nur exportiert. Versand und öffentliche Archive sind nicht eingerichtet.');

}

export const surface = kind => kind === 'lp' ? 'lp' : 'ads';

export function assetPath(value){if(typeof value!=='string'||value.length>180||!/^\/[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(value)||value.includes('//')||value.split('/').some(p=>p==='.'||p==='..')||value.endsWith('/'))invalid('Virtueller Pfad ungültig. Beispiel: /bilder/cover.jpg');return value;}
