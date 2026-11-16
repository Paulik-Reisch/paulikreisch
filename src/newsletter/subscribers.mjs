import {randomUUID,randomBytes} from 'node:crypto';
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
export class NewsletterSubscribers {
  /** store.change(fn) runs fn(records) atomically and returns its value, as the
   * private bucket storage does. store.read() returns a copy of all records. */
  constructor(store,{secret,now=()=>new Date().toISOString()}){this.store=store;this.secret=secret;this.now=now;}
  /** Registers consent intent. Always returns the same outward shape; callers
   * must show the same neutral message for every outcome (no address probing).
   * `confirmToken` is set only when a confirmation mail should be sent now. */
  async subscribe(input,{source,consentText,consentVersion}){
    const email=normalizeEmail(input);
    if(!email)return {ok:false,reason:'invalid'};
    if(typeof consentText!=='string'||consentText.length<10||typeof consentVersion!=='string'||!consentVersion)throw Error('Consent evidence required.');
    const at=this.now();
    return this.store.change(records=>{
      let r=records.find(x=>x.email===email);
      if(r?.status==='suppressed'||r?.status==='active')return {ok:true,confirmToken:null,email:null};
      if(r?.status==='pending'&&Date.parse(at)-Date.parse(r.confirmSentAt)<RESEND_CONFIRM_MS)return {ok:true,confirmToken:null,email:null};
      if(!r){r={id:randomUUID(),email,status:'pending',createdAt:at};records.push(r);}
      // Fresh consent evidence for this exact confirmation round. Earlier
      // unsubscribes stay in the history; they are never erased.
      r.status='pending';r.consent={text:consentText,version:consentVersion,source:String(source??'unknown').slice(0,80),requestedAt:at};
      r.confirmNonce=randomBytes(16).toString('hex');r.confirmSentAt=at;
      note(r,'subscribe-request',at);
      return {ok:true,confirmToken:tokenFor(this.secret,'confirm',r.id,r.confirmNonce),email:r.email};
    });
  }
  async confirm(token){
    const id=tokenId(token);if(!id)return {ok:false};
    const at=this.now();
    return this.store.change(records=>{
      const r=records.find(x=>x.id===id);
      if(!r||r.status!=='pending'||!r.confirmNonce||!checkToken(this.secret,'confirm',token,id,r.confirmNonce))return {ok:false};
      if(Date.parse(at)-Date.parse(r.confirmSentAt)>CONFIRM_TTL_MS)return {ok:false,expired:true};
      r.status='active';r.confirmedAt=at;delete r.confirmNonce;note(r,'confirmed',at);
      return {ok:true};
    });
  }
  async unsubscribe(token){
    const id=tokenId(token);if(!id)return {ok:false};
    const at=this.now();
    return this.store.change(records=>{
      const r=records.find(x=>x.id===id);
      if(!r||!checkToken(this.secret,'unsubscribe',token,id))return {ok:false};
      if(r.status!=='unsubscribed'&&r.status!=='suppressed'){r.status='unsubscribed';r.unsubscribedAt=at;delete r.confirmNonce;note(r,'unsubscribed',at);}
      return {ok:true};
    });
  }
  /** Bounce/complaint webhooks. Applies to unknown addresses harmlessly. */
  async suppress(input,reason){
    const email=normalizeEmail(input);if(!email)return {ok:false};
    const at=this.now();
    return this.store.change(records=>{
      let r=records.find(x=>x.email===email);
      if(!r){r={id:randomUUID(),email,status:'suppressed',createdAt:at};records.push(r);}
      r.status='suppressed';r.suppressedAt=at;r.suppressedReason=String(reason).slice(0,40);delete r.confirmNonce;note(r,'suppressed',at);
      return {ok:true};
    });
  }
  unsubscribeToken(record){return tokenFor(this.secret,'unsubscribe',record.id);}
  /** Mailable recipients only: status active with a confirmation timestamp.
   * Returns {id,email,unsubscribeToken}. Never includes pending, unsubscribed
   * or suppressed records, and never legacy data. */
  async mailable(){
    return (await this.store.read()).filter(r=>r.status==='active'&&r.confirmedAt&&r.consent).map(r=>({id:r.id,email:r.email,unsubscribeToken:this.unsubscribeToken(r)}));
  }
  async counts(){
    const out={pending:0,active:0,unsubscribed:0,suppressed:0};
    for(const r of await this.store.read())out[r.status]=(out[r.status]??0)+1;
    return out;
  }
}
export class MemorySubscriberStore {
  constructor(){this.records=[];this.queue=Promise.resolve();}
  async read(){return structuredClone(this.records);}
  async change(fn){const next=this.queue.then(()=>{const copy=structuredClone(this.records);const value=fn(copy);this.records=copy;return structuredClone(value);});this.queue=next.catch(()=>{});return next;}
}
