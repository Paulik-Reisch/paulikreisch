export const SHORT_LINK_HOST = 'l.paulikreisch.de';
export const SHORT_LINK_HOSTS = [SHORT_LINK_HOST, 'link.paulikreisch.de'] as const;
export const SHORT_LINK_ORIGIN = `https://${SHORT_LINK_HOST}`;
export const SHORT_LINK_PREFIX = 'managed-private-v1/shortlinks/';
export const SHORT_LINK_CODE = /^(?:[A-Za-z0-9][A-Za-z0-9_-]{3,31}|[A-Za-z0-9_-]{16})$/;
const RESERVED_CODES = new Set(['login','links','admin','upload','acceptance','_next','api','favicon','robots','sitemap']);
export function validateCustomShortLinkCode(input:unknown):string {
  if(typeof input!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{3,31}$/.test(input)||RESERVED_CODES.has(input.toLowerCase()))throw new Error('Bitte 4 bis 32 Zeichen verwenden: Buchstaben, Ziffern, Bindestrich oder Unterstrich; Beginn mit Buchstabe oder Ziffer. Systemnamen sind reserviert.');
  return input;
}
export type ShortLink = {code:string; label:string; target:string; active:boolean; clicks:number; createdAt:string; revision?:string};
export interface ShortLinkRepository {
  create(record:ShortLink):Promise<void>;
  get(code:string):Promise<ShortLink|null>;
  list(cursor?:string):Promise<{records:ShortLink[];nextCursor?:string}>;
  setActive(code:string,revision:string,active:boolean):Promise<void>;
  update(code:string,revision:string,fields:{label:string;target:string}):Promise<void>;
  delete(code:string,revision:string):Promise<void>;
  increment(record:ShortLink):Promise<void>;
}
export function validateShortLinkTarget(input:unknown):string {
  if(typeof input!=='string'||input.length>2048||/[\u0000-\u0020\u007f\\]/.test(input))throw new Error('Bitte eine vollständige HTTPS-Zieladresse ohne Leerzeichen angeben.');
  let url:URL;try{url=new URL(input)}catch{throw new Error('Ungültige Zieladresse.')}
  const host=url.hostname.toLowerCase();
  if(url.protocol!=='https:'||url.username||url.password||(url.port&&url.port!=='443')||!host.includes('.')||host.endsWith('.')||host.startsWith('[')||/^[\d.]+$/.test(host)||/\.(?:local|localhost|internal|test|invalid)$/.test(host)||[...SHORT_LINK_HOSTS,'admin.paulikreisch.de','static.paulikreisch.de','analytics.paulikreisch.de'].includes(host))throw new Error('Nur öffentliche HTTPS-Ziele ohne Zugangsdaten sind erlaubt. Verwaltungsadressen und Kurzlink-Schleifen sind ausgeschlossen.');
  return url.href;
}
export function validateShortLinkLabel(input:unknown):string {
  if(typeof input!=='string'||!input.trim()||input.trim().length>100||/[\u0000-\u001f\u007f]/.test(input))throw new Error('Bitte einen Namen mit höchstens 100 Zeichen angeben.');
  return input.trim();
}
export function isShortLink(value:unknown,code:string):value is ShortLink {
  if(!value||typeof value!=='object')return false;
  const r=value as ShortLink;
  if(Object.keys(r).some(key=>!['code','label','target','active','clicks','createdAt','revision'].includes(key)))return false;
  try{return SHORT_LINK_CODE.test(code)&&r.code===code&&validateShortLinkLabel(r.label)===r.label&&validateShortLinkTarget(r.target)===r.target&&typeof r.active==='boolean'&&Number.isSafeInteger(r.clicks)&&r.clicks>=0&&r.clicks<=Number.MAX_SAFE_INTEGER&&typeof r.createdAt==='string'&&!Number.isNaN(Date.parse(r.createdAt));}catch{return false;}
}
/** GET navigations count requests, never people. HEAD and prefetches are not clicks. */
export function shouldCountShortLink(method:string,headers:{get(name:string):string|null}):boolean {
  return method==='GET'&&!headers.get('purpose')?.toLowerCase().includes('prefetch')&&!headers.get('sec-purpose')?.toLowerCase().includes('prefetch');
}
export async function resolveShortLink(repo:ShortLinkRepository,code:string,count:boolean):Promise<string|null>{
  if(!SHORT_LINK_CODE.test(code))return null;
  const record=await repo.get(code);
  if(!record||!record.active)return null;
  // Counters are best effort. A counter conflict must not break an otherwise valid redirect.
  if(count&&record.revision&&record.clicks<Number.MAX_SAFE_INTEGER){try{await repo.increment(record)}catch{/* concurrent traffic may undercount */}}
  return record.target;
}
