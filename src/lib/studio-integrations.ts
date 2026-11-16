import type {Bucket} from '@google-cloud/storage';
import {PrivateAssetService,type Actor,type AssetRecord} from './private-asset-service';
import {assetRepository,privateObjectStore} from './private-asset-adapters';
import {verifyPrivateAssetContent} from './private-asset-content';
import {PROPOSED_UPLOAD_POLICY,type PrivateAsset} from './private-asset-model';
import {shortLinkRepository} from './short-links-adapters';
import {createManagedShortLink} from './short-link-create';
import {SHORT_LINK_CODE,SHORT_LINK_ORIGIN,validateShortLinkLabel,validateShortLinkTarget,validateShortLinkCampaign,type ShortLink} from './short-links';

/** Error carrying an HTTP status. 4xx messages are user-safe German text. */
const fail:(status:number,message:string)=>never=(status,message)=>{throw Object.assign(new Error(message),{status})};
const mapServiceError=(error:unknown):never=>{
  const message=error instanceof Error?error.message:'';
  if(/inzwischen geändert|Zwischenzeitlich/.test(message))fail(409,message+' Bitte neu laden.');
  if(/nicht gefunden/i.test(message))fail(404,message);
  if(/Nicht berechtigt/.test(message))fail(403,message);
  fail(400,message||'Aktion fehlgeschlagen.');
};

export type StudioFile=PrivateAsset;
export interface StudioFiles {
  policy:{maxBytes:number;types:readonly string[]};
  list(actor:Actor,cursor?:string):Promise<{records:StudioFile[];nextCursor?:string}>;
  pending(actor:Actor):Promise<{pending:{id:string;name:string;size:number;type:string}[];failedIds:string[];incomplete:boolean}>;
  upload(actor:Actor,file:{name:string;type:string;bytes:Uint8Array}):Promise<StudioFile>;
  setStatus(actor:Actor,id:string,revision:string,action:'publish'|'withdraw',confirmed:boolean):Promise<StudioFile>;
  remove(actor:Actor,id:string,revision:string,confirmed:boolean):Promise<{blobDeleted:boolean}>;
  retry(actor:Actor,id:string):Promise<'completed'|'blob-pending'>;
}
const visible=(record:AssetRecord):StudioFile=>({id:record.id,name:record.name,size:record.size,type:record.type,status:record.status,revision:record.revision,publicUrl:record.status==='published'?`https://static.paulikreisch.de/f/${record.id}`:undefined});
const checkId=(id:unknown):string=>{if(typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))fail(400,'Ungültige Datei-ID.');return id};
const checkRevision=(revision:unknown):string=>{if(typeof revision!=='string'||!/^\d+$/.test(revision))fail(409,'Zwischenstand unbekannt. Bitte neu laden.');return revision};

/** Private upload/share/delete library on the exact manager host, reusing the
 * audited private-asset service, bucket layout and content verification.
 * Records stay shared with static.paulikreisch.de; nothing is duplicated or migrated. */
export function createStudioFiles(bucket:Bucket):StudioFiles{
  const service=new PrivateAssetService(assetRepository(bucket),privateObjectStore(bucket),PROPOSED_UPLOAD_POLICY,verifyPrivateAssetContent);
  return {
    policy:PROPOSED_UPLOAD_POLICY,
    async list(actor,cursor){try{const result=await service.list(actor,cursor);return {records:result.records.map(visible),nextCursor:result.nextCursor}}catch(error){return mapServiceError(error)}},
    async pending(actor){try{return await service.pendingDeletions(actor)}catch(error){return mapServiceError(error)}},
    async upload(actor,file){
      if(!file||typeof file.name!=='string'||typeof file.type!=='string'||!(file.bytes instanceof Uint8Array)||!file.bytes.byteLength)fail(400,'Datei fehlt.');
      try{return visible(await service.upload(actor,file))}catch(error){return mapServiceError(error)}
    },
    async setStatus(actor,id,revision,action,confirmed){
      if(confirmed!==true)fail(400,'Bitte ausdrücklich bestätigen.');
      try{return visible(await service.changePublication(actor,checkId(id),checkRevision(revision),action,true))}catch(error){return mapServiceError(error)}
    },
    async remove(actor,id,revision,confirmed){
      if(confirmed!==true)fail(400,'Bitte das Löschen ausdrücklich bestätigen.');
      try{const result=await service.removeAsset(actor,checkId(id),checkRevision(revision),true);return {blobDeleted:result.blobDeleted}}catch(error){return mapServiceError(error)}
    },
    async retry(actor,id){try{return await service.retryRemove(actor,checkId(id))}catch(error){return mapServiceError(error)}},
  };
}

export type StudioLink=ShortLink&{url:string};
export interface StudioLinks {
  list(cursor?:string):Promise<{records:StudioLink[];nextCursor?:string}>;
  create(fields:{label:unknown;target:unknown;campaign?:unknown},format:unknown,customCode:unknown):Promise<StudioLink>;
  update(code:string,revision:string,fields:{label:unknown;target:unknown;campaign?:unknown}):Promise<void>;
  setActive(code:string,revision:string,active:boolean):Promise<void>;
  remove(code:string,revision:string,confirmed:boolean):Promise<void>;
}
const withUrl=(record:ShortLink):StudioLink=>({...record,url:`${SHORT_LINK_ORIGIN}/${record.code}`});
const checkCode=(code:unknown):string=>{if(typeof code!=='string'||!SHORT_LINK_CODE.test(code))fail(404,'Nicht gefunden.');return code};

/** Campaign short links on the exact manager host, reusing the audited
 * repository and records shared with analytics.paulikreisch.de/links.
 * Aggregate request counts only; no per-person click data is added. */
export function createStudioLinks(bucket:Bucket):StudioLinks{
  const repo=shortLinkRepository(bucket);
  return {
    async list(cursor){
      if(cursor!==undefined&&typeof cursor!=='string')fail(400,'Ungültige Folgeseite.');
      try{const result=await repo.list(cursor);return {records:result.records.map(withUrl),nextCursor:result.nextCursor}}catch(error){return mapServiceError(error)}
    },
    async create(fields,format,customCode){
      let label:string,target:string,campaign:string;
      try{label=validateShortLinkLabel(fields?.label);target=validateShortLinkTarget(fields?.target);campaign=validateShortLinkCampaign(fields?.campaign);}catch(error){return fail(400,(error as Error).message)}
      let code:string;
      try{code=await createManagedShortLink(repo,{label,target,campaign},format,customCode);}catch(error){return mapServiceError(error)}
      const record=await repo.get(code);
      if(!record)return fail(409,'Kurzlink konnte nicht bestätigt werden. Bitte Liste neu laden.');
      return withUrl(record);
    },
    async update(code,revision,fields){
      let label:string,target:string,campaign:string;
      try{label=validateShortLinkLabel(fields?.label);target=validateShortLinkTarget(fields?.target);campaign=validateShortLinkCampaign(fields?.campaign);}catch(error){return fail(400,(error as Error).message)}
      try{await repo.update(checkCode(code),checkRevision(revision),{label,target,campaign});}catch(error){return mapServiceError(error)}
    },
    async setActive(code,revision,active){
      if(typeof active!=='boolean')fail(400,'Ungültiger Status.');
      try{await repo.setActive(checkCode(code),checkRevision(revision),active);}catch(error){return mapServiceError(error)}
    },
    async remove(code,revision,confirmed){
      if(confirmed!==true)fail(400,'Bitte das Löschen ausdrücklich bestätigen.');
      try{await repo.delete(checkCode(code),checkRevision(revision));}catch(error){return mapServiceError(error)}
    },
  };
}
