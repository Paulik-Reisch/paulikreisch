import {createHmac,hkdfSync,randomBytes} from 'node:crypto';
import {tokenFor,tokenId,checkToken} from './tokens.mjs';
/** Newsletter recipient state machine. Deliberately independent from the legacy
 * Firestore "subscribers" collection: old entries have no consent evidence and
 * are never imported or marked active here. A recipient is mailable only in
 * status "active", which is reached only through a double opt-in confirmation.
 * Statuses: pending -> active -> unsubscribed; suppressed (bounce/complaint)
 * is terminal for sending and is never revived by a new sign-up. */
export const CONFIRM_TTL_MS=7*24*3600*1000,RESEND_CONFIRM_MS=10*60*1000;
const EMAIL=/^[^\s@<>"',;()\\]{1,64}@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
export function normalizeEmail(value){
  if(typeof value!=='string')return null;
  const email=value.trim().toLowerCase();
  return email.length<=254&&EMAIL.test(email)&&!email.includes('..')?email:null;
}
const note=(record,action,at)=>{record.history=[...(record.history??[]),{action,at}].slice(-20);};
/** One record per recipient. The record id is a keyed hash of the normalized
 * address in UUID shape, so a record can be found by address without a query or
 * an address-bearing key, and two concurrent sign-ups for one address hit the
 * same document (the transaction serializes them). Without the server secret
 * the id cannot be derived from or reversed into an address. */
export function recipientId(secret,email){
  if(typeof secret!=='string'||secret.length<32)throw Error('Server key missing.');
  const h=createHmac('sha256',Buffer.from(hkdfSync('sha256',secret,'paulikreisch-newsletter-v1','record-id',32))).update(email).digest();
  const b=Buffer.from(h.subarray(0,16));b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;
  const x=b.toString('hex');return `${x.slice(0,8)}-${x.slice(8,12)}-${x.slice(12,16)}-${x.slice(16,20)}-${x.slice(20)}`;
}
export class NewsletterSubscribers {
  /** store.update(id, fn): fn(record|null) returns {value, record?}; a returned
   * record is saved atomically, no record means no write. store.list() returns
   * a copy of all records. */
  /** `secret` signs new tokens. `previousSecrets` still verify tokens already mailed
   * out, so rotating the token secret never breaks unsubscribe links. `idKey`
   * derives record ids from addresses (pseudonymous, not anonymous) and must NOT
   * be rotated without migrating records; it is separate from the token secret
   * for exactly that reason (suppression lookup depends on it). */
  constructor(store,{secret,previousSecrets=[],idKey=secret,now=()=>new Date().toISOString()}){this.store=store;this.secret=secret;this.previous=previousSecrets;this.idKey=idKey;this.now=now;}
  tokenOk(purpose,token,id,extra=''){return [this.secret,...this.previous].some(k=>checkToken(k,purpose,token,id,extra));}
  /** Registers consent intent. Always returns the same outward shape; callers
   * must show the same neutral message for every outcome (no address probing).
   * `confirmToken` is set only when a confirmation mail should be sent now. */
  async subscribe(input,{source,consentText,consentVersion}){
    const email=normalizeEmail(input);
    if(!email)return {ok:false,reason:'invalid'};
    if(typeof consentText!=='string'||consentText.length<10||typeof consentVersion!=='string'||!consentVersion)throw Error('Consent evidence required.');
    const at=this.now(),id=recipientId(this.idKey,email);
    return this.store.update(id,old=>{
      const none={ok:true,confirmToken:null,email:null};
      if(old?.status==='suppressed'||old?.status==='active')return {value:none};
      if(old?.status==='pending'&&Date.parse(at)-Date.parse(old.confirmSentAt)<RESEND_CONFIRM_MS)return {value:none};
      const r=old?structuredClone(old):{id,email,status:'pending',createdAt:at};
      // Fresh consent evidence for this exact confirmation round. Earlier
      // unsubscribes stay in the history; they are never erased.
      r.status='pending';r.consent={text:consentText,version:consentVersion,source:String(source??'unknown').slice(0,80),requestedAt:at};
      r.confirmNonce=randomBytes(16).toString('hex');r.confirmSentAt=at;
      note(r,'subscribe-request',at);
      return {record:r,value:{ok:true,confirmToken:tokenFor(this.secret,'confirm',id,r.confirmNonce),email}};
    });
  }
  async confirm(token){
    const id=tokenId(token);if(!id)return {ok:false};
    const at=this.now();
    return this.store.update(id,old=>{
      const r=old&&structuredClone(old);
      if(!r||r.status!=='pending'||!r.confirmNonce||!this.tokenOk('confirm',token,id,r.confirmNonce))return {value:{ok:false}};
      if(Date.parse(at)-Date.parse(r.confirmSentAt)>CONFIRM_TTL_MS)return {value:{ok:false,expired:true}};
      r.status='active';r.confirmedAt=at;delete r.confirmNonce;note(r,'confirmed',at);
      return {record:r,value:{ok:true}};
    });
  }
  async unsubscribe(token){
    const id=tokenId(token);if(!id)return {ok:false};
    const at=this.now();
    return this.store.update(id,old=>{
      if(!old||!this.tokenOk('unsubscribe',token,id))return {value:{ok:false}};
      if(old.status==='unsubscribed'||old.status==='suppressed')return {value:{ok:true}};
      const r=structuredClone(old);r.status='unsubscribed';r.unsubscribedAt=at;delete r.confirmNonce;note(r,'unsubscribed',at);
      return {record:r,value:{ok:true}};
    });
  }
  /** Bounce/complaint webhooks. Applies to unknown addresses harmlessly. */
  async suppress(input,reason){
    const email=normalizeEmail(input);if(!email)return {ok:false};
    const at=this.now(),id=recipientId(this.idKey,email);
    return this.store.update(id,old=>{
      const r=old?structuredClone(old):{id,email,status:'suppressed',createdAt:at};
      r.status='suppressed';r.suppressedAt=at;r.suppressedReason=String(reason).slice(0,40);delete r.confirmNonce;note(r,'suppressed',at);
      return {record:r,value:{ok:true}};
    });
  }
  unsubscribeToken(record){return tokenFor(this.secret,'unsubscribe',record.id);}
  /** Mailable recipients only: status active with a confirmation timestamp.
   * Returns {id,email,unsubscribeToken}. Never includes pending, unsubscribed
   * or suppressed records, and never legacy data. */
  async mailable(){
    return (await this.store.list()).filter(r=>r.status==='active'&&r.confirmedAt&&r.consent).map(r=>({id:r.id,email:r.email,unsubscribeToken:this.unsubscribeToken(r)}));
  }
  async counts(){
    const out={pending:0,active:0,unsubscribed:0,suppressed:0};
    for(const r of await this.store.list())out[r.status]=(out[r.status]??0)+1;
    return out;
  }
}
export class MemorySubscriberStore {
  constructor(){this.map=new Map();this.queue=Promise.resolve();}
  async list(){return structuredClone([...this.map.values()]);}
  async update(id,fn){const next=this.queue.then(()=>{const {value,record}=fn(this.map.has(id)?structuredClone(this.map.get(id)):null);if(record)this.map.set(id,structuredClone(record));return structuredClone(value);});this.queue=next.catch(()=>{});return next;}
}
