import {createHmac,timingSafeEqual} from 'node:crypto';
import type {Bucket} from '@google-cloud/storage';
import {requireAssetAdmin,type Actor,PRIVATE_ASSET_PREFIX} from './private-asset-service';
export type CleanupPlan={id:string;name:string;actor:string;blobGeneration:string;blobMeta:string;sideGeneration:string;sideMeta:string;nonce:string;expires:number};
function assertId(id:string){if(!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(id))throw Error('Ungültige Datei-ID.')}
function signature(plan:CleanupPlan,key:string){if(key.length<32)throw Error('Sitzungskonfiguration fehlt.');return createHmac('sha256',key).update(JSON.stringify(plan)).digest('hex')}
function privateMeta(meta:{generation?:string|number;metageneration?:string|number;size?:string|number;metadata?:Record<string,unknown>},acl:{entity?:string}[]){if(!meta.generation||!meta.metageneration||meta.metadata?.firebaseStorageDownloadTokens||!acl.length||acl.some(x=>['allUsers','allAuthenticatedUsers'].includes(x.entity??'')))throw Error('Private Speicherinvariante fehlgeschlagen.')}
/** Acceptance only: no arbitrary filename/delete API. Exact signed plan survives partial cleanup retry. */
export function acceptanceCleanup(bucket:Bucket,nonce:string,key:string){
 if(!/^[a-f0-9]{16,48}$/.test(nonce))throw Error('Abnahmebereinigung nicht aktiviert.');
 const read=async(name:string)=>{const file=bucket.file(name);const[meta]=await file.getMetadata();const fixed=bucket.file(name,{generation:meta.generation});const[acl]=await fixed.acl.get();privateMeta(meta,Array.isArray(acl)?acl:[acl]);return {file:fixed,meta}};
 return {
 async prepare(actor:Actor,id:string){const email=requireAssetAdmin(actor);assertId(id);const side=await read(PRIVATE_ASSET_PREFIX+'metadata/'+id+'.json');if(Number(side.meta.size)>16384)throw Error('Metadaten zu groß.');const[bytes]=await side.file.download();const data=JSON.parse(bytes.toString());if(data.id!==id||data.objectKey!==PRIVATE_ASSET_PREFIX+id||data.createdBy!==email||data.status!=='private'||!['png','pdf','txt'].some(extension=>data.name==='acceptance-'+nonce+'.'+extension)||!Number.isSafeInteger(data.size)||data.size>102400)throw Error('Nur eigene private Abnahmedateien dieser Sitzung erlaubt.');const blob=await read(data.objectKey);if(String(blob.meta.generation)!==data.generation||Number(blob.meta.size)!==data.size)throw Error('Dateigeneration stimmt nicht überein.');const plan:CleanupPlan={id,name:data.name,actor:email,blobGeneration:String(blob.meta.generation),blobMeta:String(blob.meta.metageneration),sideGeneration:String(side.meta.generation),sideMeta:String(side.meta.metageneration),nonce,expires:Date.now()+15*60000};return {plan,signature:signature(plan,key)}},
 async commit(actor:Actor,plan:CleanupPlan,sig:string,confirmed:boolean){const email=requireAssetAdmin(actor);assertId(plan.id);if(!confirmed||plan.actor!==email||plan.nonce!==nonce||plan.expires<Date.now()||!/^\d+$/.test(plan.blobGeneration)||!/^\d+$/.test(plan.sideGeneration)||!/^\d+$/.test(plan.blobMeta)||!/^\d+$/.test(plan.sideMeta))throw Error('Bereinigungsbestätigung ungültig.');const expected=signature(plan,key);if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))throw Error('Bereinigungsplan ungültig.');
 const remove=async(name:string,generation:string,metageneration:string)=>{try{const current=await read(name);if(String(current.meta.generation)!==generation||String(current.meta.metageneration)!==metageneration)throw Error('Datei wurde inzwischen geändert.');await current.file.delete({ifGenerationMatch:generation,ifMetagenerationMatch:metageneration});try{await bucket.file(name).getMetadata();throw Error('Live-Objekt ist nach Bereinigung noch vorhanden.')}catch(error){if((error as {code?:number}).code!==404)throw error}}catch(error){if((error as {code?:number}).code!==404)throw error}};
 // Remove the publication sidecar first. A blob cleanup failure cannot leave a working public gateway.
 await remove(PRIVATE_ASSET_PREFIX+'metadata/'+plan.id+'.json',plan.sideGeneration,plan.sideMeta);
 await remove(PRIVATE_ASSET_PREFIX+plan.id,plan.blobGeneration,plan.blobMeta);
 return {ok:true as const,message:'Beide Live-Objekte entfernt. Soft-Delete-Kopien können bis zum Ablauf der Aufbewahrung bleiben.'};
 }
 }
}

export function acceptanceWindowOpen(nonce:string,expires:string,now=Date.now()){const until=Date.parse(expires);return /^[a-f0-9]{16,48}$/.test(nonce)&&Number.isFinite(until)&&until>now&&until-now<=24*60*60*1000}
