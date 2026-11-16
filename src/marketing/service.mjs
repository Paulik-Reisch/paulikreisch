import {randomUUID} from 'node:crypto';
import {validateDocument, publicationCheck, MarketingError, surface} from './model.mjs';
/** Storage contract: mutate(id, callback) must hold a distributed lock or use
 * generation preconditions. callback sees null or the latest JSON record.
 * It returns {record, value}. list() returns private records to authorized code.
 * Public documents live in immutable snapshots inside the same atomic record.
 */
export class MarketingService {
  constructor(storage,{now=()=>new Date().toISOString()}={}) {this.storage=storage;this.now=now;}
  async list() { return (await this.storage.list()).map(({id,draft,published,revision,updated})=>({id,name:draft.name,slug:draft.slug,kind:draft.kind,campaign:draft.campaign,revision,updated,published:!!published,unpublishedChanges:!!published&&published.revision!==revision})); }
  async get(id) {const record=await this.storage.get(id); if(!record) throw new MarketingError(404,'Nicht gefunden.'); return record;}
  async create(input,actor) {
    const draft=validateDocument(input),id=randomUUID(),now=this.now();
    return this.storage.mutate(id, current=>{if(current)throw new MarketingError(409,'ID-Konflikt.');const record={id,draft,published:null,revision:1,created:now,updated:now,audit:[{action:'create',actor,at:now}]};return {record,value:record};});
  }
  async update(id,input,expectedRevision,actor) {const draft=validateDocument(input);return this.change(id,expectedRevision,actor,'update',r=>({...r,draft,revision:r.revision+1}));}
  async publish(id,expectedRevision,actor) {
    // One global publication transaction guarantees slug ownership. No check-
    // then-write race between two independently edited documents.
    return this.storage.publish(id,expectedRevision,actor,this.now(),publicationCheck);
  }
  async unpublish(id,expectedRevision,actor) {return this.change(id,expectedRevision,actor,'unpublish',r=>({...r,published:null,revision:r.revision+1}));}
  async remove(id,expectedRevision,actor) {return this.change(id,expectedRevision,actor,'delete',r=>{if(r.published)throw new MarketingError(409,'Zuerst Veröffentlichung zurückziehen.');return null;});}
  async change(id,expectedRevision,actor,action,fn) {
    return this.storage.mutate(id,r=>{
      if(!r)throw new MarketingError(404,'Nicht gefunden.');
      if(!Number.isSafeInteger(expectedRevision)||r.revision!==expectedRevision)throw new MarketingError(409,'Zwischenzeitlich geändert. Neu laden.');
      let record=fn(r); if(record)record={...record,updated:this.now(),audit:[...r.audit,{action,actor,at:this.now()}].slice(-100)};
      return {record,value:record??{deleted:true}};
    });
  }
  async public(slug,kind) {const record=await this.storage.findPublished(slug,kind);if(!record?.published)throw new MarketingError(404,'Nicht gefunden.');return record.published.document;}
}
/** Test/development adapter only. Never use for production persistence. */
export class MemoryStorage {
  constructor(){this.records=new Map();this.queue=Promise.resolve();}
  async atomic(fn){const next=this.queue.then(fn);this.queue=next.catch(()=>{});return next;}
  async list(){return structuredClone([...this.records.values()]);}
  async get(id){return structuredClone(this.records.get(id)??null);}
  async mutate(id,fn){return this.atomic(()=>{const {record,value}=fn(structuredClone(this.records.get(id)??null));if(record)this.records.set(id,structuredClone(record));else this.records.delete(id);return structuredClone(value);});}
  async findPublished(slug,kind){return structuredClone([...this.records.values()].find(r=>r.published?.document.slug===slug&&(kind==='ads'?r.published.document.kind!=='lp':r.published.document.kind===kind))??null);}
  async publish(id,revision,actor,at,check){return this.atomic(()=>{const r=structuredClone(this.records.get(id));if(!r)throw new MarketingError(404,'Nicht gefunden.');if(r.revision!==revision)throw new MarketingError(409,'Zwischenzeitlich geändert.');check(r.draft);if([...this.records.values()].some(x=>x.id!==id&&x.published?.document.slug===r.draft.slug&&surface(x.published.document.kind)===surface(r.draft.kind)))throw new MarketingError(409,'URL bereits veröffentlicht.');r.revision++;r.published={document:structuredClone(r.draft),revision:r.revision,at};r.updated=at;r.audit=[...r.audit,{action:'publish',actor,at}].slice(-100);this.records.set(id,r);return structuredClone(r);});}
}
