import {randomUUID} from 'node:crypto';
import {validateAssetCandidate,type UploadPolicy,type PrivateAsset} from './private-asset-model';
export type AssetRecord=PrivateAsset & {objectKey:string;generation:string;createdBy:string};
export type VerifiedAsset={bytes:Uint8Array;type:string;safeName:string};
export interface AssetRepository {
 create(record:AssetRecord):Promise<void>;
 get(id:string):Promise<AssetRecord|null>;
 list?(cursor?:string):Promise<{records:AssetRecord[];nextCursor?:string}>;
 setStatus(id:string,revision:string,status:'private'|'published'):Promise<AssetRecord>;
 /** Removes the metadata sidecar with an exact-generation precondition. 404 is already-removed. */
 remove(id:string,revision:string):Promise<void>;
 /** Durable private cleanup record written BEFORE the discovery sidecar is removed, so a later blob failure never loses recovery information. Returns the tombstone generation. */
 stageDeletion(record:AssetRecord,actorEmail:string):Promise<string>;
 /** 'completed' removes the cleanup record after a confirmed blob delete; 'blob-pending' keeps it marked for a later cleanup run. */
 resolveDeletion(id:string,stage:string,outcome:'completed'|'blob-pending'):Promise<void>;
 /** Fresh read of the durable cleanup record for a retry: fresh metadata, private ACL, no public token, exact-shape validation. Returns the record plus its current generation as revision, or null when nothing is pending. */
 getDeletion(id:string):Promise<{tombstone:DeletionRecord;revision:string}|null>;
 /** Lists validated pending cleanup records so a pending deletion stays visible and retriable after a reload. failedIds names records that could not be read or validated; incomplete=true means the listing itself failed or hit the bounded page cap. An empty records list with failedIds empty and incomplete false is the only state that means genuinely nothing pending. */
 listDeletions?():Promise<{records:DeletionRecord[];failedIds:string[];incomplete:boolean}>;
}
export type PendingRemoval={id:string;name:string;size:number;type:string};
export type DeletionRecord={id:string;objectKey:string;generation:string;size:number;name:string;type?:string;createdBy:string;deletedBy:string;stagedAt:string;state:string};
export interface PrivateObjectStore {
 /** Must explicitly set private ACL, no Firebase download token, immutable generation and no public URL. */
 putPrivate(key:string,data:Uint8Array,type:string):Promise<{generation:string}>;
 /** Fresh metadata/ACL/token/size verification immediately before an exact-generation+metageneration delete. 404 is already-gone. */
 deleteVerified(key:string,expected:{generation:string;size:number}):Promise<void>;
 deleteGeneration(key:string,generation:string):Promise<void>;
 readGeneration(key:string,generation:string):Promise<Uint8Array>;
}
export type Actor={email:string;verified:boolean}|null;
export const PRIVATE_ASSET_PREFIX='managed-private-v1/';
const administrators=new Set(['philipp.l.paulik@gmail.com','maximilian.reisch@t-online.de']);
export function requireAssetAdmin(actor:Actor):string {
 if(!actor?.verified||!administrators.has(actor.email))throw new Error('Nicht berechtigt.');return actor.email;
}
/** Dependency-injected service. No production adapter or route is activated by this module. */
export class PrivateAssetService {
 constructor(private readonly repo:AssetRepository,private readonly objects:PrivateObjectStore,private readonly policy:UploadPolicy,private readonly verifyContent:(bytes:Uint8Array,type:string,name:string)=>Promise<VerifiedAsset>){}
 async list(actor:Actor,cursor?:string){requireAssetAdmin(actor);if(!this.repo.list)throw new Error('Dateiliste nicht verfügbar.');return this.repo.list(cursor);}
 async upload(actor:Actor,file:{name:string;type:string;bytes:Uint8Array}):Promise<AssetRecord>{
 const email=requireAssetAdmin(actor);const error=validateAssetCandidate({name:file.name,type:file.type,size:file.bytes.byteLength},this.policy);if(error)throw new Error(error);
 const safe=await this.verifyContent(file.bytes,file.type,file.name);if(!safe.bytes.byteLength||safe.bytes.byteLength>this.policy.maxBytes||safe.type!==file.type)throw new Error('Inhaltsprüfung fehlgeschlagen.');
 const id=randomUUID();const objectKey=PRIVATE_ASSET_PREFIX+id;const {generation}=await this.objects.putPrivate(objectKey,safe.bytes,safe.type);
 const record:AssetRecord={id,name:safe.safeName,size:safe.bytes.byteLength,type:safe.type,status:'private',revision:randomUUID(),objectKey,generation,createdBy:email};
 try{await this.repo.create(record);const persisted=await this.repo.get(id);if(!persisted)throw new Error('Private Metadaten konnten nicht bestätigt werden.');return persisted}catch(error){try{await this.objects.deleteGeneration(objectKey,generation)}catch{throw new Error('Metadaten konnten nicht gespeichert werden. Private Datei muss zur Bereinigung geprüft werden.')}throw error}
 }
 async changePublication(actor:Actor,id:string,revision:string,action:'publish'|'withdraw',confirmed:boolean){
 requireAssetAdmin(actor);if(!confirmed)throw new Error('Bitte die Freigabe ausdrücklich bestätigen.');const record=await this.repo.get(id);if(!record)throw new Error('Datei nicht gefunden.');if(record.revision!==revision)throw new Error('Die Datei wurde inzwischen geändert.');const status=action==='publish'?'published':'private';if(record.status===status)throw new Error('Status ist bereits gesetzt.');return this.repo.setStatus(id,revision,status);
 }
 /** Deliberate delete. A published file first becomes inaccessible via CAS. A durable cleanup record is staged before the discovery sidecar is removed: a blob failure can neither leave a working public gateway nor lose recovery information. blobDeleted=false means the entry is gone but the private blob remains tracked by the cleanup record. */
 async removeAsset(actor:Actor,id:string,revision:string,confirmed:boolean):Promise<{record:AssetRecord;blobDeleted:boolean}>{
 const email=requireAssetAdmin(actor);if(!confirmed)throw new Error('Bitte das Löschen ausdrücklich bestätigen.');const record=await this.repo.get(id);if(!record)throw new Error('Datei nicht gefunden.');if(record.revision!==revision)throw new Error('Die Datei wurde inzwischen geändert.');
 // Exact binding: a corrupt or stale sidecar must never target another object under the shared prefix (e.g. shortlinks).
 if(record.objectKey!==PRIVATE_ASSET_PREFIX+record.id||!/^\d+$/.test(record.generation)||!Number.isSafeInteger(record.size)||!administrators.has(record.createdBy))throw new Error('Ungültiger Dateiverweis.');
 let current=record;
 if(record.status==='published')current=await this.repo.setStatus(id,revision,'private');
 const stage=await this.repo.stageDeletion(current,email);
 await this.repo.remove(id,current.revision);
 try{await this.objects.deleteVerified(current.objectKey,{generation:current.generation,size:current.size})}catch(error){
 if((error as {code?:number}).code===404){await this.repo.resolveDeletion(id,stage,'completed');return {record:current,blobDeleted:true}}
 await this.repo.resolveDeletion(id,stage,'blob-pending').catch(()=>{});return {record:current,blobDeleted:false};
 }
 try{await this.repo.resolveDeletion(id,stage,'completed')}catch{/* blob confirmed gone; a leftover cleanup record is retried and resolves itself */}return {record:current,blobDeleted:true};
 }
 /** Retry of a previously staged deletion. Idempotent: no pending record means the delete already completed; an already-removed blob counts as success. The same exact binding and owner policy as the original delete apply to the recovery record. Reconciles the discovery sidecar first: a failed remove during the original delete can leave it in place, and a concurrent republish or change must stop the retry with an explicit conflict instead of deleting under changed state. */
 async retryRemove(actor:Actor,id:string):Promise<'completed'|'blob-pending'>{
 requireAssetAdmin(actor);const found=await this.repo.getDeletion(id);if(!found)return 'completed';const {tombstone,revision}=found;
 if(tombstone.objectKey!==PRIVATE_ASSET_PREFIX+tombstone.id||!/^\d+$/.test(tombstone.generation)||!Number.isSafeInteger(tombstone.size)||!administrators.has(tombstone.createdBy))throw new Error('Ungültiger Bereinigungseintrag.');
 const sidecar=await this.repo.get(id);
 if(sidecar){
 if(sidecar.objectKey!==tombstone.objectKey||sidecar.generation!==tombstone.generation||sidecar.size!==tombstone.size||!administrators.has(sidecar.createdBy))throw new Error('Die Datei wurde inzwischen geändert. Bereinigung pausiert, bitte aktuellen Stand prüfen.');
 if(sidecar.status==='published')throw new Error('Die Datei wurde inzwischen erneut freigegeben. Bereinigung pausiert, bitte aktuellen Stand prüfen.');
 await this.repo.remove(id,sidecar.revision);
 }
 try{await this.objects.deleteVerified(tombstone.objectKey,{generation:tombstone.generation,size:tombstone.size})}catch(error){
 if((error as {code?:number}).code===404){await this.repo.resolveDeletion(id,revision,'completed');return 'completed'}
 await this.repo.resolveDeletion(id,revision,'blob-pending').catch(()=>{});return 'blob-pending';
 }
 await this.repo.resolveDeletion(id,revision,'completed');return 'completed';
 }
 /** Pending deletions for the management view: durable, so they survive reloads and remain retriable. */
 async pendingDeletions(actor:Actor):Promise<{pending:PendingRemoval[];failedIds:string[];incomplete:boolean}>{requireAssetAdmin(actor);if(!this.repo.listDeletions)return {pending:[],failedIds:[],incomplete:false};const {records,failedIds,incomplete}=await this.repo.listDeletions();const pending:PendingRemoval[]=[];const failed=[...failedIds];for(const t of records){if(t.objectKey!==PRIVATE_ASSET_PREFIX+t.id||!/^\d+$/.test(t.generation)||!Number.isSafeInteger(t.size)||!administrators.has(t.createdBy)){failed.push(t.id);continue}pending.push({id:t.id,name:t.name,size:t.size,type:t.type??'application/octet-stream'})}return {pending,failedIds:failed,incomplete}}
 async read(actor:Actor,id:string):Promise<{record:AssetRecord;bytes:Uint8Array}>{
 const record=await this.repo.get(id);if(!record)throw new Error('Datei nicht gefunden.');if(record.status!=='published')requireAssetAdmin(actor);
 if(!record.objectKey.startsWith(PRIVATE_ASSET_PREFIX)||!record.generation)throw new Error('Ungültiger Dateiverweis.');
 return {record,bytes:await this.objects.readGeneration(record.objectKey,record.generation)};
 }
}
