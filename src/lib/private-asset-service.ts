import {randomUUID} from 'node:crypto';
import {validateAssetCandidate,type UploadPolicy,type PrivateAsset} from './private-asset-model';
export type AssetRecord=PrivateAsset & {objectKey:string;generation:string;createdBy:string};
export type VerifiedAsset={bytes:Uint8Array;type:string;safeName:string};
export interface AssetRepository {
 create(record:AssetRecord):Promise<void>;
 get(id:string):Promise<AssetRecord|null>;
 list?(cursor?:string):Promise<{records:AssetRecord[];nextCursor?:string}>;
 setStatus(id:string,revision:string,status:'private'|'published'):Promise<AssetRecord>;
}
export interface PrivateObjectStore {
 /** Must explicitly set private ACL, no Firebase download token, immutable generation and no public URL. */
 putPrivate(key:string,data:Uint8Array,type:string):Promise<{generation:string}>;
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
 async read(actor:Actor,id:string):Promise<{record:AssetRecord;bytes:Uint8Array}>{
 const record=await this.repo.get(id);if(!record)throw new Error('Datei nicht gefunden.');if(record.status!=='published')requireAssetAdmin(actor);
 if(!record.objectKey.startsWith(PRIVATE_ASSET_PREFIX)||!record.generation)throw new Error('Ungültiger Dateiverweis.');
 return {record,bytes:await this.objects.readGeneration(record.objectKey,record.generation)};
 }
}
