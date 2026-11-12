import type {Bucket} from '@google-cloud/storage';
import type {AssetRecord,AssetRepository,PrivateObjectStore} from './private-asset-service';
import {PRIVATE_ASSET_PREFIX} from './private-asset-service';
async function requirePrivateAcl(file:ReturnType<Bucket['file']>){const [entries]=await file.acl.get();const acl=Array.isArray(entries)?entries:[entries];if(!acl.length||acl.some(x=>x.entity==='allUsers'||x.entity==='allAuthenticatedUsers'))throw new Error('Öffentliche Objektberechtigung erkannt.');}
/** Private sidecar records avoid the existing public Firestore read policy entirely.
 * Dormant factory: callers must pass the approved bucket, no network calls on import.
 */
export function assetRepository(bucket:Bucket):AssetRepository{
 const fileFor=(id:string)=>{if(!/^[a-f0-9-]{36}$/.test(id))throw new Error('Ungültige Datei-ID.');return bucket.file(PRIVATE_ASSET_PREFIX+'metadata/'+id+'.json')};
 const read=async(id:string)=>{const file=fileFor(id);try{const [meta]=await file.getMetadata();if(Number(meta.size)>16384)throw new Error('Ungültige Dateimetadaten.');const fixed=bucket.file(file.name,{generation:meta.generation});await requirePrivateAcl(fixed);if(meta.metadata?.firebaseStorageDownloadTokens)throw new Error('Öffentliches Downloadtoken erkannt.');const [bytes]=await fixed.download();if(bytes.length>16384)throw new Error('Ungültige Dateimetadaten.');const data=JSON.parse(bytes.toString()) as AssetRecord;if(data.id!==id||!meta.generation||data.objectKey!==PRIVATE_ASSET_PREFIX+id||!/^\d+$/.test(data.generation)||!['private','published'].includes(data.status)||!['image/png','image/jpeg','image/webp','application/pdf','text/plain'].includes(data.type)||!Number.isSafeInteger(data.size)||data.size<1||data.size>5242880||typeof data.name!=='string'||data.name.length>180)throw new Error('Ungültige Dateimetadaten.');return {...data,revision:String(meta.generation)}}catch(error){if((error as {code?:number}).code===404)return null;throw error}};
 const save=async(record:AssetRecord,generation:number|string)=>{await fileFor(record.id).save(JSON.stringify(record),{resumable:false,predefinedAcl:'private',validation:'crc32c',preconditionOpts:{ifGenerationMatch:generation},metadata:{contentType:'application/json',cacheControl:'private, no-store, max-age=0'}})};
 return {
 async create(record){await save(record,0)},
 get:read,
 async list(cursor){if(cursor&&cursor.length>4096)throw new Error('Ungültige Folgeseite.');const [files,next]=await bucket.getFiles({prefix:PRIVATE_ASSET_PREFIX+'metadata/',maxResults:25,autoPaginate:false,pageToken:cursor});const records:AssetRecord[]=[];for(const file of files){const match=file.name.match(/metadata\/([a-f0-9-]{36})\.json$/);if(!match)continue;const record=await read(match[1]);if(record)records.push(record)}return {records,nextCursor:next?.pageToken}},
 async setStatus(id,revision,status){const current=await read(id);if(!current)throw new Error('Datei nicht gefunden.');if(current.revision!==revision)throw new Error('Die Datei wurde inzwischen geändert.');const next={...current,status};await save(next,revision);return (await read(id))!}
 };
}
export function privateObjectStore(bucket:Bucket):PrivateObjectStore{
 const verifyKey=(key:string)=>{if(!key.startsWith(PRIVATE_ASSET_PREFIX)||!/^managed-private-v1\/[a-f0-9-]{36}$/.test(key))throw new Error('Ungültiger Dateiverweis.')};
 return {
 async putPrivate(key,data,type){verifyKey(key);const file=bucket.file(key);await file.save(Buffer.from(data),{resumable:false,predefinedAcl:'private',validation:'crc32c',preconditionOpts:{ifGenerationMatch:0},metadata:{contentType:type,cacheControl:'private, no-store, max-age=0',contentDisposition:'attachment'}});const [meta]=await file.getMetadata();try{await requirePrivateAcl(file);if(!meta.generation||meta.metadata?.firebaseStorageDownloadTokens)throw new Error('Private Speicherbestätigung fehlgeschlagen.');return {generation:String(meta.generation)}}catch(error){if(meta.generation){try{await bucket.file(key,{generation:meta.generation}).delete({ifGenerationMatch:meta.generation})}catch{throw new Error('Speicherprüfung fehlgeschlagen. Datei konnte nicht automatisch entfernt werden. Zugriff und Bereinigung müssen geprüft werden.')}}throw error}},
 async deleteGeneration(key,generation){verifyKey(key);await bucket.file(key,{generation}).delete({ifGenerationMatch:generation})},
 async readGeneration(key,generation){verifyKey(key);const file=bucket.file(key,{generation});const [meta]=await file.getMetadata();await requirePrivateAcl(file);if(meta.metadata?.firebaseStorageDownloadTokens)throw new Error('Öffentliches Downloadtoken erkannt.');if(Number(meta.size)>5*1024*1024||!Number.isFinite(Number(meta.size)))throw new Error('Datei zu groß.');const [data]=await file.download({validation:'crc32c'});if(data.length>5*1024*1024)throw new Error('Datei zu groß.');return data}
 };
}
